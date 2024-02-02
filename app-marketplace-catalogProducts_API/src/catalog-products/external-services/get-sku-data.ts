import axios from 'axios';
export const getSkuData = async (id: number) => {
  const skuInfo = await axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://hyhpvgwjl9.execute-api.us-east-1.amazonaws.com/Prod/api/v1/skulist',
    data: {
      body: {
        products: [
          {
            sku: id,
            hasNutriPrescription: false,
          },
        ],
      },
    },
  });
  return Object.values(skuInfo.data).flatMap((value) => value)[0];
};
