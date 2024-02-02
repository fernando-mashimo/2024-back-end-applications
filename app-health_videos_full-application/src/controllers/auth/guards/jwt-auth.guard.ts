import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "@src/helpers/public-endpoint";
import { ApiKeyService } from "../api-key/api-key.service";
import { JwtService } from "@nestjs/jwt";
import { Authentication } from "../jwt-entities/authentication";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private apiKeyService: ApiKeyService,
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request: Request = context.switchToHttp().getRequest();
        const existsAuthorizationHeader = this.extractBearerToken(request);
        const existsApiKeyHeader = this.extractApiKey(request);

        if (!existsAuthorizationHeader && !existsApiKeyHeader) {
            throw new UnauthorizedException(`Provided token is malformed or nonexistent.`);
        }

        if (existsAuthorizationHeader) {
            console.log({ existsAuthorizationHeader })
            const jwtDecoded = await this.jwtService.verifyAsync(existsAuthorizationHeader).catch((error) => {
                console.log({ error })
                if (error.name === 'JsonWebTokenError') {
                    throw new UnauthorizedException(`Provided token is malformed or nonexistent.`);
                }

                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedException(`Provided token is malformed or nonexistent.`);
                }
            })

            const authentication: Authentication = {
                principal: {
                    accountId: jwtDecoded.sub,
                    email: jwtDecoded.email,
                    subscriptionType: jwtDecoded.subscription,
                },
                authorities: {
                    roles: [] // TODO: finish implementation when permissions are needed
                }
            };

            (request).headers.authentication = JSON.stringify(authentication);
        }

        if (existsApiKeyHeader) {
            await this.verifyApiKey(existsApiKeyHeader) // verifies validity of api key and throw error if its invalid
            return true; // if an error wasnt thrown the api key is valid and thus the request is allowed to continue
        }

        return true;
    }

    private extractApiKey(request: Request): string | undefined {
        const apiKey = request.headers['x-api-key'];
        return apiKey ? apiKey.toString() : undefined;
    }

    private extractBearerToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private async verifyApiKey(key: string) {
        const isValid = await this.apiKeyService.verifyKey(key);

        if (!isValid) {
            throw new UnauthorizedException();
        }

        return isValid;
    }
}
