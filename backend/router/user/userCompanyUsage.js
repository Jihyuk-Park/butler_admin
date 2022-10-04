import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';
import { sortTypeReturn, userCompanyUsageSortField, userCompanyUsageSearchCondition, userCompanyUsageCompanyCondition } from '../../module/userFunction.js'

// getData
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userCompanyUsageSortField(sortField);

  let sql = `SELECT a.corp_code, a.corp_name, b.memberSearchCounting, c.totalSearchCounting, d.nonMemberSearchCounting, e.watchCounting, f.memoCounting FROM CompanyInfo as a
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as memberSearchCounting FROM SearchHistory WHERE userId IS NULL Group BY corp_code) as b ON a.corp_code = b.corp_code
  	LEFT JOIN (SELECT corp_code, COUNT(*) as totalSearchCounting FROM SearchHistory Group BY corp_code) as c ON a.corp_code = c.corp_code
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as nonMemberSearchCounting FROM SearchHistory WHERE userId IS NOT NULL Group BY corp_code) as d ON a.corp_code = d.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as watchCounting FROM Watch Group By corp_code) as e ON a.corp_code = e.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as memoCounting FROM Memo GROUP BY corp_code) as f ON a.corp_code = f.corp_code
    ORDER BY ${sortField} ${sortType}, a.corp_code DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

router.get(`/getData/search/:page/:sortField/:sortType`, function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userCompanyUsageSortField(sortField);

  let searchCompanyName = req.query.searchCompanyName;
  let searchCountingStart = req.query.searchCountingStart;
  let searchCountingEnd = req.query.searchCountingEnd;
  let searchUserCountingStart = req.query.searchUserCountingStart;
  let searchUserCountingEnd = req.query.searchUserCountingEnd;
  let searchCompanyStart = req.query.searchCompanyStart;
  let searchCompanyEnd = req.query.searchCompanyEnd;

  let searchCondition = userCompanyUsageSearchCondition(searchCompanyName, searchCountingStart, searchCountingEnd, searchUserCountingStart, searchUserCountingEnd);
  let companyCondition = userCompanyUsageCompanyCondition(searchCompanyStart, searchCompanyEnd);

  let sql = `SELECT a.corp_code, a.corp_name, b.memberSearchCounting, c.totalSearchCounting, d.nonMemberSearchCounting, e.watchCounting, f.memoCounting FROM CompanyInfo as a
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as memberSearchCounting FROM SearchHistory WHERE userId IS NULL ${companyCondition[0]} Group BY corp_code) as b ON a.corp_code = b.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as totalSearchCounting FROM SearchHistory ${companyCondition[1]} Group BY corp_code) as c ON a.corp_code = c.corp_code
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as nonMemberSearchCounting FROM SearchHistory WHERE userId IS NOT NULL ${companyCondition[0]} Group BY corp_code) as d ON a.corp_code = d.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as watchCounting FROM Watch Group By corp_code) as e ON a.corp_code = e.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as memoCounting FROM Memo GROUP BY corp_code) as f ON a.corp_code = f.corp_code
    ${searchCondition}
    ORDER BY ${sortField} ${sortType}, a.corp_code DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});


// getTotalNum
router.get('/getTotalNum/all', function(req,res){

  let sql = `SELECT COUNT(*) as totalnum FROM CompanyInfo`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
    }
  })
});

router.get('/getTotalNum/search', function(req,res){

  let searchCompanyName = req.query.searchCompanyName;
  let searchCountingStart = req.query.searchCountingStart;
  let searchCountingEnd = req.query.searchCountingEnd;
  let searchUserCountingStart = req.query.searchUserCountingStart;
  let searchUserCountingEnd = req.query.searchUserCountingEnd;

  let searchCondition = userCompanyUsageSearchCondition(searchCompanyName, searchCountingStart, searchCountingEnd, searchUserCountingStart, searchUserCountingEnd);

  let sql = `SELECT COUNT(*) as totalnum FROM CompanyInfo as a
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as memberSearchCounting FROM SearchHistory WHERE userId IS NULL Group BY corp_code) as b ON a.corp_code = b.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as totalSearchCounting FROM SearchHistory Group BY corp_code) as c ON a.corp_code = c.corp_code
    LEFT JOIN (SELECT corp_code, userId, COUNT(*) as nonMemberSearchCounting FROM SearchHistory WHERE userId IS NOT NULL Group BY corp_code) as d ON a.corp_code = d.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as watchCounting FROM Watch Group By corp_code) as e ON a.corp_code = e.corp_code
    LEFT JOIN (SELECT corp_code, COUNT(*) as memoCounting FROM Memo GROUP BY corp_code) as f ON a.corp_code = f.corp_code
  ${searchCondition};`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
    }
  })
});




export default router;
