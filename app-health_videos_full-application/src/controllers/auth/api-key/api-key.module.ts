import { Module } from "@nestjs/common";
import { ApiKeyService } from "./api-key.service";
import { PrismaModule } from "@src/database/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [ApiKeyService],
    exports: [ApiKeyService],
})
export class ApiKeyModule { }
