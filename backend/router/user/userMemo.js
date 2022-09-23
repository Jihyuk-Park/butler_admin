import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';


router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let page = req.params.page;
  let sortField = req.params.sortField;
  let sortType = req.params.sortType;

  if (sortType === "내림차순") {
    sortType = 'DESC';
  } else {
    sortType = 'ASC';
  }
  if (sortField === "순번"){
    sortField = 'a.id';
  } else if (sortField === "작성일") {
    sortField = 'a.created_at';
  } else if (sortField === "갱신일") {
    sortField = 'a.updated_at';
  } else if (sortField === "기업명") {
    sortField = 'b.corp_name';
  } else {
    sortField = 'c.NickName';
  }

  let sql = `SELECT a.id, a.created_at, a.updated_at, a.type, a.memo, a.corp_code, b.corp_name, c.NickName
    FROM Memo a LEFT JOIN CompanyInfo b ON a.corp_code = b.corp_code
    LEFT JOIN Users c ON a.uid = c.id
    ORDER BY ${sortField} ${sortType}
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

router.get('/getTotalNum/all', function(req,res){

  let sql = `SELECT COUNT(*) as totalnum FROM Memo`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('전체-페이지네이션 userMeomo 개수 카운트 완료', rows[0]);
    }
  })
});

router.post('/delete/:memoId', function(req,res){
  let memoId = req.params.memoId;

  var sql = 'DELETE FROM Memo WHERE id=?';

  connection.query(sql, memoId, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send('메모 삭제 완료');
    }
  })
});


export default router;
