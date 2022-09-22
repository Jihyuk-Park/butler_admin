import express from 'express';
const router = express.Router();
import connection from '../module/database.js';
import { userInfoSearchType } from '../module/userFunction.js';

const itemNumber = 12;

router.get('/userInfo/getData/all/:page', function(req,res){
  let page = req.params.page;

  let sql = `SELECT id, AuthType, EMail, Phone, Name, NickName FROM Users
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

router.get('/userInfo/getData/search/:page/:searchType/:searchInput', function(req,res){
  let page = req.params.page;
  let searchType = req.params.searchType;
  let searchInput = req.params.searchInput;

  let searchField = userInfoSearchType(searchType);

  // console.log(page, searchInput, searchType, searchField);

  let sql = `SELECT id, AuthType, EMail, Phone, Name, NickName FROM Users
    WHERE ${searchField} LIKE "%${searchInput}%"
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

router.get('/userInfo/getTotalNum/all', function(req,res){

  let sql = `SELECT COUNT(*) as totalnum FROM Users`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('전체-페이지네이션 userInfo 개수 카운트 완료', rows[0]);
    }
  })
});

router.get('/userInfo/getTotalNum/search/:searchType/:searchInput', function(req,res){
  let searchType = req.params.searchType;
  let searchInput = req.params.searchInput;

  let searchField = userInfoSearchType(searchType);

  let sql = `SELECT COUNT(*) as totalnum FROM Users 
    WHERE ${searchField} LIKE "%${searchInput}%"`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('검색-페이지네이션 userInfo 개수 카운트 완료', rows[0]);
    }
  })
});

router.post('/userInfo/edit', function(req, res){

  let id = req.body.id;
  let NickName = req.body.NickName;
  let Name = req.body.Name;
  let Phone = req.body.Phone;
  let Email = req.body.Email;
  let AuthType = req.body.AuthType;
  let Grade = req.body.Grade;
  let Type = req.body.Type;
  let Uid = req.body.Uid;

  // console.log(id, NickName, Name, Phone, Email, AuthType, Grade, Type, Uid);

  var sql = 'UPDATE Users SET NickName =?, Name=?, Phone=?, Email =?, AuthType =? WHERE id = ?';
  connection.query(sql, [NickName, Name, Phone, Email, AuthType, id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
})


// userMemo
// 따로 리팩토링
router.get('/userMemo/getData/all/:page/:sortField/:sortType', function(req,res){
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

router.get('/userMemo/getTotalNum/all', function(req,res){

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

router.post('/userMemo/delete/:memoId', function(req,res){
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
