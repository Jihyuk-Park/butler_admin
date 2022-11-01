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

  const minorityShareHoldersArray = [
    { type_nm: '주주 수', type: 'shareholderCount' },
    { type_nm: '전체 주주 수', type: 'shareholderTotalCount' },
    { type_nm: '주주 비율(%)', type: 'shareholderRatio' },
    { type_nm: '보유 주식 수', type: 'holderStockCount' },
    { type_nm: '총 발행 주식 수', type: 'stockTotalCount' },
    { type_nm: '보유 주식 비율(%)', type: 'holdStockRatio' },
  ];

  const minorityShareHoldersData = filterS3Data(minorityShareHoldersArray, S3Data, 'minorShareHolder');

  return res.json(minorityShareHoldersData);
});


export default router;