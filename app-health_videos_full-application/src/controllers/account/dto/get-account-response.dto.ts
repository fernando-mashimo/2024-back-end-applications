import { AccountType } from "../entities/account.entity";

export class GetAccountResponseDto  {
    id: string
    accountType: AccountType;
    email: string;
    name: string;
    photo?: string
    cref?: string
    password?: string
}
