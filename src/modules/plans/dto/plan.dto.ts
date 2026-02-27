import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsPositive 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PlanInterval, PlanStatus } from '../../../shared/enums';

export class PlanLimitsDto {
  @ApiProperty({ description: 'Maximum vehicles allowed' })
  @IsInt()
  @Min(1)
  @Max(1000)
  maxVehicles: number;

  @ApiProperty({ description: 'Maximum drivers allowed' })
  @IsInt()
  @Min(1)
  @Max(5000)
  maxDrivers: number;

  @ApiProperty({ description: 'Maximum trips per month' })
  @IsInt()
  @Min(1)
  @Max(100000)
  maxTripsPerMonth: number;

  @ApiPropertyOptional({ description: 'API rate limit per hour' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
  apiRateLimit?: number;

  @ApiPropertyOptional({ description: 'Maximum file storage in MB' })
  @IsOptional()
  @IsInt()
  @Min(100)
  @Max(100000)
  storageLimit?: number;
}

export class CreatePlanDto {
  @ApiProperty({ description: 'Plan name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Plan description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ description: 'Plan price' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ description: 'Plan interval', enum: PlanInterval })
  @IsEnum(PlanInterval)
  interval: PlanInterval;

  @ApiProperty({ description: 'Plan limits', type: PlanLimitsDto })
  @ValidateNested()
  @Type(() => PlanLimitsDto)
  limits: PlanLimitsDto;

  @ApiPropertyOptional({ description: 'Plan features' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ description: 'Plan status', enum: PlanStatus })
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus;

  @ApiPropertyOptional({ description: 'Is this a demo plan' })
  @IsOptional()
  @IsBoolean()
  isDemo?: boolean;

  @ApiPropertyOptional({ description: 'Demo duration in days' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(90)
  demoDurationDays?: number;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Is plan recommended' })
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}

export class UpdatePlanStatusDto {
  @ApiProperty({ description: 'New plan status', enum: PlanStatus })
  @IsEnum(PlanStatus)
  status: PlanStatus;

  @ApiPropertyOptional({ description: 'Reason for status change' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}