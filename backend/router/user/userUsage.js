import express from 'express';
const router = express.Router();
import connection from '../../module/database.js';
import { itemNumber } from '../../module/constVariable.js';

router.get('/getData/all/:page', function(req,res){
  let page = req.params.page;

  let sql = `SELECT a.id, a.AuthType, a.EMail, a.Phone, a.Name, a.NickName, b.status, b.type
    FROM Users a LEFT JOIN Subscribe b ON a.id = b.uid
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


export default router;
