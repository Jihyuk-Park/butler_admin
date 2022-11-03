import express from 'express';
const router = express.Router();
import { getDataS3 } from '../../../module/aws.js';
import { filterS3DataExecutive } from '../../../module/companyFunction.js';

// getData
router.get('/getData/search/:reportsType/:searchCompanyCode', async function(req,res){

  let searchCompanyCode = req.params.searchCompanyCode;
  let reportsType = req.params.reportsType;
  let S3Data = await getDataS3(searchCompanyCode, reportsType);

  if (S3Data === "X"){
    return res.json("X");
  }

  let accountArray;

  if (reportsType === 'rawReports') {
    accountArray = [
      { type_nm: '인원', type: 'executiveCount'},
      { type_nm: '보수 총액', type: 'totalSalary'},
      { type_nm: '1인당 금액', type: 'totalSalaryAvg'},
    ];
  } else if (reportsType === 'quarterReports') {
    accountArray = [
      { type_nm: '임원수', type: 'executiveCount'},
      { type_nm: '급여총액', type: 'totalSalary'},
      { type_nm: '임원수비율', type: 'countRatio'},
      { type_nm: '전체급여대비 임원급여비율', type: 'totalRatio'},
      { type_nm: '매출액대비 임원급여비율', type: 'salesRatio'},
      { type_nm: '영업이익대비 임원급여비율', type: 'profitRatio'},
    ];
  } else if (reportsType === 'accumulteReports') {
    accountArray = [
      { type_nm: '급여총액', type: 'totalSalary'},
      { type_nm: '1인평균', type: 'totalSalaryAvg'},
      { type_nm: '매출액대비 임원급여 비율', type: 'salesRatio'},
    ];
  }
  
  const executiveData = filterS3DataExecutive(accountArray, S3Data, 'executiveReward');
  // console.log(executiveData);

  return res.json(executiveData);
});


export default router;