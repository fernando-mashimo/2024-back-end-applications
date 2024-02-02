import { Injectable } from '@nestjs/common'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'
import { PrismaService } from '@src/database/prisma.service'

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) { }
  create(createPlanDto: CreatePlanDto) {
    return 'This action adds a new plan'
  }

  findAll() {
    return this.prismaService.plan.findMany()
  }

  findOne(id: string) {
    return this.prismaService.plan.findFirst({
      where: {
        id
      }
    })
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`
  }

  remove(id: string) {
    return `This action removes a #${id} plan`
  }
}
