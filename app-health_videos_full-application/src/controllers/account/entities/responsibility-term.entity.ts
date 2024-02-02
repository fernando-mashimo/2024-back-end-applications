import { Prisma } from '@prisma/client'

export class ResponsibilityTerm implements Prisma.ResponsibilityTermCreateInput {
    id?: string;
    accepted: boolean;
    responseDate?: string | Date;
    Account: Prisma.AccountCreateNestedOneWithoutResponsibilityTermInput;

}