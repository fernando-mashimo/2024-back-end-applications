import axios from 'axios';
export const getSkuData = async (productId: number) => {
  try {
    const skuInfo = await axios.request({
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://dgventures.myvtex.com/api/catalog_system/pub/products/variations/${productId}`,
      headers: { 
        'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY, 
        'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN
      }
    });
    if (!skuInfo.data) {
      return null;
    }
    return skuInfo.data;
  } catch (error) {
    console.log(error);
    return null
  }
};
