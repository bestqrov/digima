import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Plan, PlanDocument } from '../schemas/plan.schema';
import { CreatePlanDto, UpdatePlanDto } from '../dto';
import { PlanStatus } from '../../../shared/enums';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = new this.planModel(createPlanDto);
    return plan.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel
      .find({ status: PlanStatus.ACTIVE, isVisible: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .exec();
  }

  async findById(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.planModel
      .findByIdAndUpdate(id, updatePlanDto, { new: true })
      .exec();

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  async remove(id: string): Promise<void> {
    const result = await this.planModel.findByIdAndUpdate(
      id,
      { status: PlanStatus.INACTIVE },
      { new: true }
    ).exec();

    if (!result) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
  }

  async checkLimits(planId: string, currentUsage: {
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
  }> {
    const plan = await this.findById(planId);

    return {
      canAddVehicle: currentUsage.vehicles < plan.maxVehicles,
      canAddDriver: currentUsage.drivers < plan.maxDrivers,
      canAddTrip: currentUsage.trips < plan.maxTripsPerMonth,
      limits: {
        maxVehicles: plan.maxVehicles,
        maxDrivers: plan.maxDrivers,
        maxTripsPerMonth: plan.maxTripsPerMonth,
      },
    };
  }
}