// import { CreateAccountDto } from '../dto/create-account.dto'
// import { AccountPersonalInfo } from '../entities/account-personal-info.entity'
// import { Account } from '../entities/account.entity'
// import { ResponsibilityTerm } from '../entities/responsibility-term.entity'

// export class CreateAccountMapper {
//   static convert(dto: CreateAccountDto, macAddress?: string): Account {
//     const account = new Account()
//     const personalInfo = new AccountPersonalInfo()

//     account.name = dto.name
//     account.surname = dto.surname

//     // Mapeando UserInfoDto para AccountPersonalInfo
//     personalInfo.height = dto.height || 0
//     personalInfo.weight = dto.weight || 0
//     personalInfo.birthday = dto.birthday || new Date()

//     // Mapeando CreateResposibilityTerm para ResponsibilityTerm
//     const responsibilityTermEntity = new ResponsibilityTerm()
//     responsibilityTermEntity.accepted = dto.accepted

//     // Associando ResponsibilityTerm com Account
//     account.ResponsibilityTerm = {
//       create: responsibilityTermEntity
//     }

//     account.AccountPersonalInfo = {
//       create: personalInfo
//     }

//     // if (macAddress)
//     //   account.Device = {
//     //     create: {
//     //       macAddress: macAddress,
//     //       active: true
//     //     }
//     //   }

//     return account
//   }
// }
