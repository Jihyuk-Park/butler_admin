import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { itemNumber } from '../../../module/constVariable.js';

// 전체 기업 - getData
router.get('/getData/all/:startDate/:endDate/:page', function(req,res){
  let page = req.params.page;
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;

  let sql = `SELECT report_nm, rcept_dt, rcept_no, flr_nm, corp_name FROM DartReport a
    LEFT JOIN CompanyInfo b on a.corp_code = b.corp_code
    WHERE rcept_dt >= ${startDate} && rcept_dt <= ${endDate}
    ORDER BY rcept_dt DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 전체 기업 - getTotalNum
router.get('/getTotalNum/all/:startDate/:endDate', function(req,res){
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;

  let sql = `SELECT COUNT(*) as totalnum FROM DartReport
    WHERE rcept_dt >= ${startDate} && rcept_dt <= ${endDate}`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
    }
  })
});



// 검색 기업 - getData
router.get('/getData/search/:searchCompanyCode/:startDate/:endDate/:page', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;
  let page = req.params.page;

  let sql = `SELECT report_nm, rcept_dt, rcept_no, flr_nm, corp_name FROM DartReport a
    LEFT JOIN CompanyInfo b on a.corp_code = b.corp_code
    WHERE a.corp_code = ${searchCompanyCode} && rcept_dt >= ${startDate} && rcept_dt <= ${endDate}
    ORDER BY rcept_dt DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - getTotalNum
router.get('/getTotalNum/search/:searchCompanyCode/:startDate/:endDate', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;
  let sql = `SELECT COUNT(*) as totalnum FROM DartReport
    WHERE corp_code = ${searchCompanyCode} && rcept_dt >= ${startDate} && rcept_dt <= ${endDate};`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
    }
  })
});


export default router;
