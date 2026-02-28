import { AgenciesService } from '../services/agencies.service';
import { CreateAgencyDto, UpdateAgencyDto } from '../dto';
export declare class AgenciesController {
    private readonly agenciesService;
    constructor(agenciesService: AgenciesService);
    create(createAgencyDto: CreateAgencyDto): Promise<import("../schemas/agency.schema").Agency>;
    findAll(): Promise<import("../schemas/agency.schema").Agency[]>;
    findOne(id: string): Promise<import("../schemas/agency.schema").Agency>;
    update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<import("../schemas/agency.schema").Agency>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<import("../schemas/agency.schema").Agency>;
    activate(id: string): Promise<import("../schemas/agency.schema").Agency>;
}
