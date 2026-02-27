import { 
  IsString, 
  IsEnum,
  IsOptional, 
  IsMongoId,
  IsDateString,
  MaxLength 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { SubscriptionStatus } from '../../../shared/enums';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Agency ID' })
  @IsMongoId()
  agencyId: string;

  @ApiProperty({ description: 'Plan ID' })
  @IsMongoId()
  planId: string;

  @ApiPropertyOptional({ description: 'Subscription status', enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ description: 'Subscription start date' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Subscription end date' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Next billing date' })
  @IsOptional()
  @IsDateString()
  nextBillingDate?: string;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ description: 'New subscription status', enum: SubscriptionStatus })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @ApiPropertyOptional({ description: 'Reason for status change' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'Next billing date' })
  @IsOptional()
  @IsDateString()
  nextBillingDate?: string;
}

export class RenewSubscriptionDto {
  @ApiProperty({ description: 'New plan ID (optional for plan change)' })
  @IsOptional()
  @IsMongoId()
  planId?: string;

  @ApiPropertyOptional({ description: 'Next billing date' })
  @IsOptional()
  @IsDateString()
  nextBillingDate?: string;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ description: 'Cancellation reason' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @ApiPropertyOptional({ description: 'End subscription immediately' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  immediate?: boolean;
}