import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { itemNumber } from '../../../module/constVariable.js';
import { sortTypeReturn, irListSortField } from '../../../module/companyFunction.js'

// 전체 기업 - getData (* stock_code 있는 기업만)
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = irListSortField(sortField);

  let sql = `SELECT a.corp_code, corp_name, a.stock_code, ir_url, max(b.updated_at) as recent, max(c.updated_at) as earning, max(d.updated_at) as presentation FROM CompanyInfo a
    LEFT JOIN company_last_commit b on a.corp_code = b.corp_code
    LEFT JOIN ir_quarter_earning c on a.stock_code = c.stock_code
    LEFT JOIN ir_presentation d on a.stock_code = d.stock_code
    WHERE a.stock_code NOT IN ("")
    GROUP by a.stock_code
    ORDER BY ${sortField} ${sortType}, a.stock_code DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 전체 기업 - getTotalNum (* stock_code 있는 기업만)
router.get('/getTotalNum/all', function(req,res){

  let sql = `SELECT COUNT(*) as totalnum FROM CompanyInfo
    WHERE stock_code NOT IN ("")`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('전체-페이지네이션 CompanyInfo 개수 카운트 완료', rows[0]);
    }
  })
});


// 검색 기업 - getData
router.get('/getData/search/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let sql = `SELECT a.corp_code, corp_name, a.stock_code, ir_url, max(b.updated_at) as recent, max(c.updated_at) as earning, max(d.updated_at) as presentation FROM CompanyInfo a
    LEFT JOIN company_last_commit b on a.corp_code = b.corp_code
    LEFT JOIN ir_quarter_earning c on a.stock_code = c.stock_code
    LEFT JOIN ir_presentation d on a.stock_code = d.stock_code
    WHERE a.corp_code = ${searchCompanyCode};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

export default router;
