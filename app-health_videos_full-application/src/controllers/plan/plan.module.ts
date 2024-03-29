import { Module } from '@nestjs/common'
import { PlanService } from './plan.service'
import { PlanController } from './plan.controller'
import { PrismaModule } from '@src/database/prisma.module'

@Module({
  controllers: [PlanController],
  providers: [PlanService],
  imports: [PrismaModule],
})
export class PlanModule { }
