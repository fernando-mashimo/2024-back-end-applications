import { BaseJwtPayload } from "./base-jwt-payload.entity";

export enum AccessJwtSubscriptionType {
    FREEMIUM = 'FREEMIUM',
    SUBSCRIBER = 'SUBSCRIBER',
}

export class AccessJwtPayload extends BaseJwtPayload {
    email: string;
    subscription: AccessJwtSubscriptionType;
}
