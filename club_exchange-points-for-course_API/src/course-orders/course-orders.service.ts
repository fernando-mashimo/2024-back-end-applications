import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseOrderDto } from './dto/create-course-order.dto';
import { UpdateCourseOrderDto } from './dto/update-course-order.dto';
import pino from 'pino';
import { Model } from 'mongoose';
import CourseOrderModel from './model/course-order.model';
import { COURSE_ORDERS_MODEL } from 'src/database/database.constants';
import { Status } from './common/enums';
import S3Service from 'src/common-external-services/s3-file-handling.service';

@Injectable()
export class CourseOrdersService {
  private readonly logger = pino();
  private readonly s3Service = new S3Service();

  constructor(
    @Inject(COURSE_ORDERS_MODEL)
    private readonly courseOrdersModel: Model<CourseOrderModel>,
  ) {}
  async createNewOrder(
    createCourseOrderDto: CreateCourseOrderDto,
  ): Promise<CourseOrderModel> {
    try {
      const { fullName, otherInfo } = createCourseOrderDto;
      const fullNameFormatted = decodeURIComponent(fullName);
      const otherInfoFormatted = decodeURIComponent(otherInfo);

      const newOrderData = {
        ...createCourseOrderDto,
        fullName: fullNameFormatted,
        otherInfo: otherInfoFormatted,
        status: Status.PROCESSING,
        courseURL: null,
        paymentReceiptFile: '',
        createdAt: new Date(),
        updatedAt: null,
      };
      this.logger.info('Creating new courseOrder object in database');
      const newOrder = await this.courseOrdersModel.create(newOrderData);
      if (!newOrder) {
        this.logger.error('Error creating new courseOrder object');
        throw new InternalServerErrorException(
          'Error creating new courseOrder object',
        );
      }
      this.logger.info(
        `New courseOrder object successfully created with id ${newOrder._id} - exiting method`,
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
    nutritionistId: string,
    lastNDays: number,
    sortBy: string = 'createdAt',
    order: string = 'DESC',
  ): Promise<{ orders: CourseOrderModel[]; total: number }> {
    try {
      this.logger.info('Retrieving list of courseOrders with pagination');

      const query = {};
      if (status) query['status'] = status;
      if (name) {
        const nameFormatted = decodeURIComponent(name);
        query['fullName'] = new RegExp(nameFormatted, 'i');
      }
      if (nutritionistId) query['nutritionistId'] = nutritionistId;
      if (lastNDays) {
        const desiredDate = new Date();
        desiredDate.setHours(0, 0, 0, 0);
        desiredDate.setDate(desiredDate.getDate() - lastNDays);
        query['createdAt'] = {
          $gte: desiredDate,
        };
      }

      const total = await this.courseOrdersModel.countDocuments(query);

      const skip = (page - 1) * pageSize;

      const orders = await this.courseOrdersModel
        .find(query)
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 })
        .skip(skip)
        .limit(pageSize);

      if (!orders.length) {
        throw new NotFoundException('No courseOrders found');
      }

      this.logger.info(
        'List of courseOrders successfully retrieved - exiting method',
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

  async getOrderById(orderId: string): Promise<CourseOrderModel> {
    try {
      this.logger.info('Retrieving courseOrder');
      const order = await this.courseOrdersModel.findById({
        _id: orderId,
      });
      if (!order) {
        throw new NotFoundException(`No courseOrder found with id ${orderId}`);
      }
      this.logger.info('courseOrder successfully retrieved - exiting method');
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
    updateCourseOrderDto: UpdateCourseOrderDto,
    file?: Express.Multer.File,
  ): Promise<CourseOrderModel> {
    try {
      this.logger.info(`Updating order with orderId ${orderId}`);

      const data = { updatedAt: new Date() };

      if (file) {
        const uploadedFile = await this.s3Service.uploadFile(
          file,
          process.env.S3_COURSE_RECEIPT_BUCKET,
        );
        data['paymentReceiptFile'] = uploadedFile;
        data['status'] = Status.PAID;
      }

      if (updateCourseOrderDto.courseURL) {
        data['courseURL'] = updateCourseOrderDto.courseURL;
        data['status'] = Status.DONE;
      }

      if (updateCourseOrderDto.otherInfo) {
        data['otherInfo'] = updateCourseOrderDto.otherInfo;
      }

      const updatedOrder = await this.courseOrdersModel.findByIdAndUpdate(
        { _id: orderId },
        {
          $set: data,
        },
        { new: true },
      );
      if (!updatedOrder) {
        throw new NotFoundException(`No courseOrder found with id ${orderId}`);
      }
      this.logger.info(
        `Successfully updated courseOrder with id ${orderId} - exiting method`,
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
