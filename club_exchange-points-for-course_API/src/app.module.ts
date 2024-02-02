import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CourseOrdersModule } from './course-orders/course-orders.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CourseOrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
