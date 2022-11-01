import express from 'express';
const router = express.Router();
import { financialTypeKey, financialTypeAccountArray, filterS3DataManagement } from '../../../module/companyFunction.js';
import { getDataS3 } from '../../../module/aws.js';

// 검색 기업 - getData
router.get('/getData/search/s3', async function(req,res){

  let fs_div = req.query.fs_div === '연결' ? 'CFS' : 'OFS';
  let financialType = financialTypeKey(req.query.financialType);
  let corp_code = req.query.corp_code;

  let S3Data = await getDataS3(corp_code, 'rawReports', fs_div);
  if (S3Data === "X"){
    return res.json("X");
  }

  let dataArray = financialTypeAccountArray(req.query.financialType);
  
  const managementData = filterS3DataManagement(dataArray, S3Data, 'fs', financialType);
  // console.log(managementData);

  res.send(managementData);

});

export default router;
