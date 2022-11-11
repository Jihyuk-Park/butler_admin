import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { userInfoSearchType, sortTypeReturn, userInfoSortField } from '../../module/userFunction.js';
import { itemNumber } from '../../module/constVariable.js';

// getData
router.get('/getData/all/:page/:sortField/:sortType', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];

  sortType = sortTypeReturn(sortType);
  sortField = userInfoSortField(sortField);

  let sql = `SELECT a.id, a.AuthType, a.EMail, a.Phone, a.Name, a.NickName, a.createdAt, b.status, b.type, b.uid
    FROM Users a LEFT JOIN Subscribe b ON a.id = b.uid
    ORDER BY ${sortField} ${sortType}
    LIMIT ${itemNumber} OFFSET ${itemNumber*(page-1)};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

router.get('/getData/search/:page/:sortField/:sortType/:searchType/:searchInput', function(req,res){
  let [page, sortField, sortType] = [req.params.page, req.params.sortField, req.params.sortType];
  let [searchType, searchInput] = [req.params.searchType, req.params.searchInput];

  sortType = sortTypeReturn(sortType);
  sortField = userInfoSortField(sortField);

  let searchField = userInfoSearchType(searchType);

  let whereSQL = searchType === "가입일" 
    ? `WHERE ${searchField} = "${searchInput}"`
    : `WHERE ${searchField} LIKE "%${searchInput}%"`;

  // console.log(page, searchInput, searchType, searchField);

  let sql = `SELECT a.id, a.AuthType, a.EMail, a.Phone, a.Name, a.NickName, a.createdAt, b.status, b.type, b.uid
    FROM Users a LEFT JOIN Subscribe b ON a.id = b.uid
    ${whereSQL}
    ORDER BY ${sortField} ${sortType}
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
      // console.log('전체-페이지네이션 userInfo 개수 카운트 완료', rows[0]);
    }
  })
});

router.get('/getTotalNum/search/:searchType/:searchInput', function(req,res){
  let [searchType, searchInput] = [req.params.searchType, req.params.searchInput];

  let searchField = userInfoSearchType(searchType);

  let whereSQL = searchType === "가입일" 
  ? `WHERE ${searchField} = "${searchInput}"`
  : `WHERE ${searchField} LIKE "%${searchInput}%"`;

  let sql = `SELECT COUNT(*) as totalnum
    FROM Users a LEFT JOIN Subscribe b ON a.id = b.uid
    ${whereSQL}`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows[0]);
      // console.log('검색-페이지네이션 userInfo 개수 카운트 완료', rows[0]);
    }
  })
});


// edit
router.post('/edit', function(req, res){

  let id = req.body.id;
  let NickName = req.body.NickName;
  let Name = req.body.Name;
  let Phone = req.body.Phone;
  let Email = req.body.Email;
  let AuthType = req.body.AuthType;
  let createdAt = req.body.createdAt;
  let Grade = req.body.Grade;
  let Type = req.body.Type;
  let Uid = req.body.Uid;

  // console.log(id, NickName, Name, Phone, Email, AuthType, createdAt, Grade, Type, Uid);

  let sql = `UPDATE Users a LEFT JOIN Subscribe b ON a.id = b.uid
    SET NickName = "${NickName}", Name = "${Name}", Phone = "${Phone}", Email = "${Email}", AuthType = "${AuthType}",
      a.createdAt = "${createdAt}", b.status = "${Grade}", b.type = "${Type}", b.uid = "${Uid}" WHERE a.id = "${id}"`;

    connection.query(sql, function(err, result, fields){
    if(err){
        console.log(err);
        res.status(500).send('Interner Server Error')
    } else {
        return res.json("수정 성공");
    }
  })
})

export default router;
