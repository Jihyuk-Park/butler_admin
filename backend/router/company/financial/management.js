import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { financialTypeKey, financialTypeAccountArray, filterS3DataManagement } from '../../../module/companyFunction.js';
import { getDataS3 } from '../../../module/aws.js';


// 검색 기업 - getData
router.get('/getData/search/:reportsType/s3', async function(req,res){
  let reportsType = req.params.reportsType;

  let fs_div = req.query.fs_div === '연결' ? 'CFS' : 'OFS';
  let financialType = financialTypeKey(req.query.financialType);
  let corp_code = req.query.corp_code;

  let S3Data = await getDataS3(corp_code, reportsType, fs_div);
  if (S3Data === "X"){
    return res.json("X");
  }

  let dataArray = financialTypeAccountArray(req.query.financialType);
  
  const managementData = filterS3DataManagement(dataArray, S3Data, 'fs', financialType);
  // console.log(managementData);

  res.send(managementData);
});


// 검색 기업 - edit (dart와 동일한 로직, bsns_year, quarter_id 받는 방식만 상이)
router.post('/edit', function(req,res){

  // req.body 배열의 0번째에 수정 정보, 그 외에는 수정할 데이터들을 전달
  let fs_div = req.body[0].fs_div === '연결' ? 'CFS' : 'OFS';
  let bsns_year = req.body[0].bsns_year;
  let quarter_id = req.body[0].quarter_id;
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
