import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { itemNumber } from '../../../module/constVariable.js';
import { sortTypeReturn, sectorListSortField } from '../../../module/companyFunction.js'

// 전체 기업 - getData (* stock_code 있는 기업만)
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = sectorListSortField(sortField);

  let sql = `SELECT a.corp_name, a.corp_code, a.stock_code, IF(b.commit_type="ANALYSIS", max(b.last_commit_date), NULL) as recent, segment_last_updated, segment_title1, segment_title2, segment_source, currency, unit, is_available FROM CompanyInfo a 
	  LEFT JOIN company_last_commit b on a.corp_code = b.corp_code
	  LEFT JOIN analysis_company_info c on a.corp_code = c.corp_code
    WHERE a.stock_code NOT IN ("")
    GROUP by a.stock_code
    ORDER BY ${sortField} ${sortType}, a.stock_code ASC
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

  let sql = `SELECT a.corp_name, a.stock_code, a.corp_code, max(b.updated_at) as recent, segment_last_updated, segment_title1, segment_title2, segment_source, currency, unit, is_available FROM CompanyInfo a 
    LEFT JOIN company_last_commit b on a.corp_code = b.corp_code
    LEFT JOIN analysis_company_info c on a.corp_code = c.corp_code
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
