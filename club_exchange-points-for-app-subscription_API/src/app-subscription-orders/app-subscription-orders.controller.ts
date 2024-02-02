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
import { AppSubscriptionOrdersService } from './app-subscription-orders.service';
import { CreateAppSubscriptionOrderDto } from './dto/create-app-subscription-order.dto';
import { UpdateAppSubscriptionOrderDto } from './dto/update-app-subscription-order.dto';
import pino from 'pino';
import AppSubscriptionOrderModel from './model/app-subscription-order.model';
import { Status } from './common/enums';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('app-subscription-orders')
export class AppSubscriptionOrdersController {
  private readonly logger = pino();
  constructor(
    private readonly appSubscriptionOrdersService: AppSubscriptionOrdersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new app subscription order' })
  @ApiCreatedResponse({
    description: 'The app subscription order has been successfully created.',
    type: AppSubscriptionOrderModel,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occurred.',
  })
  async createNewOrder(
    @Body() orderDto: CreateAppSubscriptionOrderDto,
  ): Promise<AppSubscriptionOrderModel> {
    this.logger.info('Initiating new appSubscriptionOrder creation process');
    const { subscriptionPriceBRL } = orderDto;
    orderDto.subscriptionPriceBRL = Number(subscriptionPriceBRL);
    return this.appSubscriptionOrdersService.createNewOrder(orderDto);
  }

  @Get()
  @ApiOperation({ summary: 'List app subscription orders' })
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
    description: 'List of app subscription orders',
    type: AppSubscriptionOrderModel,
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
    @Query('lastNDays') lastNDays: number,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('order') order: string = 'DESC',
    @Res() res,
  ): Promise<{ orders: AppSubscriptionOrderModel[]; total: number }> {
    this.logger.info('Initiating listing of appSubscriptionOrders');
    const { orders, total } =
      await this.appSubscriptionOrdersService.listOrders(
        page,
        pageSize,
        status,
        name,
        lastNDays,
        sortBy,
        order,
      );
    res.header('x-total-count', total);
    return res.status(HttpStatus.OK).json(orders);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get app subscription order by id' })
  @ApiOkResponse({
    description: 'The app subscription order has been successfully retrieved.',
    type: AppSubscriptionOrderModel,
  })
  @ApiNotFoundResponse({
    description: 'Not Found - The requested resource was not found',
  })
  async getOrderById(
    @Param('id') id: string,
  ): Promise<AppSubscriptionOrderModel> {
    this.logger.info(`Initiating appSubscriptionOrder retrieval with id ${id}`);
    return this.appSubscriptionOrdersService.getOrderById(id);
  }

  @Patch('updateOrder/:orderId')
  @ApiOperation({ summary: 'Update order status to PAID or DONE' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        coupon: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({
    description: 'The app subscription order has been successfully updated.',
    type: AppSubscriptionOrderModel,
  })
  @ApiNotFoundResponse({
    description: 'Not Found - The requested resource was not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body()
    updateAppSubscriptionOrderDto: Partial<UpdateAppSubscriptionOrderDto>,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /.(jpg|jpeg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ): Promise<AppSubscriptionOrderModel> {
    this.logger.info('Initiating appSubscriptionOrder update process');
    return this.appSubscriptionOrdersService.updateOrder(
      orderId,
      updateAppSubscriptionOrderDto,
      file,
    );
  }
}
