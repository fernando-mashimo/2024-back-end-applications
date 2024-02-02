
class NutriIds {
    externalId: string;
    uidv4Nutri: string
}

export default class VtexBodyCreateProductModel {
    sellerId: string;
    nutriIds: NutriIds;
    crnId: string;
    price: number;
    categoryId: number;
    name: string;
    imageUrl: string;
}

export class VtexProductResponseModel {
    Id: number;
    ProductId: number;
    IsActive: boolean;
    ActivateIfPossible: boolean;
    Name: string;
    RefId: string | null;
    PackagedHeight: number;
    PackagedLength: number;
    PackagedWidth: number;
    PackagedWeightKg: number;
    Height: number | null;
    Length: number | null;
    Width: number | null;
    WeightKg: number | null;
    CubicWeight: number;
    IsKit: boolean;
    CreationDate: string;
    RewardValue: number | null;
    EstimatedDateArrival: string | null;
    ManufacturerCode: string | null;
    CommercialConditionId: number;
    MeasurementUnit: string;
    UnitMultiplier: number;
    ModalType: string | null;
    KitItensSellApart: boolean;
    Videos: any[]; // Pode ser necessário definir um tipo específico para os vídeos
  }