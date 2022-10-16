import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { periodYearArrayAuto } from '../../../module/companyFunction.js'

const executiveArray = [['"인원"', 'nmpr'], ['"보수총액"', 'jan_avrg_mendng_am'], ['"1인당 금액"', 'mendng_totamt']];

// getData
router.get('/getData/search/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  
  const periodArray = periodYearArrayAuto();
  
  let sql = '';
  executiveArray.map(function (each, index){
    sql += `SELECT ${each[0]} as se, `;
    periodArray.map(function (year){
      for (let quarter = 1; quarter <= 4; quarter += 1){
        sql += `GROUP_CONCAT(if(bsns_year = 20${year} && quarter_id = ${quarter}, ${each[1]}, null)) AS 'Q${quarter}${year}',\n`;
      }
    });
    sql = sql.slice(0, -2);
    sql += `\nFROM ExecReward a LEFT JOIN StoredReport b on a.report_id = b.id
      WHERE corp_code = ${searchCompanyCode}`;
    if (index !== 2){
      sql += '\nUNION \n';
    } else {
      sql += ';';
    }
  })

  // console.log(sql);
  	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// 데이터가 있는 기간 목록 로드
router.get('/getPeriodList/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let sql = `SELECT bsns_year, quarter_id
  FROM ExecReward a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode}
  GROUP BY bsns_year, quarter_id
  ORDER BY bsns_year ASC, quarter_id ASC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// 기간에 따른 데이터 로드
router.get('/getData/period/:searchCompanyCode/:year/:quarter', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let year = req.params.year;
  let quarter = req.params.quarter;

  let sql = `SELECT nmpr as "인원", jan_avrg_mendng_am as "보수총액", mendng_totamt as "1인당 금액", bsns_year, quarter_id
  FROM ExecReward a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode} && bsns_year = ${year} && quarter_id = ${quarter};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// editData
router.post('/editData/period/:searchCompanyCode/:year/:quarter', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let year = req.params.year;
  let quarter = req.params.quarter;

  let nmpr = req.body['인원'];
  let jan_avrg_mendng_am = req.body['보수총액'];
  let mendng_totamt = req.body['1인당 금액'];

  // console.log(nmpr, jan_avrg_mendng_am, mendng_totamt);

  var sql = `UPDATE ExecReward a LEFT JOIN StoredReport b
  ON a.report_id = b.id
  SET nmpr=?, jan_avrg_mendng_am=?, mendng_totamt=? WHERE corp_code = ${searchCompanyCode} && bsns_year = ${year} && quarter_id = ${quarter};`;
  connection.query(sql, [nmpr, jan_avrg_mendng_am, mendng_totamt], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
});

export default router;
