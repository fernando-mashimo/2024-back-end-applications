import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppSubscriptionOrderDto } from './dto/create-app-subscription-order.dto';
import { UpdateAppSubscriptionOrderDto } from './dto/update-app-subscription-order.dto';
import pino from 'pino';
import { Model } from 'mongoose';
import AppSubscriptionOrderModel from './model/app-subscription-order.model';
import { APP_SUBSCRIPTION_ORDERS_MODEL } from 'src/database/database.constants';
import { Status } from './common/enums';
import S3Service from 'src/common-external-services/s3-file-handling.service';

@Injectable()
export class AppSubscriptionOrdersService {
  private readonly logger = pino();
  private readonly s3Service = new S3Service();

  constructor(
    @Inject(APP_SUBSCRIPTION_ORDERS_MODEL)
    private readonly appSubscriptionOrdersModel: Model<AppSubscriptionOrderModel>,
  ) {}
  async createNewOrder(
    createAppSubscriptionOrderDto: CreateAppSubscriptionOrderDto,
  ): Promise<AppSubscriptionOrderModel> {
    try {
      const { fullName } = createAppSubscriptionOrderDto;
      const fullNameFormatted = decodeURIComponent(fullName);

      const newOrderData = {
        ...createAppSubscriptionOrderDto,
        fullName: fullNameFormatted,
        status: Status.PROCESSING,
        coupon: null,
        paymentReceiptFile: '',
        createdAt: new Date(),
        updatedAt: null,
      };
      this.logger.info('Creating new appSubscriptionOrder object in database');
      const newOrder =
        await this.appSubscriptionOrdersModel.create(newOrderData);
      if (!newOrder) {
        this.logger.error('Error creating new appSubscriptionOrder object');
        throw new InternalServerErrorException(
          'Error creating new appSubscriptionOrder object',
        );
      }
      this.logger.info(
        'New appSubscriptionOrder object successfully created - exiting method',
      );
      return newOrder;
    } catch (error) {
      this.logger.error(error.message);
      throw new error(error.message);
    }
  }

  async listOrders(
    page: number,
    pageSize: number,
    status: Status,
    name: string,
    lastNDays: number,
    sortBy: string = 'createdAt',
    order: string = 'DESC',
  ): Promise<{ orders: AppSubscriptionOrderModel[]; total: number }> {
    try {
      this.logger.info(
        'Retrieving list of appSubscriptionOrders with pagination',
      );
      const query = {};
      if (status) query['status'] = status;
      if (name) {
        const nameFormatted = decodeURIComponent(name);
        query['fullName'] = new RegExp(nameFormatted, 'i');
      }
      if (lastNDays) {
        const desiredDate = new Date();
        desiredDate.setHours(0, 0, 0, 0);
        desiredDate.setDate(desiredDate.getDate() - lastNDays);
        query['createdAt'] = {
          $gte: desiredDate,
        };
      }

      const total = await this.appSubscriptionOrdersModel.countDocuments(query);

      const skip = (page - 1) * pageSize;

      const orders = await this.appSubscriptionOrdersModel
        .find(query)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 })
        .skip(skip)
        .limit(pageSize);

      if (!orders.length) {
        throw new NotFoundException('No appSubscriptionOrders found');
      }

      this.logger.info(
        'List of appSubscriptionOrders successfully retrieved - exiting method',
      );

      return { orders, total };
    } catch (error) {
      if (error.status === 404) {
        this.logger.error(error.message);
        throw new NotFoundException(error.message);
      }
      this.logger.error(error.message);
      throw new Error(error.message);
    }
  }

  async getOrderById(orderId: string): Promise<AppSubscriptionOrderModel> {
    try {
      this.logger.info('Retrieving appSubscriptionOrder');
      const order = await this.appSubscriptionOrdersModel.findById({
        _id: orderId,
      });
      if (!order) {
        throw new NotFoundException(
          `No appSubscriptionOrder found with id ${orderId}`,
        );
      }
      this.logger.info(
        'appSubscriptionOrder successfully retrieved - exiting method',
      );
      return order;
    } catch (error) {
      if (error.status === 404) {
        this.logger.error(error.message);
        throw new NotFoundException(error.message);
      }
      this.logger.error(error.message);
      throw new Error(error.message);
    }
  }

  async updateOrder(
    orderId: string,
    updateAppSubscriptionOrderDto: Partial<UpdateAppSubscriptionOrderDto>,
    file?: Express.Multer.File,
  ): Promise<AppSubscriptionOrderModel> {
    try {
      this.logger.info(`Updating order with orderId ${orderId}`);

      const data = { updatedAt: new Date() };

      if (file) {
        const uploadedFile = await this.s3Service.uploadFile(
          file,
          process.env.S3_APP_RECEIPT_BUCKET,
        );
        data['paymentReceiptFile'] = uploadedFile;
        data['status'] = Status.PAID;
      }

      if (updateAppSubscriptionOrderDto.coupon) {
        data['coupon'] = updateAppSubscriptionOrderDto.coupon;
        data['status'] = Status.DONE;
      }

      const updatedOrder =
        await this.appSubscriptionOrdersModel.findByIdAndUpdate(
          { _id: orderId },
          {
            $set: data,
          },
          { new: true },
        );
      if (!updatedOrder) {
        throw new NotFoundException(
          `No appSubscriptionOrder found with id ${orderId}`,
        );
      }
      this.logger.info(
        `Successfully updated appSubscriptionOrder with id ${orderId} - exiting method`,
      );
      return updatedOrder;
    } catch (error) {
      if (error.status === 404) {
        this.logger.error(error.message);
        throw new NotFoundException(error.message);
      }
      this.logger.error(error.message);
      throw new Error(error.message);
    }
  }
}
