import connection from './database.js';

// ㅇ 공통
/** 내림차순/오름차순 타입을 반환 */
function sortTypeReturn (sortType) {
  if (sortType === "▲") {
    sortType = 'ASC';
  } else {
    sortType = 'DESC';
  }
  return sortType;
}

/** 2015년부터 현재년도까지 년도를 반환하는 함수 */
const periodYearArrayAuto = () => {
  const thisYear = new Date().getFullYear() - 2000;
  const yearArr = [];
  for (let year = 15; year <= thisYear; year += 1) {
    yearArr.push(year);
  }
  return yearArr;
};

/** company_last_commit을 업데이트하는 함수 */
const updateCommit = (searchCompanyCode, type) => {

  let updateSql = `SELECT COUNT(*) as commit FROM company_last_commit WHERE corp_code='${searchCompanyCode}' && commit_type='${type}'`;
  connection.query(updateSql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      if (rows[0].commit === 0){
        updateSql = `INSERT INTO company_last_commit(corp_code, commit_type, last_commit_date, created_at, updated_at)
          VALUES('${searchCompanyCode}', '${type}', NOW(), NOW(), NOW())`;
      } else {
        updateSql = `UPDATE company_last_commit SET last_commit_date = NOW() WHERE corp_code='${searchCompanyCode}' && commit_type='${type}'`;
      }
      connection.query(updateSql, function(err, rows, fields){
        if (err){
          console.log(err);
        } 
      })
    }
  })
};

/** company_last_commit을 업데이트하는 함수. corp_code 모를 시 */
const updateCommitStockCode = (stock_code, type) => {
  let sql = `SELECT corp_code FROM CompanyInfo WHERE stock_code = "${stock_code}"`
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      let searchCompanyCode = rows[0].corp_code;

      let updateSql = `SELECT COUNT(*) as commit FROM company_last_commit WHERE corp_code='${searchCompanyCode}' && commit_type='${type}'`;
      connection.query(updateSql, function(err, rows, fields){
        if (err){
          console.log(err);
        } else {
          if (rows[0].commit === 0){
            updateSql = `INSERT INTO company_last_commit(corp_code, commit_type, last_commit_date, created_at, updated_at)
              VALUES('${searchCompanyCode}', '${type}', NOW(), NOW(), NOW())`;
          } else {
            updateSql = `UPDATE company_last_commit SET last_commit_date = NOW() WHERE corp_code='${searchCompanyCode}' && commit_type='${type}'`;
          }
          connection.query(updateSql, function(err, rows, fields){
            if (err){
              console.log(err);
            } 
          })
        }
      })
    }
  })
};

// ㅇ 개별
/** (companyList) 검색 타입에 따라 필드명을 반환 */
function companyListSortField (input) {
  let result;
  // console.log(input);

  if (input === "기업명") {
    result = 'corp_name';
  } else if (input === "주식코드") {
    result = 'stock_code';
  } else if (input === "기업코드") {
    result = 'corp_code';
  } else if (input === "시장") {
    result = 'market_code';
  } else if (input === "업종1") {
    result = 'induty1';
  } else if (input === "업종2") {
    result = 'induty2';
  } else if (input === "업종3") {
    result = 'induty3';
  } else if (input === "IR주소") {
    result = 'ir_url';
  } else if (input === "결산월") {
    result = 'Acc_mt';
  } else if (input === "키워드") {
    result = 'keyword';
  } else {
    result = 'fs_div';
  }
  return result;
}

/** (irList) 검색 타입에 따라 필드명을 반환 */
function irListSortField (input) {
  let result;
  // console.log(input);

  if (input === "기업명") {
    result = 'corp_name';
  } else if (input === "주식코드") {
    result = 'stock_code';
  } else if (input === "최근 작업일") {
    result = 'recent';
  } else if (input === "분기실적") {
    result = 'earning';
  } else if (input === "프레젠테이션") {
    result = 'presentation';
  } else {
    result = 'ir_url';
  } 
  return result;
}


/** (sectorList) 검색 타입에 따라 필드명을 반환 */
function sectorListSortField (input) {
  let result;
  // console.log(input);

  if (input === "기업명") {
    result = 'corp_name';
  } else if (input === "주식코드") {
    result = 'stock_code';
  } else if (input === "최근 작업일") {
    result = 'recent';
  } else if (input === "최근파일") {
    result = 'segment_last_updated';
  } else if (input === "정보1") {
    result = 'segment_title1';
  } else if (input === "정보2") {
    result = 'segment_title2';
  } else if (input === "소스") {
    result = 'segment_source';
  } else if (input === "통화") {
    result = 'currency';
  } else if (input === "단위") {
    result = 'unit';
  } else {
    result = 'is_available';
  } 
  return result;
}

export { 
  sortTypeReturn,
  companyListSortField,
  irListSortField,
  sectorListSortField,
  periodYearArrayAuto,
  updateCommit,
  updateCommitStockCode,
}
