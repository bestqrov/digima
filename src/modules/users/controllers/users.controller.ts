import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { JwtAuthGuard, RolesGuard, AgencyGuard } from '../../../common/guards';
import { Roles, CurrentUser, AgencyId } from '../../../common/decorators';
import { UserRole } from '../../../shared/enums';
import { JwtPayload } from '../../../shared/interfaces';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard, AgencyGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @Get()
  findAll(@CurrentUser() user: JwtPayload, @AgencyId() agencyId: string) {
    // Filter by agency for non-super-admin users
    const filterAgencyId = user.role === UserRole.SUPER_ADMIN ? undefined : agencyId;
    return this.usersService.findAll(filterAgencyId);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}