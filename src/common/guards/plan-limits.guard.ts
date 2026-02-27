import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency, AgencyDocument } from '../../modules/agencies/schemas/agency.schema';
import { Plan, PlanDocument } from '../../modules/plans/schemas/plan.schema';

interface PlanLimitsRequest {
  checkType: 'vehicle' | 'driver' | 'trip';
  currentCount?: number;
}

@Injectable()
export class PlanLimitsGuard implements CanActivate {
  constructor(
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body as PlanLimitsRequest;

    if (!user?.agencyId) {
      return false;
    }

    // Get agency with current usage
    const agency = await this.agencyModel
      .findById(user.agencyId)
      .populate('planId')
      .exec();

    if (!agency) {
      return false;
    }

    const plan = agency.planId as any;

    // Check if adding new resource would exceed limits
    const path = request.route?.path || '';
    const method = request.method;

    // Only check limits for creation endpoints
    if (method !== 'POST') {
      return true;
    }

    let exceedsLimit = false;
    let limitType = '';

    if (path.includes('vehicles')) {
      exceedsLimit = agency.currentVehicles >= plan.maxVehicles;
      limitType = 'vehicles';
    } else if (path.includes('users') && body?.checkType !== 'trip') {
      exceedsLimit = agency.currentDrivers >= plan.maxDrivers;
      limitType = 'drivers';
    } else if (path.includes('trips')) {
      exceedsLimit = agency.currentMonthTrips >= plan.maxTripsPerMonth;
      limitType = 'trips this month';
    }

    if (exceedsLimit) {
      throw new ForbiddenException(
        `Plan limit exceeded. Maximum ${limitType} allowed: ${this.getLimit(plan, limitType)}`
      );
    }

    return true;
  }

  private getLimit(plan: any, limitType: string): number {
    switch (limitType) {
      case 'vehicles':
        return plan.maxVehicles;
      case 'drivers':
        return plan.maxDrivers;
      case 'trips this month':
        return plan.maxTripsPerMonth;
      default:
        return 0;
    }
  }
}