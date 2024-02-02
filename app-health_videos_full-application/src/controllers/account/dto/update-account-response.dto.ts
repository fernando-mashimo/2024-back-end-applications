import { AccountType } from '../entities/account.entity';
import { RegisterPersonalInfoDto } from './register-personal-info.dto';

export class UpdateAccountResponseDto  {

    id: string
    accountType: AccountType;
    email: string;
    name: string;
    photo?: string
    password?: string
    AccountPersonalInfo?: RegisterPersonalInfoDto
}
