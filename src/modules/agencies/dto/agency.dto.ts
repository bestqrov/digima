import { 
  IsString, 
  IsEmail, 
  IsBoolean, 
  IsOptional, 
  IsEnum, 
  IsPhoneNumber,
  IsMongoId,
  MinLength,
  MaxLength,
  IsUrl,
  IsDateString,
  IsInt,
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { AgencyStatus } from '../../../shared/enums';

export class CreateAgencyDto {
  @ApiProperty({ description: 'Agency name' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Agency email' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'WhatsApp number' })
  @IsOptional()
  @IsPhoneNumber()
  whatsappNumber?: string;

  @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-2)' })
  @IsString()
  @MinLength(2)
  @MaxLength(3)
  countryCode: string;

  @ApiProperty({ description: 'Plan ID' })
  @IsMongoId()
  planId: string;

  @ApiPropertyOptional({ description: 'Agency status', enum: AgencyStatus })
  @IsOptional()
  @IsEnum(AgencyStatus)
  status?: AgencyStatus;

  @ApiPropertyOptional({ description: 'Marketing consent' })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @ApiPropertyOptional({ description: 'Traffic source' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;

  @ApiPropertyOptional({ description: 'Agency address' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @ApiPropertyOptional({ description: 'Agency website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Logo URL' })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ description: 'Timezone' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Currency code (ISO 4217)' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Language code (ISO 639-1)' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(5)
  language?: string;
}

export class UpdateAgencyDto extends PartialType(CreateAgencyDto) {
  @ApiPropertyOptional({ description: 'Agency active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAgencyStatusDto {
  @ApiProperty({ description: 'New agency status', enum: AgencyStatus })
  @IsEnum(AgencyStatus)
  status: AgencyStatus;

  @ApiPropertyOptional({ description: 'Reason for status change' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class AgencyUsageDto {
  @ApiProperty({ description: 'Current vehicles count' })
  @IsInt()
  @Min(0)
  currentVehicles: number;

  @ApiProperty({ description: 'Current drivers count' })
  @IsInt()
  @Min(0)
  currentDrivers: number;

  @ApiProperty({ description: 'Current month trips count' })
  @IsInt()
  @Min(0)
  currentMonthTrips: number;
}