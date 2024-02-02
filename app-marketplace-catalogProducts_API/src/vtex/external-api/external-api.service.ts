import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalApiService {
    async createVTEXProduct(data) {
        try {
            if (!data) throw new Error("Product data is required");
            const res = await axios.post(`${process.env.VTEX_URI}/api/catalog/pvt/product`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
            return res.data
        } catch (error) {
            throw new Error(`Error create product at VTEX, ${error}`)
        }
    }

    async createVTEXSKU(data) {
        try {
            if (!data) throw new Error("SKU data is required");
            const res = await axios.post(`${process.env.VTEX_URI}/api/catalog/pvt/stockkeepingunit`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
            return res.data
        } catch (error) {
            throw new Error(`Error create SKU at VTEX`)
        }
    }

    async updateVTEXSKUInventory(sku, warehouseId, data) {
        try {
            if (!sku || !warehouseId || !data) throw new Error("SKU, Warehouse ID and data are required");
            return await axios.put(`${process.env.VTEX_URI}/api/logistics/pvt/inventory/skus/${sku}/warehouses/${warehouseId}`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
        } catch (error) {
            throw new Error("Error create SKU inventory at VTEX")
        }
    }

    async updateVTEXSKUPrice(sku, data) {
        try {
            if (!sku || !data) throw new Error("SKU and price update data are required");
            return axios.put(`${process.env.VTEX_URI}/api/pricing/prices/${sku}`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
        } catch (error) {
            throw new Error("Error create SKU price")
        }
    }

    async createVTEXSKUFile(sku, data) {
        try {
            if (!sku || !data) throw new Error("SKU and file data are required");
            const res = await axios.post(`${process.env.VTEX_URI}/api/catalog/pvt/stockkeepingunit/${sku}/file`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
            return res.data;
        } catch (error) {
            throw new Error(`Error create SKU file, ${error}`)

        }
    }

    async updateVTEXSKUActive(skuId, data) {
        try {
            if (!skuId || !data) throw new Error("SKU and update data are required");
            const res = await axios.put(`${process.env.VTEX_URI}/api/catalog/pvt/stockkeepingunit/${skuId}`, data, {
                headers: {
                    'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
                    'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
            }});
            return res.data
        } catch (error) {
            throw new Error(`Error create SKU active, ${error.message}`)

        }
    }

    async getBrandBySellerId(sellerId) {
        try {
            const res = await axios.get(`${process.env.MICROSERVICE_LIAH_CO}/seller/allBrandsBySellerId/${sellerId}`, {
                headers: {
                    'x-access-token': process.env.ACCESS_TOKEN_LIAH,
            }});
            return res.data
        } catch (error) {
            throw new Error("Error create get brand by sellerId")
        }
    }
}
