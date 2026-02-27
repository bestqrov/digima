import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency, AgencyDocument } from '../../modules/agencies/schemas/agency.schema';
import { Plan, PlanDocument } from '../../modules/plans/schemas/plan.schema';
import { AgencyStatus } from '../../shared/enums';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.agencyId) {
      throw new ForbiddenException('User not associated with any agency');
    }

    // Get agency with populated plan
    const agency = await this.agencyModel
      .findById(user.agencyId)
      .populate('planId')
      .exec();

    if (!agency) {
      throw new ForbiddenException('Agency not found');
    }

    // Check if agency can access the system
    if (!agency.canAccess()) {
      if (agency.isDemoExpired()) {
        throw new ForbiddenException('Demo period expired. Please upgrade your subscription.');
      }
      throw new ForbiddenException('Agency account suspended');
    }

    // If trying to activate subscription, check email verification
    const path = request.route?.path || '';
    const isActivationEndpoint = path.includes('subscription') && path.includes('activate');
    
    if (isActivationEndpoint && !agency.isEmailVerified) {
      throw new ForbiddenException('Email verification required before subscription activation');
    }

    // Store agency and plan in request for later use
    request.agency = agency;
    request.plan = agency.planId;

    return true;
  }
}