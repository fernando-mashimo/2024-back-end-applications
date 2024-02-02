import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const AuthenticatedAccount = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request: Request = context.switchToHttp().getRequest();
        const authentication = JSON.parse(request.headers.authentication as string);

        return authentication;
    },
);
