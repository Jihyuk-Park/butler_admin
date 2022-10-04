import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';
import { sortTypeReturn, userUsageSortField, userUsageSearchCondition, userUsageCompanyCondition } from '../../module/userFunction.js'

// getData
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userUsageSortField(sortField);

  let sql = `SELECT a.id, a.NickName, a.createdAt, a.updatedAt, b.memoCounting, c.searchCounting, d.watchGroupCounting, g.watchCompanyCounting FROM Users as a
    LEFT JOIN (SELECT uid, COUNT(*) as memoCounting FROM Memo Group BY uid) as b ON a.id = b.uid
    LEFT JOIN (SELECT userId, COUNT(*) as searchCounting FROM SearchHistory Group BY userId) as c ON a.id = c.userId
    LEFT JOIN (SELECT uid, COUNT(*) as watchGroupCounting FROM WatchGroup Group By uid) as d ON a.id = d.uid
    LEFT JOIN (SELECT f.uid, COUNT(*) as watchCompanyCounting FROM Watch e LEFT JOIN WatchGroup f ON e.watchGroupId = f.id GROUP BY f.uid) as g ON a.id = g.uid
    ORDER BY ${sortField} ${sortType}, a.id DESC
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
  sortField = userUsageSortField(sortField);

  let searchNickName = req.query.searchNickName;
  let searchRegisterStart = req.query.searchRegisterStart;
  let searchRegisterEnd = req.query.searchRegisterEnd;
  let searchConnectStart = req.query.searchConnectStart;
  let searchConnectEnd = req.query.searchConnectEnd;
  let searchCompanyStart = req.query.searchCompanyStart;
  let searchCompanyEnd = req.query.searchCompanyEnd;

  let searchCondition = userUsageSearchCondition(searchNickName, searchRegisterStart, searchRegisterEnd, searchConnectStart, searchConnectEnd);
  let companyCondition = userUsageCompanyCondition(searchCompanyStart, searchCompanyEnd);

  let sql = `SELECT a.id, a.NickName, a.createdAt, a.updatedAt, b.memoCounting, c.searchCounting, d.watchGroupCounting, g.watchCompanyCounting FROM Users as a
    LEFT JOIN (SELECT uid, COUNT(*) as memoCounting FROM Memo Group BY uid) as b ON a.id = b.uid
    LEFT JOIN (SELECT userId, created_at, COUNT(*) as searchCounting FROM SearchHistory ${companyCondition} Group BY userId) as c ON a.id = c.userId
    LEFT JOIN (SELECT uid, COUNT(*) as watchGroupCounting FROM WatchGroup Group By uid) as d ON a.id = d.uid
    LEFT JOIN (SELECT f.uid, COUNT(*) as watchCompanyCounting FROM Watch e LEFT JOIN WatchGroup f ON e.watchGroupId = f.id GROUP BY f.uid) as g ON a.id = g.uid
    ${searchCondition}
    ORDER BY ${sortField} ${sortType}, a.id DESC
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

  let sql = `SELECT COUNT(*) as totalnum FROM Users`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
    }
  })
});

router.get('/getTotalNum/search', function(req,res){

  let searchNickName = req.query.searchNickName;
  let searchRegisterStart = req.query.searchRegisterStart;
  let searchRegisterEnd = req.query.searchRegisterEnd;
  let searchConnectStart = req.query.searchConnectStart;
  let searchConnectEnd = req.query.searchConnectEnd;

  let searchCondition = userUsageSearchCondition(searchNickName, searchRegisterStart, searchRegisterEnd, searchConnectStart, searchConnectEnd);

  let sql = `SELECT COUNT(*) as totalnum FROM Users as a
    LEFT JOIN (SELECT uid, COUNT(*) as memoCounting FROM Memo Group BY uid) as b ON a.id = b.uid
    LEFT JOIN (SELECT userId, created_at, COUNT(*) as searchCounting FROM SearchHistory Group BY userId) as c ON a.id = c.userId
    LEFT JOIN (SELECT uid, COUNT(*) as watchGroupCounting FROM WatchGroup Group By uid) as d ON a.id = d.uid
    LEFT JOIN (SELECT f.uid, COUNT(*) as watchCompanyCounting FROM Watch e LEFT JOIN WatchGroup f ON e.watchGroupId = f.id GROUP BY f.uid) as g ON a.id = g.uid
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
