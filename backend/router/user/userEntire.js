import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { sortTypeReturn, userEntireSortField } from '../../module/userFunction.js'

router.get('/getData/:dataType/:sortField/:sortType', function(req,res){

  let [dataType, sortField, sortType] = [req.params.dataType, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userEntireSortField(sortField);

  let sql;
  if (dataType === '일간'){
    sql = `SELECT DATE(createdAt) AS date,
      COUNT(CASE WHEN AuthType='NAVER' THEN 1 END) AS NAVER,
      COUNT(id) AS Daily,
      COUNT(CASE WHEN AuthType='KAKAO' THEN 1 END) as KAKAO,
      SUM(count(CASE WHEN AuthType='NAVER' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_NAVER,
      SUM(COUNT(id)) OVER(ORDER BY createdAT) AS TOTAL_Daily,
      SUM(count(CASE WHEN AuthType='KAKAO' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_KAKAO
      FROM Users
      GROUP BY date
      ORDER BY ${sortField} ${sortType};`
  } else {
    sql = `SELECT date_format(createdAt, '%Y-%m') AS date,
    COUNT(CASE WHEN AuthType='NAVER' THEN 1 END) AS NAVER,
    COUNT(id) AS Daily,
    COUNT(CASE WHEN AuthType='KAKAO' THEN 1 END) as KAKAO,
    SUM(count(CASE WHEN AuthType='NAVER' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_NAVER,
    SUM(COUNT(id)) OVER(ORDER BY createdAT) AS TOTAL_Daily,
    SUM(count(CASE WHEN AuthType='KAKAO' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_KAKAO
    FROM Users
    GROUP BY date
    ORDER BY ${sortField} ${sortType};`;
  }

	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

export default router;
