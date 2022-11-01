import connection from './database.js';
import {
  statementOfFinancialArray,
  incomeStatementArray,
  comprehensiveIncomeStatementArray,
  cashflowStatementArray
} from './constVariable.js';

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

  // company_last_commit 에 값이 있는지 조회 후 INSERT OR UPDATE
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
  // corp_code 알기 어려울 시, stock_code를 통해 corp_code 획득 후 commit
  let sql = `SELECT corp_code FROM CompanyInfo WHERE stock_code = "${stock_code}"`
  connection.query(sql, function(err, rows, fields){
    if (err){
      console.log(err);
    } else {
      let searchCompanyCode = rows[0].corp_code;

      // company_last_commit 에 값이 있는지 조회 후 INSERT OR UPDATE
      updateCommit(searchCompanyCode, type);
    }
  })
};

/** S3 데이터 중 필요한 데이터만 필터링하는 함수
 * 계정 목록, S3 데이터(분기, 연간 등), 데이터 항목( ex)minorShareHolder, buyback, dividend 등)을 input으로 */
const filterS3Data = (accountArray, S3Data, whichField) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  // filteredData에 한 줄씩 데이터 삽입 {field : 계정명(최종거래일, 수정주가 등), Q115: value, Q215, ..., Q322: value, Q422: value}
  accountArray.map(function(each){
    let tempObj = { ...each };

    yearArray.map(function(year){
      for (let quarter = 1; quarter <=4; quarter += 1){
        let tempData = S3Data.filter(
          data => parseInt(data.bsns_year, 10) === year + 2000
          && data.quarter_id === quarter
          && data[whichField] !== null
        );

        // 해당 년, 분기의 자료가 없으면 null 값
        if (tempData.length === 0){
          tempObj[`Q${quarter}${year}`] = null;
          // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
        } else {
          tempObj[`Q${quarter}${year}`] = tempData[0][whichField][each.type] || null;
        }
      }
    })
    filteredData.push(tempObj);
    return null;
  });

  return filteredData
};


/** S3 데이터 중 필요한 데이터만 필터링하는 함수. 
  * 그 중 뎁스가3인 데이터를 필터링 ex) BuyBack (1depth - 우선주, 보통주 / 2depth - 직접 취득, 신탁계약, 기타, 합계 / 3depth - 기초, 변동, 기말) */
 const filterS3Depth3 = (accountArray, S3Data, whichField, firstDepth) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  accountArray.map(function(secondDepth){
    secondDepth[1].map(function(each){

      // 2 & 3depth를 필드명으로 ex) Buyback - 직접취득 기초, 직접취득 변동, ..., 합계 기말 등
      let tempObj = {field: `${secondDepth[0][0]} ${each.type_nm}`};

      yearArray.map(function(year){
        for (let quarter = 1; quarter <=4; quarter += 1){
          let tempData = S3Data.filter(
            data => parseInt(data.bsns_year, 10) === year + 2000
            && data.quarter_id === quarter
            && data[whichField] !== null
          );
          // 해당 년, 분기의 자료가 없으면 null 값
          if (tempData.length === 0){
            tempObj[`Q${quarter}${year}`] = null;
            // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
          } else {
            // console.log(secondDepth[0][1], each.type);
            // console.log(tempData[0][whichField][firstDepth]);
            // ex) buyback - 필터링데이터.buyback. common || prefered. 직접 || 신탁 || 기타 || 합계 . 기초 || 변동 || 기말 || etc
            tempObj[`Q${quarter}${year}`] = tempData[0][whichField][firstDepth][secondDepth[0][1]][each.type] || null;
          }
        }
      })
      // console.log(tempObj);
      filteredData.push(tempObj);
      return null
    })
    return null;
  });

  // console.log(filteredData);

  return filteredData
};


/** Dividend를 위한 함수. EPS, FCFPS, 배당성향 등 다른 필드와의 연산을 포함한 함수
 * filterS3Data의 확장 */
 const filterS3DataDividend = (accountArray, S3Data, whichField) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  // filteredData에 한 줄씩 데이터 삽입 {field : 계정명(최종거래일, 수정주가 등), Q115: value, Q215, ..., Q322: value, Q422: value}
  accountArray.map(function(each){
    let tempObj = { ...each };

    yearArray.map(function(year){
      for (let quarter = 1; quarter <=4; quarter += 1){
        let tempData = S3Data.filter(
          data => parseInt(data.bsns_year, 10) === year + 2000
          && data.quarter_id === quarter
          && data[whichField] !== null
        );

        // 해당 년, 분기의 자료가 없으면 null 값
        if (tempData.length === 0){
          tempObj[`Q${quarter}${year}`] = null;
          // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
        } else {
          if (each.type === 'eps') {
            let data1 = tempData[0].fs.is && tempData[0].fs.is.is_net_income || null;
            let data2 = tempData[0].stock.totalStockCount || null;

            // console.log('당기순이익 : ', data1, '주식 수 : ', data2);
            tempObj[`Q${quarter}${year}`] = data1 && (data1 / data2).toFixed(0) || null;
          } else if (each.type === 'dividendRatio') {
            let data1 = tempData[0].dividend.fixCommonCashDividend || null;
            let data2 = tempData[0].fs.is && tempData[0].fs.is.is_net_income || null;
            let data3 = tempData[0].stock.totalStockCount || null;

            tempObj[`Q${quarter}${year}`] = data1 / data2 * data3;
          } else if (each.type === 'fcfps') {
            let data1 = tempData[0].fs.cf && tempData[0].fs.cf.cf_free_cash_flows || null;
            let data2 = tempData[0].stock.totalStockCount || null;

            tempObj[`Q${quarter}${year}`] = data1 && (data1 / data2).toFixed(0) || null;
          } else if (each.type === 'dividendRatio_fcfps') {
            let data1 = tempData[0].dividend.fixCommonCashDividend || null;
            let data2 = tempData[0].fs.is && tempData[0].fs.cf.cf_free_cash_flows || null;
            let data3 = tempData[0].stock.totalStockCount || null;

            tempObj[`Q${quarter}${year}`] = data1 / data2 * data3;
          } else {
            tempObj[`Q${quarter}${year}`] = tempData[0][whichField][each.type] || null;
          }
        }
      }
    })
    filteredData.push(tempObj);
    return null;
  });

  return filteredData
};


/** Employee를 위한 함수. 매출액 대비 급여비율, 영업이익대비 급여비율 등 다른 필드와의 연산을 포함한 함수
 * filterS3Data의 확장 */
 const filterS3Employee = (accountArray, S3Data, whichField) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  accountArray.map(function(firstDepth){
    firstDepth[1].map(function(secondDepth){

      let tempObj = {field: `${firstDepth[0][0]} ${secondDepth.type_nm}`};

      yearArray.map(function(year){
        for (let quarter = 1; quarter <=4; quarter += 1){
          let tempData = S3Data.filter(
            data => parseInt(data.bsns_year, 10) === year + 2000
            && data.quarter_id === quarter
            && data[whichField] !== null
          );
          // 해당 년, 분기의 자료가 없으면 null 값
          if (tempData.length === 0){
            tempObj[`Q${quarter}${year}`] = null;
            // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
          } else {
            if (secondDepth.type === 'salarySalesratio') {
              let data1 = tempData[0].employees.total && tempData[0].employees.total.salary || null;
              let data2 = tempData[0].fs.cf && tempData[0].fs.is.is_revenue || null;

              tempObj[`Q${quarter}${year}`] = data1 / data2;
            } else if (secondDepth.type === 'salaryProfitratio') {
              let data1 = tempData[0].employees.total && tempData[0].employees.total.salary || null;
              let data2 = tempData[0].fs.cf && tempData[0].fs.is.is_operating_profit_loss || null;
              
              tempObj[`Q${quarter}${year}`] = data1 / data2;
            } else {
            // console.log([firstDepth[0][1]], [secondDepth.type], tempData[0][whichField][firstDepth[0][1]][secondDepth.type]);
              tempObj[`Q${quarter}${year}`] = tempData[0][whichField][firstDepth[0][1]][secondDepth.type] || null;
            }
          }
        }
      })
      // console.log(tempObj);
      filteredData.push(tempObj);
      return null
    })
    return null;
  });

  // console.log(filteredData);

  return filteredData
};


/** Executive를 위한 함수. 매출액 대비, 전체 급여대비 등 다른 필드와의 연산을 포함한 함수
 * filterS3Data의 확장 */
 const filterS3DataExecutive = (accountArray, S3Data, whichField) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  // filteredData에 한 줄씩 데이터 삽입 {field : 계정명(최종거래일, 수정주가 등), Q115: value, Q215, ..., Q322: value, Q422: value}
  accountArray.map(function(each){
    let tempObj = { ...each };

    yearArray.map(function(year){
      for (let quarter = 1; quarter <=4; quarter += 1){
        let tempData = S3Data.filter(
          data => parseInt(data.bsns_year, 10) === year + 2000
          && data.quarter_id === quarter
          && data[whichField] !== null
        );

        // 해당 년, 분기의 자료가 없으면 null 값
        if (tempData.length === 0){
          tempObj[`Q${quarter}${year}`] = null;
          // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
        } else {
          if (each.type === 'salesRatio') {
            let data1 = tempData[0].executiveReward && tempData[0].executiveReward.totalSalary || null;
            let data2 = tempData[0].fs.cf && tempData[0].fs.is.is_operating_profit_loss || null;

            tempObj[`Q${quarter}${year}`] = data1 / data2;
          } else if (each.type === 'profitRatio') {
            let data1 = tempData[0].executiveReward && tempData[0].executiveReward.totalSalary || null;
            let data2 = tempData[0].fs.cf && tempData[0].fs.is.is_revenue || null;

            tempObj[`Q${quarter}${year}`] = data1 / data2;
          } else if (each.type === 'totalRatio') {
            let data1 = tempData[0].executiveReward && tempData[0].executiveReward.totalSalary || null;
            let data2 = tempData[0].employees && tempData[0].employees.total.salary || null;


            tempObj[`Q${quarter}${year}`] = data1 / data2;
          } else if (each.type === 'countRatio') {
            let data1 = tempData[0].executiveReward && tempData[0].executiveReward.executiveCount || null;
            let data2 = tempData[0].employees && tempData[0].employees.total.count || null;

            tempObj[`Q${quarter}${year}`] = data1 / data2;
          } else {
            tempObj[`Q${quarter}${year}`] = tempData[0][whichField][each.type] || null;
          }
        }
      }
    })
    filteredData.push(tempObj);
    return null;
  });

  return filteredData
};


/** Management에서 활용되는 filter함수
 * filterS3Data의 확장 (filterS3에 input 하나가 추가된 함수로, 재무제표 종류를 추가하기 위함) */
 const filterS3DataManagement = (accountArray, S3Data, whichField, financialType) => {
  const yearArray = periodYearArrayAuto();
  let filteredData = [];

  // filteredData에 한 줄씩 데이터 삽입 {field : 계정명(유동자산, 매출채권 등), Q115: value, Q215, ..., Q322: value, Q422: value}
  accountArray.map(function(each){
    let tempObj = { ...each };

    yearArray.map(function(year){
      for (let quarter = 1; quarter <=4; quarter += 1){
        let tempData = S3Data.filter(
          data => parseInt(data.bsns_year, 10) === year + 2000
          && data.quarter_id === quarter
          && data[whichField] !== null
        );

        // 해당 년, 분기의 자료가 없으면 null 값
        if (tempData.length === 0){
          tempObj[`Q${quarter}${year}`] = null;
          // 해당 년, 분기의 자료가 있으면 value or null(값이 없을 시) 값
        } else {
          tempObj[`Q${quarter}${year}`] = tempData[0][whichField][financialType][each.type] || null;
        }
      }
    })
    filteredData.push(tempObj);
    return null;
  });

  return filteredData
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

/** (dart s3) 재무제표 종류를 반환 */
function financialTypeKey (input) {
  let result;

  if (input === "재무상태표") {
    result = 'bs';
  } else if (input === "손익계산서") {
    result = 'is';
  } else {
    result = 'cf';
  } 
  return result;
}

/** (dart db) 재무제표 종류를 반환 */
function financialTypeSQL (input) {
  let result;

  if (input === "재무상태표") {
    result = 'sj_div = "BS"';
  } else if (input === "손익계산서") {
    result = 'sj_div LIKE "%IS"';
  } else {
    result = 'sj_div = "CF"';
  } 
  return result;
}

/** (dart s3) 종류에 따라 계정목록들을 반환 */
function financialTypeAccountArray (input) {
  let result;
 
  if (input === "재무상태표") {
    result = statementOfFinancialArray;
  } else if (input === "손익계산서") {
    result = comprehensiveIncomeStatementArray;
  } else {
    result = cashflowStatementArray;
  } 
  return result;
}


export { 
  periodYearArrayAuto,
  updateCommit,
  updateCommitStockCode,
  filterS3Data,
  filterS3Employee,
  filterS3Depth3,
  filterS3DataDividend,
  filterS3DataExecutive,
  filterS3DataManagement,
  sortTypeReturn,
  companyListSortField,
  irListSortField,
  sectorListSortField,
  financialTypeKey,
  financialTypeSQL,
  financialTypeAccountArray,
}
