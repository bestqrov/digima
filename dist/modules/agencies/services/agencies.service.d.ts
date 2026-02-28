import { Model } from 'mongoose';
import { Agency, AgencyDocument } from '../schemas/agency.schema';
import { CreateAgencyDto, UpdateAgencyDto } from '../dto';
export declare class AgenciesService {
    private agencyModel;
    constructor(agencyModel: Model<AgencyDocument>);
    create(createAgencyDto: CreateAgencyDto): Promise<Agency>;
    findAll(): Promise<Agency[]>;
    findById(id: string): Promise<Agency>;
    findByEmail(email: string): Promise<Agency>;
    update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency>;
    remove(id: string): Promise<void>;
    deactivate(id: string): Promise<Agency>;
    activate(id: string): Promise<Agency>;
}
