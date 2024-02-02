import { Module } from '@nestjs/common';
import { CourseOrdersService } from './course-orders.service';
import { CourseOrdersController } from './course-orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { generalProviders } from 'src/database/general.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CourseOrdersController],
  providers: [CourseOrdersService, ...generalProviders],
})
export class CourseOrdersModule {}
