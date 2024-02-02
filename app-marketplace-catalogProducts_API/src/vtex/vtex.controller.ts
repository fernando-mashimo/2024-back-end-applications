import { Body, Controller, Post } from '@nestjs/common';
import { VtexService } from './vtex.service';
import { CreateProductVtexDto } from './vtex-dto/create-product-vtex.dto';
import { VtexProductResponseModel } from './vtex-model/vtex.model';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('vtex')
export class VtexController {
  constructor(private readonly vtexService: VtexService) {}

  @Post()
  @ApiOkResponse({
    description: 'Create product vtex',
    type: VtexProductResponseModel,
    isArray: false,
  })
  async createProductVtex(@Body() createProductVtexDto: CreateProductVtexDto): Promise<VtexProductResponseModel> {
    return this.vtexService.createProductVtex(createProductVtexDto)
  }
}
