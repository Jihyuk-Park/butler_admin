import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';

router.get('/getData/:sortType', function(req,res){

  let sortType = req.params.sortType;

  let sql;
  if (sortType === '일간'){
    sql = `SELECT DATE(createdAt) AS date,
      COUNT(CASE WHEN AuthType='NAVER' THEN 1 END) AS NAVER,
      COUNT(id) AS daily,
      SUM(count(CASE WHEN AuthType='NAVER' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_NAVER,
      SUM(COUNT(id)) OVER(ORDER BY createdAT) AS TOTAL_Daily
      FROM Users
      GROUP BY date
      ORDER BY date DESC;`
  } else {
    sql = `SELECT date_format(createdAt, '%Y-%m') AS date,
    COUNT(CASE WHEN AuthType='NAVER' THEN 1 END) AS NAVER,
    COUNT(id) AS daily,
    SUM(count(CASE WHEN AuthType='NAVER' THEN 1 END)) OVER(ORDER BY createdAT) AS TOTAL_NAVER,
    SUM(COUNT(id)) OVER(ORDER BY createdAT) AS TOTAL_Daily
    FROM Users
    GROUP BY date
    ORDER BY date DESC;`;
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
