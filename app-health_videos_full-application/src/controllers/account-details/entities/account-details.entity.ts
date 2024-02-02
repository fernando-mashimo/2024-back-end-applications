export enum MedicalRestrictions {
  RESTRICAO_ALIMENTAR = 'Restrição alimentar',
  RESTRICOES_FISICAS = 'Restrições físicas',
  DOENCA_CRONICA = 'Doença crônica'
}

export enum Objectives {
  BEM_ESTAR = 'Bem-estar',
  FLEXIBILIDADE = 'Flexibilidade',
  ANSIEDADE = 'Diminuir ansiedade',
  TREINAR_A_MENTE = 'Treinar a mente',
  CONDICIONAMENTO_FISICO = 'Condicionamento físico',
  GANHO_MUSCULAR = 'Ganho muscular',
  DEFINICAO_MUSCULAR = 'Definição muscular',
  DIMINUIR_ESTRESSE = 'Diminuir estresse'
}

export class AccountDetails {
  id: string
  accountId: string
  medicalRestrictions?: MedicalRestrictions[]
  objectives?: Objectives[]
}
