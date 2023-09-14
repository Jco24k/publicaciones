import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ApiControllerImplementation,
  ApiCreatedResponseImplementation,
  ApiNotFoundImplementation,
  ApiOkResponseImplementation,
} from 'src/common/decorators/swagger-controller.documentation';
import { PaginationQueryParams } from 'src/common/dto/pagination-query-params.dto';
import { PaginationQueryParamsPipe } from 'src/common/pipes/pagination-query-param.pipe';
import { CurrentPath } from 'src/common/interfaces/current.path.interface';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidPermits } from 'src/common/permit/valid-permit';
import { PermitService } from '../services/permit.service';
import { Permit } from '../entities/permit.entity';
import { UpdatePermitDto } from '../dto/update-permit.dto';

@ApiTags(CurrentPath.PERMIT.toUpperCase())
@Controller(CurrentPath.PERMIT)
@ApiBearerAuth()
@ApiControllerImplementation()
export class PermitController {
  constructor(private readonly service: PermitService) {}



  @Auth({
    roles: [ValidPermits.READ_PERMIT],
  })
  @ApiOkResponseImplementation({ type: [Permit], method: 'get' })
  @Get()
  findAll(
    @Query(PaginationQueryParamsPipe(PaginationQueryParams))
    query: PaginationQueryParams,
  ) {
    return this.service.findAll(query);
  }

  @Auth({
    roles: [ValidPermits.READ_PERMIT],
  })
  @ApiOkResponseImplementation({ type: Permit, method: 'get' })
  @ApiNotFoundImplementation()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOneById(id);
  }

  @Auth({
    roles: [ValidPermits.UPDATE_PERMIT],
  })
  @ApiOkResponseImplementation({ type: Permit, method: 'update' })
  @ApiNotFoundImplementation()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdatePermitDto,
  ) {
    return this.service.update(id, updateRoleDto);
  }


}
