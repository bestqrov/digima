import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Model } from 'mongoose';
import { AgencyDocument } from '../../modules/agencies/schemas/agency.schema';
import { PlanDocument } from '../../modules/plans/schemas/plan.schema';
export declare class PlanLimitsGuard implements CanActivate {
    private agencyModel;
    private planModel;
    constructor(agencyModel: Model<AgencyDocument>, planModel: Model<PlanDocument>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getLimit;
}
