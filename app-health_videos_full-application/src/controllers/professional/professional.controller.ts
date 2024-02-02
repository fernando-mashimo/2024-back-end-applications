import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { routes } from '@src/common/baseRoutes';

@Controller(routes.professional)
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createProfessionalDto: CreateProfessionalDto) {
    return this.professionalService.create(createProfessionalDto);
  }

  // @Get()
  // findAll() {
  //   return this.professionalService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.professionalService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
  //   return this.professionalService.update(+id, updateProfessionalDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.professionalService.remove(+id);
  // }
}
