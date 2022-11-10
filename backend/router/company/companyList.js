import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';
import { sortTypeReturn, companyListSortField } from '../../module/companyFunction.js'

// 전체 기업 - getData (* stock_code 있는 기업만)
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = companyListSortField(sortField);

  let sql = `SELECT corp_code, corp_name, stock_code, market_code, ir_url, Acc_mt, fs_div, keyword, b.code_name_kr as induty1, c.code_name_kr as induty2, d.code_name_kr as induty3 FROM CompanyInfo a
    LEFT JOIN IndustryCode b ON SUBSTR(a.induty_code, 1, 2) = b.code
    LEFT JOIN IndustryCode c ON SUBSTR(a.induty_code, 1, 3) = c.code
    LEFT JOIN IndustryCode d ON SUBSTR(a.induty_code, 1, 4) = d.code
    WHERE stock_code NOT IN ("")
    ORDER BY ${sortField} ${sortType}, corp_code DESC
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

  let sql = `SELECT corp_code, corp_name, stock_code, market_code, ir_url, Acc_mt, fs_div, keyword, b.code_name_kr as induty1, c.code_name_kr as induty2, d.code_name_kr as induty3 FROM CompanyInfo a
    LEFT JOIN IndustryCode b ON SUBSTR(a.induty_code, 1, 2) = b.code
    LEFT JOIN IndustryCode c ON SUBSTR(a.induty_code, 1, 3) = c.code
    LEFT JOIN IndustryCode d ON SUBSTR(a.induty_code, 1, 4) = d.code
    WHERE corp_code = ${searchCompanyCode}`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});


// edit
router.post('/edit', function(req, res){

  let corp_code = req.body.corp_code;
  let keyword = req.body.keyword;
  let ir_url = req.body.ir_url;

  // console.log(corp_code, keyword, ir_url);

  let sql = `UPDATE CompanyInfo SET keyword=?, ir_url=? WHERE corp_code = ?`;
  connection.query(sql, [keyword, ir_url, corp_code], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
})

export default router;
