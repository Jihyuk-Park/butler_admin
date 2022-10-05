/** 내림차순/오름차순 타입을 반환 */
function sortTypeReturn (sortType) {
  if (sortType === "내림차순") {
    sortType = 'DESC';
  } else {
    sortType = 'ASC';
  }
  return sortType;
}

/** (companyList) 검색 타입에 따라 필드명을 반환 */
function companyListSortField (input) {
  let result;

  if (input === "기업명") {
    result = 'corp_name';
  } else if (input === "종목코드") {
    result = 'corp_code';
  } else if (input === "Corpcode") {
    result = 'corp_code';
  } else if (input === "시장") {
    result = 'market_code';
  } else if (input === "업종1") {
    result = 'corp_code';
  } else if (input === "업종2") {
    result = 'corp_code';
  } else {
    result = 'corp_code';
  }

  return result;
}

export { 
  sortTypeReturn,
  companyListSortField,
}
