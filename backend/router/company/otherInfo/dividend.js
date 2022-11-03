import express from 'express';
const router = express.Router();
import { getDataS3 } from '../../../module/aws.js';
import { filterS3DataDividend } from '../../../module/companyFunction.js';

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
      { type_nm: '주당액면가액(원)', type: 'faceValue'},
      { type_nm: '(연결)당기순이익', type: 'connNetIncome'},
      { type_nm: '(별도)당기순이익', type: 'sepaNetIncome'},
      { type_nm: '(연결)주당순이익', type: 'connEarningPerShare'},
      { type_nm: '현금배당금총액(백만원)', type: 'cashDividend'},
      { type_nm: '주식배당금총액(백만원)', type: 'stockDividend'},
      { type_nm: '(연결)현금배당성향(%)', type: 'cashDividendRatio'},
      { type_nm: '보통주 주당 배당금(원)', type: 'commonCashDividend'},
      { type_nm: '보통주 수정주당배당금', type: 'fixCommonCashDividend'},
      { type_nm: '보통주 배당수익율(%) ', type: 'commonCashDividndRatio'},
      { type_nm: '보통주 주당 주식배당금(주)', type: 'commonStockDividend'},
      { type_nm: '보통주 주식배당수익율(%)', type: 'commonStockDividendRatio'},
      { type_nm: '우선주 주당 배당금(원)', type: 'preferCashDividend'},
      { type_nm: '우선주 수정주당배당금', type: 'fixPreferCashDividend'},
      { type_nm: '우선주 현금배당수익율(%)', type: 'preferCashDividendRatio'},
      { type_nm: '우선주 주당 주식배당금(주)', type: 'preferStockDividend'},
      { type_nm: '우선주 주식배당수익율(%)', type: 'preferStockDividendRatio'},
    ];
  } else if (reportsType === 'quarterReports') {
    accountArray = [
      { type_nm: '현금 배당금', type: 'commonCashDividend'},
      { type_nm: '분기 배당금', type: 'fixCommonCashDividend'},
      { type_nm: '분기 배당수익율', type: 'commonCashDividndRatio'},
      { type_nm: '배당금총액(보고)', type: 'cashDividend'},
      { type_nm: '분기EPS', type: 'eps'},
      { type_nm: '배당성향', type: 'dividendRatio'},
      { type_nm: '우선주 주당 배당금(원)', type: 'preferCashDividend'},
      { type_nm: '우선주 수정주당배당금', type: 'fixPreferCashDividend'},
      { type_nm: '우선주 현금배당수익율(%)', type: 'preferCashDividendRatio'},
    ];
  } else if (reportsType === 'accumulteReports') {
    accountArray = [
      { type_nm: '1년 배당금', type: 'fixCommonCashDividend'},
      { type_nm: '1년 배당수익율', type: 'commonCashDividndRatio'},
      { type_nm: '현금배당금총액', type: 'cashDividend'},
      { type_nm: '1년 EPS', type: 'eps'},
      { type_nm: '1년 배당성향(순이익대비)', type: 'dividendRatio'},
      { type_nm: '1년 FCFPS', type: 'fcfps'},
      { type_nm: '배당성향(FCF대비)', type: 'dividendRatio_fcfps'},
      { type_nm: '우선주 수정주당배당금', type: 'fixPreferCashDividend'},
      { type_nm: '우선주 배당수익율(%)', type: 'preferCashDividendRatio'},
    ];
  }
  
  const dividendData = filterS3DataDividend(accountArray, S3Data, 'dividend');
  // console.log(dividendData);

  return res.json(dividendData);
});


export default router;