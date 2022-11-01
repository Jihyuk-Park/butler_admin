import express from 'express';
const router = express.Router();
import { getDataS3 } from '../../../module/aws.js';
import { filterS3Data } from '../../../module/companyFunction.js';

// getData
router.get('/getData/search/:reportsType/:searchCompanyCode', async function(req,res){

  let searchCompanyCode = req.params.searchCompanyCode;
  let reportsType = req.params.reportsType;
  let S3Data = await getDataS3(searchCompanyCode, reportsType);

  if (S3Data === "X"){
    return res.json("X");
  }

  let accountArray = [
    { type_nm: '최종거래일', type: 'date' },
    { type_nm: '수정주가', type: 'price' },
    { type_nm: '발행주식수(천주)', type: 'totalStockCount' },
    { type_nm: '보통주 시가총액', type: 'market_capital' },
  ];

  const stockData = filterS3Data(accountArray, S3Data, 'stock');

  return res.json(stockData);
});

export default router;
