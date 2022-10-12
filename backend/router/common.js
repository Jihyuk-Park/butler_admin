import express from 'express';
const router = express.Router();
import connection from '../module/database.js';

// getCompanyList (기업 검색 자동완성)
router.get('/getCompanyList/:inputText', function(req,res){
  let inputText = req.params.inputText;

  let sql = `SELECT CONCAT(corp_name, ' ', stock_code) as corp_name, corp_code FROM CompanyInfo WHERE corp_name LIKE "%${inputText}%" || stock_code LIKE "%${inputText}%"`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

export default router;
