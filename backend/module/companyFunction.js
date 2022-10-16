/** 내림차순/오름차순 타입을 반환 */
function sortTypeReturn (sortType) {
  if (sortType === "▲") {
    sortType = 'ASC';
  } else {
    sortType = 'DESC';
  }
  return sortType;
}

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

/** 2015년부터 현재년도까지 년도를 반환하는 함수 */
const periodYearArrayAuto = () => {
  const thisYear = new Date().getFullYear() - 2000;
  const yearArr = [];
  for (let year = 15; year <= thisYear; year += 1) {
    yearArr.push(year);
  }
  return yearArr;
};

export { 
  sortTypeReturn,
  companyListSortField,
  periodYearArrayAuto,
}
