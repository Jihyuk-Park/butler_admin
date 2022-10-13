import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';

// getData
router.get('/getData/all/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  
  let sql = `SELECT if(stock_knd = "", se, concat(stock_knd,' ',se)) as name,
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q115', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q215',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q315',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q415',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q116', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q216',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q316',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q416',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q117', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q217',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q317',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q417',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q118', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q218',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q318',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q418',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q119', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q219',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q319',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q419',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 1, thstrm, null)) AS 'Q119', 
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 2, thstrm, null)) AS 'Q219',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 3, thstrm, null)) AS 'Q319',
    GROUP_CONCAT(if(bsns_year = 2019 && quarter_id = 4, thstrm, null)) AS 'Q419',
    GROUP_CONCAT(if(bsns_year = 2020 && quarter_id = 1, thstrm, null)) AS 'Q120', 
    GROUP_CONCAT(if(bsns_year = 2020 && quarter_id = 2, thstrm, null)) AS 'Q220',
    GROUP_CONCAT(if(bsns_year = 2020 && quarter_id = 3, thstrm, null)) AS 'Q320',
    GROUP_CONCAT(if(bsns_year = 2020 && quarter_id = 4, thstrm, null)) AS 'Q420',
    GROUP_CONCAT(if(bsns_year = 2021 && quarter_id = 1, thstrm, null)) AS 'Q121', 
    GROUP_CONCAT(if(bsns_year = 2021 && quarter_id = 2, thstrm, null)) AS 'Q221',
    GROUP_CONCAT(if(bsns_year = 2021 && quarter_id = 3, thstrm, null)) AS 'Q321',
    GROUP_CONCAT(if(bsns_year = 2021 && quarter_id = 4, thstrm, null)) AS 'Q421',
    GROUP_CONCAT(if(bsns_year = 2022 && quarter_id = 1, thstrm, null)) AS 'Q122', 
    GROUP_CONCAT(if(bsns_year = 2022 && quarter_id = 2, thstrm, null)) AS 'Q222',
    GROUP_CONCAT(if(bsns_year = 2022 && quarter_id = 3, thstrm, null)) AS 'Q322',
    GROUP_CONCAT(if(bsns_year = 2022 && quarter_id = 4, thstrm, null)) AS 'Q422'  
  FROM Dividend a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode}
  GROUP BY name;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// 데이터가 있는 기간 목록 로드
router.get('/getPeriodList/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let sql = `SELECT bsns_year, quarter_id
  FROM Dividend a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode}
  GROUP BY bsns_year, quarter_id
  ORDER BY bsns_year ASC, quarter_id ASC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// 기간에 따른 데이터 로드
router.get('/getData/period/:searchCompanyCode/:year/:quarter', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let year = req.params.year;
  let quarter = req.params.quarter;

  let sql = `SELECT if(stock_knd = "", se, concat(stock_knd,' ',se)) as name,
  GROUP_CONCAT(if(bsns_year = ${year} && quarter_id = ${quarter}, thstrm, null)) AS 'value'
  FROM Dividend a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode} && bsns_year = ${year} && quarter_id = ${quarter}
  GROUP BY name;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      // console.log(rows);
      res.send(rows);
    }
  })
});

// editData
router.post('/editData/period/:searchCompanyCode/:year/:quarter', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;
  let year = req.params.year;
  let quarter = req.params.quarter;

  let sqlArray = req.body;

  let sql = `SELECT rcept_no, report_id
  FROM Dividend a
  LEFT JOIN StoredReport b ON a.report_id = b.id
  WHERE corp_code = ${searchCompanyCode} && bsns_year = ${year} && quarter_id = ${quarter}
  GROUP BY rcept_no, report_id;`;

  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      let sqlCount = 0;
      let sucess = 0;
      let rcept_no = rows[0].rcept_no;
      let report_id = rows[0].report_id;

      sqlArray.map(function (each){
        // console.log(each);
        let stock_knd ='';
        if (each.name.includes('보통주')){
          stock_knd='보통주';
          each.name=each.name.replace('보통주 ', '');
        } else if (each.name.includes('우량주')){
          stock_knd='우량주';
          each.name=each.name.replace('우량주 ', '');
        }
        // console.log(each);
    
        if (each.type === 'INSERT') {
          // console.log('INSERT');
          sql = `INSERT INTO Dividend (rcept_no, se, stock_knd, thstrm, created_at, updated_at, report_id)
            VALUES(${rcept_no}, "${each.name}", "${stock_knd}", "${each.value}", NOW(), NOW(), ${report_id});`;
        } else {
          // console.log('UPDATE');
          sql = `UPDATE Dividend SET thstrm = "${each.value}", updated_at = NOW() WHERE report_id = ${report_id} && se = "${each.name}";`;
        }

        connection.query(sql, function(err, rows, fields){
          sqlCount += 1;
          if (err){
            console.log(sql);
            console.log(err);
          } else {
            sucess += 1;
          }

          if (sqlCount === sqlArray.length){
            if (sucess === sqlArray.length){
              return res.json("수정 완료!");
            } else {
              return res.json(`Error : 총 ${sqlArray.length}개 수정, ${sucess}개 성공`)
            }
          }
        })
      });
    }
  })
});

export default router;
