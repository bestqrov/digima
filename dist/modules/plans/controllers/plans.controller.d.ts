import { PlansService } from '../services/plans.service';
import { CreatePlanDto, UpdatePlanDto } from '../dto';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    findAll(): Promise<import("../schemas/plan.schema").Plan[]>;
    findOne(id: string): Promise<import("../schemas/plan.schema").Plan>;
    create(createPlanDto: CreatePlanDto): Promise<import("../schemas/plan.schema").Plan>;
    update(id: string, updatePlanDto: UpdatePlanDto): Promise<import("../schemas/plan.schema").Plan>;
    remove(id: string): Promise<void>;
}
