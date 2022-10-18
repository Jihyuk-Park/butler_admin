import express from 'express';
const router = express.Router();
import multer from 'multer';
const upload= multer();
import connection from '../../../module/database.js';

// ㅇ 공통
// 검색 기업 - getData (공통 - 기업명, 업데이트 날짜)
router.get('/getData/search/recent/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT a.corp_name, a.stock_code, max(b.updated_at) as recent, max(c.updated_at) as earning, max(d.updated_at) as presentation FROM CompanyInfo a
    LEFT JOIN company_last_commit b on a.corp_code = b.corp_code  
    LEFT JOIN ir_quarter_earning c on a.stock_code = c.stock_code
    LEFT JOIN ir_presentation d on a.stock_code = d.stock_code
    WHERE a.stock_code = ${searchStockCode};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// ㅇ 실적
// 검색 기업 - getData (실적)
router.get('/getData/search/earning/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT bsns_year,
      GROUP_CONCAT(if(quarter_id = 1, file_name, NULL)) AS 'Q1', 
      GROUP_CONCAT(if(quarter_id = 2, file_name, NULL)) AS 'Q2', 
      GROUP_CONCAT(if(quarter_id = 3, file_name, NULL)) AS 'Q3', 
      GROUP_CONCAT(if(quarter_id = 4, file_name, NULL)) AS 'Q4'
    FROM ir_quarter_earning
    WHERE stock_code = ${searchStockCode}
    GROUP BY bsns_year
    ORDER BY bsns_year DESC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - getData (실적 목록 - deleteModal)
router.get('/getData/search/earningList/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT b.corp_name, a.id, bsns_year, quarter_id, file_name FROM ir_quarter_earning a 
    LEFT JOIN CompanyInfo b ON a.stock_code = b.stock_code
    WHERE a.stock_code = ${searchStockCode}
    ORDER BY bsns_year ASC, quarter_id ASC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - edit (실적 - 연도, 분기)
router.post('/edit/earning', function(req, res){

  let id = req.body.id;
  let bsns_year = req.body.bsns_year;
  let quarter_id = req.body.quarter_id;

  // console.log(id, bsns_year, quarter_id);

  var sql = `UPDATE ir_quarter_earning SET bsns_year=?, quarter_id=? WHERE id = ?`;
  connection.query(sql, [bsns_year, quarter_id, id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
})

// 검색 기업 - add (실적 - 파일, 연도, 분기)
router.post('/add/earning', upload.single('file'), (req, res) => {

  console.log(req.file);
  console.log(req.body);

  let bsns_year = req.body.bsns_year;
  let quarter_id = req.body.quarter_id;
  let isDuplicate = req.body.isDuplicate;

  console.log(bsns_year, quarter_id, isDuplicate);
  // S3 추가 및 db 수정 (isDuplicate에 따라) 다르게
})


// ㅇ 프리젠테이션
// 검색 기업 - getData (프리젠테이션)
router.get('/getData/search/presentation/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT id, published_date, conference_name, title, file_name
    FROM ir_presentation
    WHERE stock_code = ${searchStockCode}
    ORDER BY published_date DESC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - getData (프리젠테이션 목록 - deleteModal)
router.get('/getData/search/presentationList/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT b.corp_name, a.id, published_date, conference_name, title, file_name FROM ir_presentation a
    LEFT JOIN CompanyInfo b On a.stock_code = b.stock_code
    WHERE a.stock_code = ${searchStockCode}
    ORDER BY published_date ASC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - edit (프리젠테이션 - 날짜, 행사명, 제목)
router.post('/edit/presentation', function(req, res){

  let id = req.body.id;
  let published_date = req.body.published_date;
  let conference_name = req.body.conference_name;
  let title = req.body.title;

  // console.log(id, published_date, conference_name, title);

  var sql = `UPDATE ir_presentation SET published_date=?, conference_name=?, title=? WHERE id = ?`;
  connection.query(sql, [published_date, conference_name, title, id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
})

// 검색 기업 - add (프리젠테이션 - 파일, 날짜, 행사명, 제목)
router.post('/add/presentation', upload.single('file'), (req, res) => {

  console.log(req.file);
  console.log(req.body);

  let published_date = req.body.published_date;
  let conference_name = req.body.conference_name;
  let title = req.body.title;
  let isDuplicate = req.body.isDuplicate;

  console.log(published_date, conference_name, title, isDuplicate);
  // S3 추가 및 db 수정 (isDuplicate에 따라) 다르게
})

export default router;
