import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { financialTypeSQL, financialTypeKey, financialTypeAccountArray } from '../../../module/companyFunction.js';
import { getDataS3 } from '../../../module/aws.js';

// 검색 기업 - getData
router.get('/getData/search/db', function(req,res){

  let fs_div = req.query.fs_div === '연결' ? 'CFS' : 'OFS';
  let bsns_year = req.query.year.substring(0,4);
  let quarter_id = req.query.quarter.substring(0,1);
  let financialType = req.query.financialType;
  let corp_code = req.query.corp_code;

  let financialSQL = financialTypeSQL(financialType);

  let sql = `SELECT a.id, "RAW" as type, sj_div, account_id, account_nm, thstrm_amount, thstrm_add_amount, c.id as type_id, c.type_nm FROM FinancialStatement a
	  LEFT JOIN StoredReport b on a.report_id = b.id
    LEFT JOIN FinancialAccountType c on a.account_type_id = c.id
    WHERE b.corp_code="${corp_code}" && bsns_year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && ${financialSQL}
    UNION
    SELECT a.id, "Corrected" as type, "" as sj_div, "" as account_id, "" as account_nm, value as thstrm_amount, "" as thstrm_add_amount, b.id as type_id, b.type_nm FROM FinancialStatementCorrected a 
	  LEFT JOIN FinancialAccountType b on a.type_id = b.id
    WHERE corp_code="${corp_code}" && year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}"`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - getData
router.get('/getData/search/s3', async function(req,res){

  let fs_div = req.query.fs_div === '연결' ? 'CFS' : 'OFS';
  let bsns_year = req.query.year.substring(0,4);
  // S3 JSON quarter_id는 int
  let quarter_id = parseInt(req.query.quarter.substring(0,1), 10);
  let financialType = financialTypeKey(req.query.financialType);
  let corp_code = req.query.corp_code;

  let S3Data = await getDataS3(corp_code, 'rawReports', fs_div);
  if (S3Data === "X"){
    return res.json("X");
  }

  // 연결/개별, 년, 분기, 재무제표 종류에 맞는 데이터 필터링
  let filteredData = S3Data.filter(eachdata =>
    eachdata.bsns_year === bsns_year &&
    eachdata.quarter_id === quarter_id &&
    eachdata.fs_div === fs_div
  )[0].fs[financialType];

  // console.log(filteredData);

  // 데이터 가공 (한글 계정이름, 값)
  let processedData = [];

  let dataArray = financialTypeAccountArray(req.query.financialType);
  dataArray.map(function(eachAccount){
    let tempObj = { ...eachAccount };
    tempObj.value = filteredData[eachAccount.type];

    processedData.push(tempObj);
    return null
  })

  res.send(processedData);

});

export default router;
