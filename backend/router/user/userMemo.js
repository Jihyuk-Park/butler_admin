import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';
import { sortTypeReturn, userMemoSortField } from '../../module/userFunction.js'

// getData
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userMemoSortField(sortField);

  let sql = `SELECT a.id, a.created_at, a.updated_at, a.type, a.memo, a.corp_code, b.corp_name, c.NickName
    FROM Memo a LEFT JOIN CompanyInfo b ON a.corp_code = b.corp_code
    LEFT JOIN Users c ON a.uid = c.id
    ORDER BY ${sortField} ${sortType}, a.id DESC
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`
	
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

// delete
router.post('/delete/:memoId', function(req,res){
  let memoId = req.params.memoId;

  let sql = 'DELETE FROM Memo WHERE id=?';

  connection.query(sql, memoId, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send('메모 삭제 완료');
    }
  })
});


export default router;
