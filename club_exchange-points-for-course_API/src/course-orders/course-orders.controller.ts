import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CourseOrdersService } from './course-orders.service';
import { CreateCourseOrderDto } from './dto/create-course-order.dto';
import { UpdateCourseOrderDto } from './dto/update-course-order.dto';
import pino from 'pino';
import CourseOrderModel from './model/course-order.model';
import { Status } from './common/enums';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('course-orders')
export class CourseOrdersController {
  private readonly logger = pino();
  constructor(private readonly courseOrdersService: CourseOrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course order' })
  @ApiCreatedResponse({
    description: 'The course order has been successfully created.',
    type: CourseOrderModel,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async createNewOrder(
    @Body() createCourseOrderDto: CreateCourseOrderDto,
  ): Promise<CourseOrderModel> {
    this.logger.info('Initiating new courseOrder creation process');
    return this.courseOrdersService.createNewOrder(createCourseOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'List course orders' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: 'Number of orders per page',
  })
  @ApiQuery({
    name: 'status',
    enum: ['PROCESSING', 'PAID', 'DONE'],
    required: false,
    description: 'Order status',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Nutritionist full name',
  })
  @ApiQuery({
    name: 'nutritionistId',
    type: String,
    required: false,
    description: 'Nutritionist ID',
  })
  @ApiQuery({
    name: 'lastNDays',
    type: Number,
    required: false,
    description: 'Amount of days to look back',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Field to sort by',
  })
  @ApiQuery({
    name: 'order',
    enum: ['ASC', 'DESC'],
    required: false,
    description: 'Sort order',
  })
  @ApiOkResponse({
    status: 200,
    description: 'List of course orders',
    type: CourseOrderModel,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Not Found - The requested resource was not found',
  })
  async listOrders(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('status') status: Status,
    @Query('name') name: string,
    @Query('nutritionistId') nutritionistId: string,
    @Query('lastNDays') lastNDays: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('order') order: string = 'DESC',
    @Res() res,
  ): Promise<{ orders: CourseOrderModel[]; total: number }> {
    this.logger.info('Initiating listing of courseOrders');
    const { orders, total } = await this.courseOrdersService.listOrders(
      page,
      pageSize,
      status,
      name,
      nutritionistId,
      lastNDays,
      sortBy,
      order,
    );
    res.header('x-total-count', total);
    return res.status(HttpStatus.OK).json(orders);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course order by ID' })
  @ApiOkResponse({
    description: 'The course order has been successfully retrieved.',
    type: CourseOrderModel,
  })
  @ApiNotFoundResponse({
    description: 'Not Found - The requested resource was not found',
  })
  async getOrderById(@Param('id') id: string): Promise<CourseOrderModel> {
    this.logger.info(`Initiating courseOrder retrieval with id ${id}`);
    return this.courseOrdersService.getOrderById(id);
  }

  @Patch('updateOrder/:orderId')
  @ApiOperation({ summary: 'Update course order status to PAID or DONE' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseURL: { type: 'string' },
        otherInfo: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({
    description: 'The course order has been successfully updated.',
    type: CourseOrderModel,
  })
  @ApiNotFoundResponse({
    description: 'Not Found - The requested resource was not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateCourseOrderDto: UpdateCourseOrderDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<CourseOrderModel> {
    this.logger.info('Initiating courseOrder update process');
    return this.courseOrdersService.updateOrder(
      orderId,
      updateCourseOrderDto,
      file,
    );
  }
}
