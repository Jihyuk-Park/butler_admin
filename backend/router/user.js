import express from 'express';
const router = express.Router();
import connection from '../database.js';

const itemNumber = 12;

router.get('/UserInfo/get/:page', function(req,res){
  var page = req.params.page;

  var sql = `SELECT id, AuthType, EMail, Phone, Name, NickName FROM Users
  ORDER BY id DESC
	LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

router.get('/UserInfo/getTotalNum', function(req,res){

  var sql = `SELECT COUNT(*) as totalnum FROM Users`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('페이지네이션 글 개수 카운트 완료', rows[0]);
    }
  })
});

export default router;
