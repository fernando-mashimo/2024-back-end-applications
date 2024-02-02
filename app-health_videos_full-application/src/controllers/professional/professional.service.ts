import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PrismaService } from '@src/database/prisma.service';
import { Professional } from './entities/professional.entity';
import pino from 'pino';

@Injectable()
export class ProfessionalService {
  private readonly logger = pino();

  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createProfessionalDto: CreateProfessionalDto) {
    const existsByEmail = await this.prismaService.account.findUnique({
      where: {
        email: createProfessionalDto.email,
      }
    })

    if (existsByEmail) {
      throw new ConflictException(`Invalid email`)
    }

    const existsByCpf = await this.prismaService.account.findUnique({
      where: {
        cpf: createProfessionalDto.cpf,
      }
    })

    if (existsByCpf) {
      throw new ConflictException(`Invalid CPF`)
    }

    const existsByCref = await this.prismaService.professional.findUnique({
      where: {
        cref: createProfessionalDto.cref,
      }
    })

    if (existsByCref) {
      throw new ConflictException(`Invalid CREF`)
    }

    const createProfessinalQuery = await this.prismaService.professional.create({
      data: {
        cref: createProfessionalDto.cref,
        account: {
          create: {
            name: createProfessionalDto.name,
            surname: createProfessionalDto.surname,
            email: createProfessionalDto.email,
            cpf: createProfessionalDto.cpf,
            accountType: 'PROFESSIONAL',
          }
        }
      },
      include: {
        account: true
      }
    });

    const professional = this.toProfessionalAccountEntity(createProfessinalQuery);

    this.logger.info(`Professional Account. Created professional of id=${professional.id}, cpf=${professional.cpf}`)

    return professional;
  }

  findAll() {
    return `This action returns all professional`;
  }

  async findOne(id: string) {
    const queryProfessional: Professional[] = await this.prismaService.$queryRaw`
      SELECT
        a."id",
        a."name",
        a."surname",
        a."cpf",
        a."email",
        a."photo",
        p."cref",
        p."social",
        p."bio"
      FROM "Account" a
      JOIN "Professional" p ON p."accountId" = a."id"
      WHERE a."id" = CAST(${id} AS UUID);
    `;

    const professional = queryProfessional[0];

    if (!professional) {
      throw new NotFoundException(`Professional Account with id=${id} not found.`)
    }

    return professional;
  }

  update(id: number, updateProfessionalDto: UpdateProfessionalDto) {
    return `This action updates a #${id} professional`;
  }

  remove(id: number) {
    return `This action removes a #${id} professional`;
  }

  private toProfessionalAccountEntity(rawEntity: any): Professional {
    const professional: Professional = {
      id: rawEntity?.account?.id,
      name: rawEntity?.account?.name,
      surname: rawEntity?.account?.surname,
      cpf: rawEntity?.account?.cpf,
      email: rawEntity?.account?.email,
      photo: rawEntity?.account?.photo,
      cref: rawEntity?.cref,
      social: rawEntity?.social,
      bio: rawEntity?.bio,
    }

    return professional;
  }
}
