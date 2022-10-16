import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { periodYearArrayAuto } from '../../../module/companyFunction.js'

const minorityShareHoldersArray = [
  ['"주주 수"', 'shrholdr_co'],
  ['"전체 주주 수"', 'shrholdr_tot_co'],
  ['"주주 비율(%)"', 'shrholdr_rate'],
  ['"보유 주식 수"', 'hold_stock_co'],
  ['"총 발행 주식 수"', 'stock_tot_co'],
  ['"보유 주식 비율(%)"', 'hold_stock_rate'],
];

// getData
router.get('/getData/search/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  
  const periodArray = periodYearArrayAuto();
  
  let sql = '';
  minorityShareHoldersArray.map(function (each, index){
    sql += `SELECT ${each[0]} as se, `;
    periodArray.map(function (year){
      for (let quarter = 1; quarter <= 4; quarter += 1){
        sql += `GROUP_CONCAT(if(bsns_year = 20${year} && quarter_id = ${quarter}, ${each[1]}, null)) AS 'Q${quarter}${year}',\n`;
      }
    });
    sql = sql.slice(0, -2);
    sql += `\nFROM MinorShareholders a LEFT JOIN StoredReport b on a.report_id = b.id
      WHERE corp_code = ${searchCompanyCode}`;
    if (index !== 5){
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
  FROM MinorShareholders a
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

  let sql = `SELECT shrholdr_co as "주주 수", shrholdr_tot_co as "전체 주주 수", shrholdr_rate as "주주 비율(%)",
    hold_stock_co as "보유 주식 수", stock_tot_co as "총 발행 주식 수", hold_stock_rate as "보유 주식 비율(%)", bsns_year, quarter_id
    FROM MinorShareholders a
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

  let shrholdr_co = req.body['주주 수'];
  let shrholdr_tot_co = req.body['전체 주주 수'];
  let shrholdr_rate = req.body['주주 비율(%)'];
  let hold_stock_co = req.body['보유 주식 수'];
  let stock_tot_co = req.body['총 발행 주식 수'];
  let hold_stock_rate = req.body['보유 주식 비율(%)'];

  // console.log(shrholdr_co, shrholdr_tot_co, shrholdr_rate, hold_stock_co, stock_tot_co, hold_stock_rate);

  var sql = `UPDATE MinorShareholders a LEFT JOIN StoredReport b
  ON a.report_id = b.id
  SET shrholdr_co = ?, shrholdr_tot_co = ?, shrholdr_rate = ?, hold_stock_co = ?, stock_tot_co = ?, hold_stock_rate = ?
  WHERE corp_code = ${searchCompanyCode} && bsns_year = ${year} && quarter_id = ${quarter};`;
  connection.query(sql, [shrholdr_co, shrholdr_tot_co, shrholdr_rate, hold_stock_co, stock_tot_co, hold_stock_rate], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
});

export default router;
