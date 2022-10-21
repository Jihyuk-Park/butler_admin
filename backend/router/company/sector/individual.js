import express from 'express';
const router = express.Router();
import connection from '../../../module/database.js';
import { periodYearArrayAuto, updateCommit } from '../../../module/companyFunction.js'

// ㅇ 정보
// 검색 기업 - getData (정보 - 기업정보)
router.get('/info/company/getData/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let sql = `SELECT c.id as analysis_id, a.corp_name, segment_last_updated, segment_title1, segment_title2, segment_source, currency, unit, IF(is_available = 1, 'O', 'X') as is_available FROM CompanyInfo a 
    LEFT JOIN company_last_commit b on a.corp_code = b.corp_code
    LEFT JOIN analysis_company_info c on a.corp_code = c.corp_code
    WHERE a.corp_code = ${searchCompanyCode};`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - edit (정보 - 기업정보)
router.post('/info/company/edit', function(req, res){
  let analysis_id = req.body.analysis_id;
  let segment_title1 = req.body.segment_title1;
  let segment_title2 = req.body.segment_title2;
  let segment_source = req.body.segment_source;
  let currency = req.body.currency;
  let unit = req.body.unit;
  let is_available = req.body.is_available === 'O' ? 1 : 0;

  console.log(analysis_id, segment_title1, segment_title2, segment_source, currency, unit, is_available);

  let sql = `UPDATE analysis_company_info SET segment_title1 = ?, segment_title2 = ?, segment_source = ?, currency = ?,
  unit = ?, is_available = ? WHERE id = ?`;

  connection.query(sql, [segment_title1, segment_title2, segment_source, currency, unit, is_available, analysis_id], function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
          return res.json("수정 성공");
      }
  })
})


// 검색 기업 - getData (정보 - 부문별 정보)
router.get('/info/sector/getData/:searchCorpCode', function(req,res){
  const searchCorpCode = req.params.searchCorpCode;

  let sql = `SELECT a.id, depth1, depth2, depth3, IF(is_importance = 1, 'O', 'X') as is_importance, a.description, a.analysis_company_info_id FROM analysis_part_info a
    LEFT JOIN analysis_company_info b on a.analysis_company_info_id = b.id
    WHERE a.corp_code = ${searchCorpCode} && part_type = "SEGMENT"
    ORDER BY a.id ASC;`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// 검색 기업 - add (정보 - 부문별 정보)
router.post('/info/sector/add', function(req, res){
  let depth1 = req.body.depth1;
  let depth2 = req.body.depth2;
  let depth3 = req.body.depth3;
  let is_importance = req.body.is_importance === 'O' ? 1 : 0;
  let description = req.body.description;
  let analysis_company_info_id = req.body.analysis_company_info_id;
  let corp_code = req.body.corp_code;
  let isDepthDuplicate = req.body.isDepthDuplicate;
  let depth;

  // console.log(isDepthDuplicate);

  if (depth3 !== ''){
    depth = 3;
  } else if (depth3 === '' && depth2 !== ''){
    depth = 2;
  } else {
    depth = 1;
  }

  // console.log(depth1, depth2, depth3, is_importance, description, depth, analysis_company_info_id, corp_code);

  // 중복된 depth 제외하고 추가
  for (let i = isDepthDuplicate + 1; i <= depth; i += 1){
    let tempDepth2 = i>= 2 ? depth2 : '';
    let tempDepth3 = i>= 3 ? depth3 : '';
    let sql = `INSERT INTO analysis_part_info(depth1, depth2, depth3, corp_code, part_type, is_importance, description, depth_level, created_at, updated_at, analysis_company_info_id)
      VALUES('${depth1}', '${tempDepth2}', '${tempDepth3}', ${corp_code}, 'SEGMENT' ,'${is_importance}', '${description}', '${i}', NOW(), NOW(), '${analysis_company_info_id}')`;

    connection.query(sql, function(err, result, fields){
      if(err){
          console.log(err);
          res.status(500).send('Interner Server Error')
      } else {
        if (i === depth) {
          updateCommit(corp_code, 'ANALYSIS');
          return res.json("수정 성공");
        }
      }
    })
  }
})

// 검색 기업 - edit (정보 - 부문별 정보)
router.post('/info/sector/edit', function(req, res){
  let id = req.body.id;
  let depth1 = req.body.depth1;
  let depth2 = req.body.depth2;
  let depth3 = req.body.depth3;
  let is_importance = req.body.is_importance === 'O' ? 1 : 0;
  let description = req.body.description;
  let analysis_company_info_id = req.body.analysis_company_info_id
  let corp_code = req.body.corp_code;

  // 변경사항이 없으면 ''
  let depth1Original = req.body.depth1Original;
  let depth2Original = req.body.depth2Original;
  let depth3Original = req.body.depth3Original;
  let depthChangeArray = [
    [depth1Original, 'depth1', depth1],
    [depth2Original, 'depth2', depth2],
    [depth3Original, 'depth3', depth3],
  ];

  // console.log(id, depth1, depth2, depth3, is_importance, description, analysis_company_info_id, corp_code);

  // depth 외에 수정
  if (depth1Original === '' && depth2Original === '' && depth3Original === '') {
    let sql = `UPDATE analysis_part_info SET is_importance = '${is_importance}', description = '${description}'
      WHERE id='${id}';`

    connection.query(sql, function(err, rows, fields){
      if (err){
        console.log(err);
      } else {
        res.send('데이터 수정 완료');
      }
    })

    // depth 수정
  } else {
    depthChangeArray.map(function(arr, index) {
      let changeSQL = '';
      // depth2가 바뀌었을 경우, depth1&depth2 모두 일치하는 것들을 바꾸는.
      if (index === 1) {
        changeSQL = `&& depth1 = '${depth1}'`;
      } 
  
      if (arr[0] !== '') {
        let sql = `UPDATE analysis_part_info SET ${arr[1]} = '${arr[2]}', is_importance = '${is_importance}', description = '${description}'
          WHERE analysis_company_info_id='${analysis_company_info_id}' && part_type="SEGMENT" && ${arr[1]} = '${arr[0]}' ${changeSQL}`;
  
        connection.query(sql, function(err, result, fields){
          if(err){
              console.log(err);
              res.status(500).send('Interner Server Error')
          } 
        })
      }
  
      if (index === 2){
        updateCommit(corp_code, 'ANALYSIS');
        return res.json("수정 성공");
      }
    });
  }
})

// 검색 기업 - delete (정보 - 부문별 정보)
router.post('/info/sector/delete/:id/:searchCompanyCode', function(req,res){
  let id = req.params.id;
  let searchCompanyCode = req.params.searchCompanyCode;

  let sql = `DELETE FROM segment_analysis WHERE analysis_part_info_id = ${id}`;
	
  // segment_analysis 먼저 삭제 후 analysis_part_info 삭제 (foreign key)
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      sql = `DELETE FROM analysis_part_info WHERE id = ${id};`;
      connection.query(sql, id, function(err, rows, fields){
        if (err){
          console.log(err);
        } else {
          res.send('데이터 삭제 완료');
        }
      })
    }
  })

  // last commit 업데이트
  updateCommit(searchCompanyCode, 'ANALYSIS');
});


// ㅇ 실적
// 검색 기업 - getData (매출액)
router.get('/performance/sales/getData/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let periodArray = periodYearArrayAuto();
  let pivotSQL = '';
  let pivotSumSQL = '';

  // 개별 항목
  periodArray.map(function (year) {
    for (let quarter = 1; quarter <= 4; quarter += 1){
      pivotSQL += `GROUP_CONCAT(if(bsns_year = 20${year} && quarter = ${quarter}, value, null)) AS 'Q${quarter}${year}',\n`
    }
  });
  // 마지막 줄 엔터 및 콤마 제거
  pivotSQL = pivotSQL.slice(0, -2);
  // console.log(pivotSQL);

  // 합계
  periodArray.map(function (year) {
    for (let quarter = 1; quarter <= 4; quarter += 1){
      pivotSumSQL += `SUM(if(bsns_year = 20${year} && quarter = ${quarter}, value, null)) AS 'Q${quarter}${year}',\n`
    }
  });
  // 마지막 줄 엔터 및 콤마 제거
  pivotSumSQL = pivotSumSQL.slice(0, -2);
  // console.log(pivotSQL);
  
  
  let sql = `SELECT a.id, depth1, depth2, depth3,
    ${pivotSQL}
    FROM analysis_part_info a
    LEFT JOIN segment_analysis b on a.id = b.analysis_part_info_id
    WHERE a.corp_code = ${searchCompanyCode} && part_type = "SEGMENT" && title = "매출액"
    GROUP by a.id

    UNION

    SELECT "sum" as id, depth1, depth2, depth3,
    ${pivotSumSQL}
    FROM analysis_part_info a
    LEFT JOIN segment_analysis b on a.id = b.analysis_part_info_id
    WHERE a.corp_code = ${searchCompanyCode} && part_type = "SEGMENT" && title = "매출액" && depth2 = "" && depth3 = "";`;
	
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});


// 검색 기업 - edit (실적 - 매출액)
router.post('/performance/sales/edit/:searchCorpCode/:year/:quarter/:unit', function(req, res){
  let searchCorpCode = req.params.searchCorpCode;
  let bsns_year = req.params.year;
  let quarter= req.params.quarter;
  let unit = req.params.unit;
  
  let editArray = req.body;

  // console.log(searchCorpCode, bsns_year, quarter, unit);
  // console.log(editArray);

  editArray.map(function(each, index) {
    let sql = '';
    if (each.isNeed === 1) {
      if (each.type === 'add') {
        sql = `INSERT INTO segment_analysis(corp_code, title_order, title, bsns_year, quarter, value, analysis_part_info_id, created_at, updated_at)
          VALUES("${searchCorpCode}", "1", "매출액", "${bsns_year}", "${quarter}", ${each.value * unit}, "${each.id}", NOW(), NOW())`;
      } else {
        // 입력값 모두 지운('') 경우는 null로 표시하기 위해 DELETE  (table 구조 value => NOT NULL)
        if (each.value === '') {
          sql = `DELETE FROM segment_analysis
            WHERE analysis_part_info_id="${each.id}" && title="매출액" && bsns_year = "${bsns_year}" && quarter = "${quarter}"`;
        } else {
          sql = `UPDATE segment_analysis SET value = ${each.value * unit}, updated_at = NOW()
            WHERE analysis_part_info_id="${each.id}" && title="매출액" && bsns_year = "${bsns_year}" && quarter = "${quarter}"`;
        }
      }

      connection.query(sql, function(err, rows, fields){
        if (err){
          console.log(err);
        }
      })  
    }

    if (index === editArray.length - 1){
      updateCommit(searchCorpCode, 'ANALYSIS');
      return res.json("수정 성공");
    }

    return null
  })
})

export default router;
