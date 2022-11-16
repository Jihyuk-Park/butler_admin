import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { updateCommit, updateCommitStockCode } from '../../../module/companyFunction.js'
import { deleteIRS3, uploadIRS3 } from '../../../module/aws.js';

// ㅇ 공통
// 검색 기업 - getData (공통 - 기업명, 업데이트 날짜)
router.get('/getData/search/recent/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT a.corp_name, a.stock_code, max(b.last_commit_date) as recent, max(c.updated_at) as earning, max(d.updated_at) as presentation FROM CompanyInfo a
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

// 검색 기업 - getData (실적 목록 - deleteModal, addEditModal)
router.get('/getData/search/earningList/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT b.corp_name, b.stock_code, b.corp_code, a.id, bsns_year, quarter_id, file_name FROM ir_quarter_earning a 
    LEFT JOIN CompanyInfo b ON a.stock_code = b.stock_code
    WHERE a.stock_code = ${searchStockCode}
    ORDER BY bsns_year DESC, quarter_id DESC;`;
	
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

  let corp_code = req.body.corp_code;
  // console.log(id, bsns_year, quarter_id, corp_code);

  var sql = `UPDATE ir_quarter_earning SET bsns_year=?, quarter_id=?, updated_at=NOW() WHERE id = ?`;
  connection.query(sql, [bsns_year, quarter_id, id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })

  // last commit 업데이트
  updateCommit(corp_code, 'IR');
})

// 검색 기업 - add (실적 - 파일, 연도, 분기)
router.post('/add/earning', uploadIRS3.single('file'), (req, res) => {
  // console.log(req.body);
  
  let bsns_year = req.body.bsns_year;
  let quarter_id = req.body.quarter_id;
  let stock_code = req.body.stock_code;
  let isDuplicate = req.body.isDuplicate;
  let deleteFileName = req.body.deleteFileName;
  let sql = '';

  // 기간 중복 있을 시, S3 및 DB 파일 삭제
  if (isDuplicate !== 0) {
    let path = `${stock_code}/1. Earnings Release/${deleteFileName}`;
    let isDelete = deleteIRS3(path);
    if (isDelete) {
      sql = `DELETE FROM ir_quarter_earning WHERE id = "${isDuplicate}"`;;
  
      connection.query(sql, function(err, rows, fields){
        if (err){
          console.log(err);
        } else {
          // db 추가
          sql=`INSERT INTO ir_quarter_earning(bsns_year, quarter_id, file_name, stock_code, created_at, updated_at)
          VALUES("${bsns_year}", "${quarter_id}", "${req.file.originalname}", "${stock_code}", NOW(), NOW())`;

          connection.query(sql, function(err, result, fields){
            if(err){
              console.log(err);
              res.status(500).send('Interner Server Error')
            } else {
              updateCommitStockCode(stock_code, 'IR');
              return res.json("추가 성공");
            }
          })
        }
      });
    }
  } else {
    // 중복 없을 시 바로 db 추가
    sql=`INSERT INTO ir_quarter_earning(bsns_year, quarter_id, file_name, stock_code, created_at, updated_at)
    VALUES("${bsns_year}", "${quarter_id}", "${req.file.originalname}", "${stock_code}", NOW(), NOW())`;

    connection.query(sql, function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Interner Server Error')
      } else {
        updateCommitStockCode(stock_code, 'IR');
        return res.json("추가 성공");
      }
    })
  }  
})


// 검색 기업 - add 다중 (실적 - 파일, 연도, 분기)
router.post('/add/multiple/earning', uploadIRS3.array('files'), (req, res) => {
  let stock_code = req.body.stock_code;

  let bsns_year = req.body.bsns_year;
  let quarter_id = req.body.quarter_id;
  let file_name = req.body.file_name;
  let isDuplicate = req.body.isDuplicate;
  let deleteFileName = req.body.deleteFileName;

  isDuplicate.forEach((each, index) => {
    // 기간 중복 있을 시, S3 및 DB 파일 삭제
    if (each === '1') {
      let path = `${stock_code}/1. Earnings Release/${deleteFileName[index]}`;
      let isDelete = deleteIRS3(path);
      if (isDelete) {
        let deleteSql = `DELETE FROM ir_quarter_earning WHERE stock_code = "${stock_code}" && bsns_year = "${bsns_year[index]}" && quarter_id = "${quarter_id[index]}"`;

        connection.query(deleteSql, function(err, rows, fields){
          if (err){
            console.log(err);
          } else {
            // db 추가
            let insertSql=`INSERT INTO ir_quarter_earning(bsns_year, quarter_id, file_name, stock_code, created_at, updated_at)
              VALUES("${bsns_year[index]}", "${quarter_id[index]}", "${file_name[index]}", "${stock_code}", NOW(), NOW())`;

            connection.query(insertSql, function(err, result, fields){
              if(err){
                console.log(err);
                res.status(500).send('Interner Server Error')
              }
            })
          }
        });
      }
    } else {
      // 중복 없을 시 바로 db 추가
      let insertSql=`INSERT INTO ir_quarter_earning(bsns_year, quarter_id, file_name, stock_code, created_at, updated_at)
        VALUES("${bsns_year[index]}", "${quarter_id[index]}", "${file_name[index]}", "${stock_code}", NOW(), NOW())`;

      connection.query(insertSql, function(err, result, fields){
        if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
        }
      })
    }
    
    if (index === isDuplicate.length - 1) {
      updateCommitStockCode(stock_code, 'IR');
      return res.json("추가 성공");
    }
  })
})


// 검색 기업 - delete (실적)
router.post('/delete/earning/select', function(req, res){
  let corp_code = req.body.corp_code;
  let stock_code = req.body.stock_code;
  let ir_quarter_earning_id = req.body.id;
  let file_name = req.body.file_name;
  // console.log(corp_code, stock_code, ir_quarter_earning_id, file_name);

  let path = `${stock_code}/1. Earnings Release/${file_name}`;
  // console.log(path);

  let isDelete = deleteIRS3(path);

  if (isDelete) {
    let sql = `DELETE FROM ir_quarter_earning WHERE id = ${ir_quarter_earning_id}`;

    connection.query(sql, function(err, rows, fields){
      if (err){
        console.log(err);
      } else {
        res.send('메모 삭제 완료');
      }
    });
  } 
  // last commit 업데이트
  updateCommit(corp_code, 'IR');
})

// 검색 기업 - delete All (실적)
router.post('/delete/earning/all', function(req, res){
  // console.log(req.body);

  // s3 폴더 개념x 일일히 삭제
  req.body.map(function(each, index){
    let path = `${each.stock_code}/1. Earnings Release/${each.file_name}`;
    // console.log(path);
    let isDelete = deleteIRS3(path);

    if (isDelete) {
      let sql = `DELETE FROM ir_quarter_earning WHERE id = "${each.id}"`;
  
      connection.query(sql, function(err, rows, fields){
        if (err){
          console.log(err);
        }
      });
    }
    if (index === req.body.length-1) {
      res.send('실적발표 자료 삭제 완료');
      // last commit 업데이트
      updateCommit(each.corp_code, 'IR');
    }

    return null
  });
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

// 검색 기업 - getData (프리젠테이션 목록 - deleteModal, addEditModal)
router.get('/getData/search/presentationList/:searchStockCode', function(req,res){
  let searchStockCode = req.params.searchStockCode;

  let sql = `SELECT b.corp_name, b.corp_code, b.stock_code, a.id, published_date, conference_name, title, file_name FROM ir_presentation a
    LEFT JOIN CompanyInfo b On a.stock_code = b.stock_code
    WHERE a.stock_code = ${searchStockCode}
    ORDER BY published_date DESC;`;
	
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

  let corp_code = req.body.corp_code;
  // console.log(id, published_date, conference_name, title, corp_code);

  var sql = `UPDATE ir_presentation SET published_date=?, conference_name=?, title=?, updated_at=NOW() WHERE id = ?`;
  connection.query(sql, [published_date, conference_name, title, id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })

  // last commit 업데이트
  updateCommit(corp_code, 'IR');
})


// 검색 기업 - add (프리젠테이션 - 파일, 날짜, 행사명, 제목)
router.post('/add/presentation', uploadIRS3.single('file'), (req, res) => {

  let published_date = req.body.published_date;
  let conference_name = req.body.conference_name;
  let title = req.body.title;
  let stock_code = req.body.stock_code;
  let isDuplicate = req.body.isDuplicate;
  let deleteFileName = req.body.deleteFileName;
  let sql = '';

  if (isDuplicate !== 0) {
    let path = `${stock_code}/3. IR Presentation/${deleteFileName}`;
    let isDelete = deleteIRS3(path);
    if (isDelete) {
      sql = `DELETE FROM ir_presentation WHERE id = "${isDuplicate}"`;
  
      connection.query(sql, function(err, rows, fields){
        if (err){
          console.log(err);
        } else {
          // db 추가
          sql=`INSERT INTO ir_presentation(published_date, conference_name, title, file_name, stock_code, created_at, updated_at)
          VALUES("${published_date}", "${conference_name}", "${title}", "${req.file.originalname}", "${stock_code}", NOW(), NOW())`;

          connection.query(sql, function(err, result, fields){
            if(err){
              console.log(err);
              res.status(500).send('Interner Server Error')
            } else {
              updateCommitStockCode(stock_code, 'IR');
              return res.json("추가 성공");
            }
          })
        }
      });
    }
  } else {
    // 중복 없을 시 바로 db 추가
    sql=`INSERT INTO ir_presentation(published_date, conference_name, title, file_name, stock_code, created_at, updated_at)
    VALUES("${published_date}", "${conference_name}", "${title}", "${req.file.originalname}", "${stock_code}", NOW(), NOW())`;

    connection.query(sql, function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Interner Server Error')
      } else {
        updateCommitStockCode(stock_code, 'IR');
        return res.json("추가 성공");
      }
    })
  }
})


// 검색 기업 - add 다중 (프리젠테이션 - 파일, 날짜, 행사명, 제목)
router.post('/add/multiple/presentation', uploadIRS3.array('files'), (req, res) => {
  let stock_code = req.body.stock_code;

  let published_date = req.body.published_date;
  let conference_name = req.body.conference_name;
  let title = req.body.title;
  let file_name = req.body.file_name;
  let isDuplicate = req.body.isDuplicate;
  let deleteFileName = req.body.deleteFileName;

  isDuplicate.forEach((each, index) => {
    // 기간 중복 있을 시, S3 및 DB 파일 삭제
    if (each === '1') {
      let path = `${stock_code}/3. IR Presentation/${deleteFileName[index]}`;
      let isDelete = deleteIRS3(path);
      if (isDelete) {
        let deleteSql = `DELETE FROM ir_presentation WHERE stock_code = "${stock_code}" && file_name = "${deleteFileName[index]}"`;

        connection.query(deleteSql, function(err, rows, fields){
          if (err){
            console.log(err);
          } else {
            // db 추가
            let insertSql=`INSERT INTO ir_presentation(published_date, conference_name, title, file_name, stock_code, created_at, updated_at)
              VALUES("${published_date[index]}", "${conference_name[index]}", "${title[index]}", "${file_name[index]}", "${stock_code}", NOW(), NOW())`;

            connection.query(insertSql, function(err, result, fields){
              if(err){
                console.log(err);
                res.status(500).send('Interner Server Error')
              }
            })
          }
        });
      }
    } else {
      // 중복 없을 시 바로 db 추가
      let insertSql=`INSERT INTO ir_presentation(published_date, conference_name, title, file_name, stock_code, created_at, updated_at)
        VALUES("${published_date[index]}", "${conference_name[index]}", "${title[index]}", "${file_name[index]}", "${stock_code}", NOW(), NOW())`;

      connection.query(insertSql, function(err, result, fields){
        if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
        }
      })
    }
    
    if (index === isDuplicate.length - 1) {
      updateCommitStockCode(stock_code, 'IR');
      return res.json("추가 성공");
    }
  })
})


// 검색 기업 - delete selected (프레젠테이션)
router.post('/delete/presentation/select', function(req, res){
  let corp_code = req.body.corp_code;
  let stock_code = req.body.stock_code;
  let ir_presentation = req.body.id;
  let file_name = req.body.file_name;
  // console.log(corp_code, stock_code, ir_presentation, file_name);

  let path = `${stock_code}/3. IR Presentation/${file_name}`;
  // console.log(path);

  let isDelete = deleteIRS3(path);

  if (isDelete) {
    let sql = `DELETE FROM ir_presentation WHERE id = "${ir_presentation}"`;

    connection.query(sql, function(err, rows, fields){
      if (err){
        console.log(err);
      } else {
        res.send('프레젠테이션 자료 삭제 완료');
      }
    });
  } 
  // last commit 업데이트
  updateCommit(corp_code, 'IR');
})


// 검색 기업 - delete All (프레젠테이션)
router.post('/delete/presentation/all', function(req, res){
  // console.log(req.body);

  // s3 폴더 개념x 일일히 삭제
  req.body.map(function(each, index){
    let path = `${each.stock_code}/3. IR Presentation/${each.file_name}`;
    // console.log(path);
    let isDelete = deleteIRS3(path);

    if (isDelete) {
      let sql = `DELETE FROM ir_presentation WHERE id = "${each.id}"`;
  
      connection.query(sql, function(err, rows, fields){
        if (err){
          console.log(err);
        }
      });
    }
    if (index === req.body.length-1) {
      res.send('프레젠테이션 자료 삭제 완료');
      // last commit 업데이트
      updateCommit(each.corp_code, 'IR');
    }

    return null
  });

})

export default router;
