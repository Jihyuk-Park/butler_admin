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
    WHERE b.corp_code="${corp_code}" && bsns_year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && sj_div ${financialSQL}
    UNION
    SELECT a.id, "Corrected" as type, "" as sj_div, "" as account_id, "" as account_nm, value as thstrm_amount, "" as thstrm_add_amount, b.id as type_id, b.type_nm FROM FinancialStatementCorrected a 
	  LEFT JOIN FinancialAccountType b on a.type_id = b.id
    WHERE corp_code="${corp_code}" && year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && b.division ${financialSQL}`;

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

  // 손익계산서 or 포괄손익계산서 구분
  let accountType = req.query.financialType;
  if (financialType === 'is'
    && !filteredData.cis_dummy
    && !filteredData.cis_comprehensive_income
    && !filteredData.cis_other_comprehensive_income
  ) {
    accountType = '손익계산서(일반)';
  }

  // 종류에 따라 데이터 가공 (한글 계정이름, 값)
  let processedData = [];

  let dataArray = financialTypeAccountArray(accountType);
  dataArray.map(function(eachAccount){
    let tempObj = { ...eachAccount };
    tempObj.value = filteredData[eachAccount.type];

    processedData.push(tempObj);
    return null
  })

  // 데이터 전송
  res.send(processedData);
});


// 검색 기업 - edit (management와 동일, bsns_year, quarter_id 받는 방식만 상이)
router.post('/edit', function(req,res){

  // req.body 배열의 0번째에 수정 정보, 그 외에는 수정할 데이터들을 전달
  let fs_div = req.body[0].fs_div === '연결' ? 'CFS' : 'OFS';
  let bsns_year = req.body[0].year.substring(0,4);
  let quarter_id = req.body[0].quarter.substring(0,1);
  let corp_code = req.body[0].searchCompanyCode;
  // console.log(fs_div, bsns_year, quarter_id, corp_code);

  // 바꾼 데이터 별로 Corrected 조회 후 추가/수정
  const changedData = req.body.slice(1);

  changedData.forEach(function(each, index){
    let dataCheckSql = `SELECT COUNT(*) as isChange FROM FinancialStatementCorrected
      WHERE corp_code="${corp_code}" && year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && type_id="${each.id}"`;

    connection.query(dataCheckSql, function(err, rows, fields){
      if (err){
        console.log(err);
      } else {
        let sql = '';
        // 기존 데이터가 있는 경우 => 수정
        if (rows[0].isChange === 1) {

          // 수정할 값이 ''인 경우 => 삭제
          if (each.value === '') {
            sql = `DELETE FROM FinancialStatementCorrected
              WHERE corp_code="${corp_code}" && year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && type_id="${each.id}"`;

          // 수정할 값이 ''이 아닌 경우 => 수정
          } else {
            sql = `UPDATE FinancialStatementCorrected SET value = "${each.value}", updated_at = NOW()
              WHERE corp_code="${corp_code}" && year="${bsns_year}" && quarter_id="${quarter_id}" && fs_div="${fs_div}" && type_id="${each.id}"`
          }

        // 데이터가 없는 경우, 추가
        } else {
          sql = `INSERT INTO FinancialStatementCorrected(corp_code, fs_div, year, quarter_id, type_id, value, created_at, updated_at)
            VALUES("${corp_code}", "${fs_div}", "${bsns_year}", "${quarter_id}", "${each.id}", "${each.value}", NOW(), NOW())`;
        }

        connection.query(sql, function(err, rows, fields){
          if (err){
            console.log(err);
          } else {
            if (index === changedData.length-1) {
              res.send('데이터 수정 완료');
            }
          }
        })      
      }
    })
  })
});

export default router;
