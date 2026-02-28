import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards,
  Version 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';

import { PlansService } from '../services/plans.service';
import { CreatePlanDto, UpdatePlanDto } from '../dto';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { UserRole } from '../../../shared/enums';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active plans' })
  @ApiResponse({ status: 200, description: 'List of active plans' })
  findAll() {
    return this.plansService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan details' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  findOne(@Param('id') id: string) {
    return this.plansService.findById(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create new plan (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Update plan (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete plan (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}