import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency, AgencyDocument } from '../schemas/agency.schema';
import { CreateAgencyDto, UpdateAgencyDto } from '../dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(Agency.name) private agencyModel: Model<AgencyDocument>,
  ) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    const existingAgency = await this.agencyModel.findOne({ email: createAgencyDto.email });
    if (existingAgency) {
      throw new ConflictException('Agency with this email already exists');
    }

    const createdAgency = new this.agencyModel(createAgencyDto);
    return createdAgency.save();
  }

  async findAll(): Promise<Agency[]> {
    return this.agencyModel.find().exec();
  }

  async findById(id: string): Promise<Agency> {
    const agency = await this.agencyModel.findById(id).exec();
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }
    return agency;
  }

  async findByEmail(email: string): Promise<Agency> {
    return this.agencyModel.findOne({ email }).exec();
  }

  async update(id: string, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const updatedAgency = await this.agencyModel.findByIdAndUpdate(
      id,
      updateAgencyDto,
      { new: true }
    ).exec();
    
    if (!updatedAgency) {
      throw new NotFoundException('Agency not found');
    }
    
    return updatedAgency;
  }

  async remove(id: string): Promise<void> {
    const result = await this.agencyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Agency not found');
    }
  }

  async deactivate(id: string): Promise<Agency> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<Agency> {
    return this.update(id, { isActive: true });
  }
}