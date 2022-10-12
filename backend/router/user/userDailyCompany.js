import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';
import { userDailyCompanySearchCondition } from '../../module/userFunction.js'

// getData
router.get('/getData/all/:page', function(req,res){
  let page = req.params.page;

  // outer join (LEFT + RIGHT + UNION)
  let sql=`SELECT DATE(a.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
    LEFT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
    LEFT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
    Group BY DATE(a.created_at)
    UNION
    SELECT DATE(c.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
    RIGHT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
    RIGHT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
    Group BY DATE(c.created_at)
    ORDER BY date DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

router.get(`/getData/search/:page`, function(req,res){
  let page = req.params.page;

  let searchCountingStart = req.query.searchCountingStart;
  let searchCountingEnd = req.query.searchCountingEnd;
  let searchUserCountingStart = req.query.searchUserCountingStart;
  let searchUserCountingEnd = req.query.searchUserCountingEnd;

  let searchCondition = userDailyCompanySearchCondition(searchCountingStart,searchCountingEnd, searchUserCountingStart, searchUserCountingEnd);

  // 일자별 검색 기준 + 일자별 관심목록 기준이므로 a.created_at와 c.created_at으로 조인
  let sql=`SELECT * FROM
      (SELECT DATE(a.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
      LEFT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
      LEFT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
      Group BY DATE(a.created_at)

      UNION

      SELECT DATE(c.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
      RIGHT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
      RIGHT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
      Group BY DATE(c.created_at)
      ) A

    ${searchCondition}
    ORDER BY date DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`

  let searchCompanyCode = req.query.searchCompanyCode;
  
  if (searchCompanyCode.length != 0 ){

    // 기업 검색 시, 일자별 검색 히스토리 기준이 아니라 존재하는 기업의 검색(+ 관심목록)데이터 기준이므로 필터링 후 outer join
    sql=`SELECT * FROM
        (SELECT date, nonMemberSearchCounting, totalSearchCounting, watchCounting, totalWatchCounting FROM 
        ((SELECT DATE(created_at) as date, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting
        FROM SearchHistory WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) A
        LEFT OUTER JOIN 
        (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting
        FROM Watch WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) as b
        ON date = Date(b.created_at)) GROUP BY date

        UNION

        SELECT date, nonMemberSearchCounting, totalSearchCounting, watchCounting, totalWatchCounting FROM 
        ((SELECT DATE(created_at) as dateA, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting
        FROM SearchHistory WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) A
        RIGHT OUTER JOIN 
        (SELECT Date(created_at) as date, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting
        FROM Watch WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) as b
        ON dateA = date) GROUP BY date) B

      ${searchCondition}
      ORDER BY date DESC
      LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`
    
    // (삭제 예정) 기존 변형 코드 맨 위 요상한게 남는. 
    // sql=`SELECT * FROM
    //   (SELECT DATE(b.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
    //   LEFT JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory ${companyCondition} Group BY DATE(created_at)) as b ON a.created_at = b.created_at
    //   LEFT JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch ${companyCondition} Group BY DATE(created_at)) as c ON a.created_at = c.created_at
    //   Group BY DATE(b.created_at)
    //   UNION
    //   SELECT DATE(c.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
    //   RIGHT JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory ${companyCondition} Group BY DATE(created_at)) as b ON a.created_at = b.created_at
    //   RIGHT JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch ${companyCondition} Group BY DATE(created_at)) as c ON a.created_at = c.created_at
    //   Group BY DATE(c.created_at)
    //   ) A
    // ${searchCondition}
    // ORDER BY date DESC
    // LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`
  }
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});


// getTotalNum
router.get('/getTotalNum/all', function(req,res){

  let sql = `SELECT count(*) as totalnum FROM
    (SELECT Date(created_at) as date, COUNT(*) FROM SearchHistory GROUP BY date
    UNION
    SELECT Date(created_at) as date, COUNT(*) FROM Watch GROUP BY date) A;`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows[0]);
      res.send(rows[0]);
    }
  })
});

router.get('/getTotalNum/search', function(req,res){

  let searchCountingStart = req.query.searchCountingStart;
  let searchCountingEnd = req.query.searchCountingEnd;
  let searchUserCountingStart = req.query.searchUserCountingStart;
  let searchUserCountingEnd = req.query.searchUserCountingEnd;

  let searchCondition = userDailyCompanySearchCondition(searchCountingStart,searchCountingEnd, searchUserCountingStart, searchUserCountingEnd);

  // 일자별 검색 기준 + 관심목록이므로 a.created_at와 c.created_at으로
  let sql=`SELECT COUNT(*) as totalnum FROM
      (SELECT DATE(a.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
      LEFT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
      LEFT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
      Group BY DATE(a.created_at)

      UNION

      SELECT DATE(c.created_at) as date, totalSearchCounting, nonMemberSearchCounting, watchCounting, totalWatchCounting FROM SearchHistory as a
      RIGHT OUTER JOIN (SELECT created_at, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting FROM SearchHistory Group BY DATE(created_at)) as b ON a.created_at = b.created_at
      RIGHT OUTER JOIN (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting FROM Watch Group BY DATE(created_at)) as c ON a.created_at = c.created_at
      Group BY DATE(c.created_at)
      ) A

    ${searchCondition};`

  let searchCompanyCode = req.query.searchCompanyCode;
  
  if (searchCompanyCode.length != 0 ){

    // 기업 검색 시, 일자별 검색 히스토리 기준이 아니라 존재하는 기업의 검색(+ 관심목록)데이터 기준이므로 필터링 후 outer join
    sql=`SELECT COUNT(*) as totalnum FROM
        (SELECT date, nonMemberSearchCounting, totalSearchCounting, watchCounting, totalWatchCounting FROM 
        ((SELECT DATE(created_at) as date, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting
        FROM SearchHistory WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) A
        LEFT OUTER JOIN 
        (SELECT created_at, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting
        FROM Watch WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) as b
        ON date = Date(b.created_at)) GROUP BY date

        UNION

        SELECT date, nonMemberSearchCounting, totalSearchCounting, watchCounting, totalWatchCounting FROM 
        ((SELECT DATE(created_at) as dateA, COUNT(case when userId is null then 1 end) as nonMemberSearchCounting, (count(*)) as totalSearchCounting
        FROM SearchHistory WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) A
        RIGHT OUTER JOIN 
        (SELECT Date(created_at) as date, count(*) as watchCounting, SUM(count(id)) over(order by created_at) as totalWatchCounting
        FROM Watch WHERE corp_code = ${searchCompanyCode} Group BY DATE(created_at)) as b
        ON dateA = date) GROUP BY date) B

      ${searchCondition};`
  }


  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows[0]);
      res.send(rows[0]);
    }
  })
});

export default router;
