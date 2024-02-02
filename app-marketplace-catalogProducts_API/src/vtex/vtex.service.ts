import { Injectable } from '@nestjs/common';
import { ExternalApiService } from './external-api/external-api.service';
import VtexBodyCreateProductModel, { VtexProductResponseModel } from './vtex-model/vtex.model';

@Injectable()
export class VtexService {
    constructor(
        private readonly externalApiService: ExternalApiService,
      ) {}

    async createProductVtex(productBody: VtexBodyCreateProductModel): Promise<VtexProductResponseModel> {
        return this.externalApiService.getBrandBySellerId(productBody.sellerId)
            .then(([brand]) => {
                const productDetails = this.createProductDetails(productBody.sellerId, productBody.nutriIds, brand, productBody.categoryId, productBody.name);
                return this.externalApiService.createVTEXProduct(productDetails);
            })
            .then((product) => {
                const skuDetails = this.createSkuDetails(productBody.nutriIds, product, productBody.name);
                return this.externalApiService.createVTEXSKU(skuDetails);
            })
            .then((sku) => Promise.all([
                this.externalApiService.updateVTEXSKUInventory(sku.Id, '1_1',{"quantity": 1}),
                this.createSkuPrice(productBody.price, sku),
                this.externalApiService.createVTEXSKUFile(sku.Id, this.createSkuFileDetails(productBody, productBody.name, productBody.imageUrl)),
                Promise.resolve(sku)
            ]))
            .then(([skuQuantity, skuPrice, skuFile, sku]) => {
                    const skuActiveDetails = this.createActiveSkuDetails(productBody, sku.ProductId, productBody.name);
                    return this.externalApiService.updateVTEXSKUActive(sku.Id, skuActiveDetails);
                }
            )
    }

    createActiveSkuDetails(product, productId, name) {
        return {
            "ProductId": productId,
            "Name": name || `${product?.crnId} + ${Date.now()}`,
            "IsActive": true
        };
    }

    createProductDetails(sellerId, nutriIds, brand, categoryId, name) {
        return {
            "Name": name || `${nutriIds.externalId} ${sellerId} ${nutriIds.uidv4Nutri} ${Date.now()}`,
            "CategoryId": categoryId,
            "BrandId": brand?.brandId,
            "IsVisible": false,
            "IsActive": true,
            "ShowWithoutStock": false,
            "Score": 5
        };
    }

    createSkuDetails(nutriId, product, name) {
        return {
            "ProductId": product.Id,
            "IsActive": false,
            "ActivateIfPossible": true,
            "Name": name || nutriId.externalId + Date.now(),
            "Ean": nutriId.uidv4Nutri + Date.now(),
            "PackagedHeight": 10,
            "PackagedLength": 10,
            "PackagedWidth": 10,
            "PackagedWeightKg": 10,
            "CubicWeight": 0.1667,
            "IsKit": false,
            "CommercialConditionId": 1,
            "MeasurementUnit": "un",
            "UnitMultiplier": 1
        };
    }

    async createSkuPrice(price: number, sku) {
        const skuPriceDetails = {
            "costPrice": price,
            "listPrice": null,
            "markup": 0,
            "fixedPrices": []
        };
        return this.externalApiService.updateVTEXSKUPrice(sku.Id, skuPriceDetails);
    }

    createSkuFileDetails(product, name, imageUrl) {
        return {
            "Name": name || product?.crnId + Date.now(),
            "Url": imageUrl || 'https://tecsagroup.com.br/wp-content/uploads/2023/05/logo-tecsa-group-1024x351.png',
            "IsMain": true,
            "Label": "Main",
            "Text": null
        };
    }
}
