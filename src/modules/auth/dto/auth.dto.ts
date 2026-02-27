import { 
  IsEmail, 
  IsString, 
  MinLength, 
  IsOptional, 
  IsBoolean,
  IsPhoneNumber,
  IsMongoId,
  IsEnum
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ description: 'Agency name' })
  @IsString()
  @MinLength(2)
  agencyName: string;

  @ApiProperty({ description: 'Admin email' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'Admin password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Admin full name' })
  @IsString()
  @MinLength(2)
  adminName: string;

  @ApiProperty({ description: 'Phone number' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'WhatsApp number' })
  @IsOptional()
  @IsPhoneNumber()
  whatsappNumber?: string;

  @ApiProperty({ description: 'Country code (ISO)' })
  @IsString()
  countryCode: string;

  @ApiProperty({ description: 'Selected plan ID' })
  @IsMongoId()
  planId: string;

  @ApiPropertyOptional({ description: 'Marketing consent', default: false })
  @IsOptional()
  @IsBoolean()
  marketingConsent?: boolean;

  @ApiPropertyOptional({ description: 'Traffic source' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  refreshToken: string;
}

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token' })
  @IsString()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}