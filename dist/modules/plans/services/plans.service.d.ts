import { Model } from 'mongoose';
import { Plan, PlanDocument } from '../schemas/plan.schema';
import { CreatePlanDto, UpdatePlanDto } from '../dto';
export declare class PlansService {
    private planModel;
    constructor(planModel: Model<PlanDocument>);
    create(createPlanDto: CreatePlanDto): Promise<Plan>;
    findAll(): Promise<Plan[]>;
    findById(id: string): Promise<Plan>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan>;
    remove(id: string): Promise<void>;
    checkLimits(planId: string, currentUsage: {
        vehicles: number;
        drivers: number;
        trips: number;
    }): Promise<{
        canAddVehicle: boolean;
        canAddDriver: boolean;
        canAddTrip: boolean;
        limits: {
            maxVehicles: number;
            maxDrivers: number;
            maxTripsPerMonth: number;
        };
    }>;
}
