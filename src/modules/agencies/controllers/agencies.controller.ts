import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgenciesService } from '../services/agencies.service';
import { CreateAgencyDto, UpdateAgencyDto } from '../dto';
import { JwtAuthGuard, RolesGuard } from '../../../common/guards';
import { Roles } from '../../../common/decorators';
import { UserRole } from '../../../shared/enums';

@ApiTags('Agencies')
@Controller('agencies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @ApiOperation({ summary: 'Create a new agency' })
  @ApiResponse({ status: 201, description: 'Agency created successfully' })
  @ApiResponse({ status: 409, description: 'Agency with this email already exists' })
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @ApiOperation({ summary: 'Get all agencies' })
  @ApiResponse({ status: 200, description: 'Agencies retrieved successfully' })
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  findAll() {
    return this.agenciesService.findAll();
  }

  @ApiOperation({ summary: 'Get agency by ID' })
  @ApiResponse({ status: 200, description: 'Agency retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Agency not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenciesService.findById(id);
  }

  @ApiOperation({ summary: 'Update agency' })
  @ApiResponse({ status: 200, description: 'Agency updated successfully' })
  @ApiResponse({ status: 404, description: 'Agency not found' })
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agenciesService.update(id, updateAgencyDto);
  }

  @ApiOperation({ summary: 'Delete agency' })
  @ApiResponse({ status: 200, description: 'Agency deleted successfully' })
  @ApiResponse({ status: 404, description: 'Agency not found' })
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }

  @ApiOperation({ summary: 'Deactivate agency' })
  @ApiResponse({ status: 200, description: 'Agency deactivated successfully' })
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.agenciesService.deactivate(id);
  }

  @ApiOperation({ summary: 'Activate agency' })
  @ApiResponse({ status: 200, description: 'Agency activated successfully' })
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.agenciesService.activate(id);
  }
}