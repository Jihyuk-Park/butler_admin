/** 내림차순/오름차순 타입을 반환 */
function sortTypeReturn (sortType) {
  if (sortType === "▲") {
    sortType = 'ASC';
  } else {
    sortType = 'DESC';
  }
  return sortType;
}

/** (userInfo) 정렬 기준(필드)을 반환 */
function userInfoSortField (sortField) {
  if (sortField === "닉네임") {
    sortField = 'a.NickName';
  } else if (sortField === "이름"){
    sortField = 'a.Name';
  } else if (sortField === "전화번호") {
    sortField = 'a.Phone';
  } else if (sortField === "이메일") {
    sortField = 'a.Email';
  } else if (sortField === "로그인 방식") {
    sortField = 'a.AuthType';
  } else if (sortField === "가입일") {
    sortField = 'a.createdAt';
  } else if (sortField === "GRADE") {
    sortField = 'b.status';
  } else if (sortField === "TYPE") {
    sortField = 'b.type';
  } else {
    sortField = 'a.id';
  }
  return sortField;
}

/** (userInfo) 검색 타입에 따라 필드명을 반환  ex) 로그인 방식 => AuthType 반환 */
function userInfoSearchType (input) {
  let result;

  if (input === "닉네임") {
    result = 'a.NickName';
  } else if (input === "로그인 방식") {
    result = 'a.AuthType';
  } else if (input === "이름") {
    result = 'a.Name';
  } else if (input === "Grade") {
    result = 'b.status';
  } else if (input === "Type") {
    result = 'b.type';
  } else {
    result = 'a.id';
  }

  return result;
}

/** (userMemo) 정렬 기준(필드)을 반환 */
function userMemoSortField (sortField) {
  if (sortField === "순번"){
    sortField = 'a.id';
  } else if (sortField === "작성일") {
    sortField = 'a.created_at';
  } else if (sortField === "갱신일") {
    sortField = 'a.updated_at';
  } else if (sortField === "기업명") {
    sortField = 'b.corp_name';
  } else if (sortField === "유저 닉네임") {
    sortField = 'c.NickName';
  } else if (sortField === "타입") {
    sortField = 'a.type';
  } else {
    sortField = 'a.memo';
  }

  return sortField;
}

/** (userUsage) 정렬 기준(필드)을 반환 */
function userUsageSortField (sortField) {
  if (sortField === "닉네임") {
    sortField = 'a.NickName';
  } else if (sortField === "가입일"){
    sortField = 'a.createdAt';
  } else if (sortField === "최근 접속일") {
    sortField = 'a.updatedAt';
  } else if (sortField === "기업 검색 횟수") {
    sortField = 'c.searchCounting';
  } else if (sortField === "관심목록 그룹 수") {
    sortField = 'g.watchCompanyCounting';
  } else if (sortField === "관심목록 기업 수 ") {
    sortField = 'd.watchGroupCounting';
  } else {
    sortField = 'b.memoCounting';
  }

  return sortField;
}

/** (userDailyCompany) 정렬 기준(필드)을 반환 */
function userDailyCompanySortField (sortField) {
  if (sortField === "일자"){
    sortField = 'date';
  } else if (sortField === "가입자의 검색 횟수") {
    sortField = 'memberSearchCounting';
  } else if (sortField === "비 가입자의 검색 횟수") {
    sortField = 'nonMemberSearchCounting';
  } else if (sortField === "검색 횟수 총합") {
    sortField = 'totalSearchCounting';
  } else if (sortField === "관심목록 신규 유저 수") {
    sortField = 'watchCounting';
  } else {
    sortField = 'totalWatchCounting';
  }
  return sortField;
}

/** (userEntire) 정렬 기준(필드)을 반환 */
function userEntireSortField (sortField) {
  if (sortField === "일자"){
    sortField = 'date';
  } else if (sortField === "네이버 일간 가입자" || sortField === "네이버 월간 가입자") {
    sortField = 'NAVER';
  } else if (sortField === "카카오 일간 가입자" || sortField === "카카오 월간 가입자") {
    sortField = 'KAKAO';
  } else if (sortField === "일간 가입자 합계" || sortField === "월간 가입자 합계") {
    sortField = 'Daily';
  } else if (sortField === "네이버 누적 가입자") {
    sortField = 'TOTAL_NAVER';
  } else if (sortField === "카카오 누적 가입자") {
    sortField = 'TOTAL_KAKAO';
  } else {
    sortField = 'TOTAL_Daily';
  }
  return sortField;
}

/** (userUsage) 검색 조건에 따라 WHERE 조건문을 반환 */
function userUsageSearchCondition (searchNickName, searchRegisterStart, searchRegisterEnd, searchConnectStart, searchConnectEnd) {
  let condition = "WHERE ";
  let isStart = true;

  if (searchNickName.length !== 0) {
    isStart = false;
    condition = condition + `a.NickName LIKE "%${searchNickName}%"`;
  }
  if (searchRegisterStart.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `a.createdAt >= ${searchRegisterStart}`
  }
  if (searchRegisterEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `a.createdAt <= ${searchRegisterEnd}`
  }
  if (searchConnectStart.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `a.updatedAt >= ${searchConnectStart}`
  }
  if (searchConnectEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `a.updatedAt <= ${searchConnectEnd}`
  }

  if (isStart === true) {
    condition = "";
  }

  return condition;
}

/** (userUsage) 기업 검색 기간 조건에 따라 WHERE 조건문을 반환 */
function userUsageCompanyCondition (searchCompanyStart, searchCompanyEnd) {
  let condition = "WHERE ";
  let isStart = true;

  if (searchCompanyStart.length !== 0) {
    isStart = false
    condition = condition + `created_at >= ${searchCompanyStart}`
  }
  if (searchCompanyEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `created_at <= ${searchCompanyEnd}`
  }

  if (isStart === true) {
    condition = "";
  }

  return condition;
}

/** (userCompanyUsage) 정렬 기준(필드)을 반환 */
function userCompanyUsageSortField (sortField) {
  if (sortField === "기업명"){
    sortField = 'a.corp_name';
  } else if (sortField === "가입자의 검색 횟수"){
    sortField = 'b.memberSearchCounting';
  } else if (sortField === "비 가입자의 검색 횟수") {
    sortField = 'd.nonMemberSearchCounting';
  } else if (sortField === "검색 횟수 총합") {
    sortField = 'c.totalSearchCounting';
  } else if (sortField === "관심목록 수") {
    sortField = 'e.watchCounting';
  } else {
    sortField = 'f.memoCounting';
  }

  return sortField;
}

/** (userCompanyUsage) 검색 조건에 따라 WHERE 조건문을 반환 */
function userCompanyUsageSearchCondition (searchCompanyName, searchCountingStart, searchCountingEnd, searchUserCountingStart, searchUserCountingEnd) {
  let condition = "WHERE ";
  let isStart = true;

  if (searchCompanyName.length !== 0) {
    isStart = false;
    condition = condition + `a.corp_name LIKE "%${searchCompanyName}%"`;
  }
  if (searchCountingStart.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `c.totalSearchCounting >= ${searchCountingStart}`
  }
  if (searchCountingEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `c.totalSearchCounting <= ${searchCountingEnd}`
  }
  if (searchUserCountingStart.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `e.watchCounting >= ${searchUserCountingStart}`
  }
  if (searchUserCountingEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `e.watchCounting <= ${searchUserCountingEnd}`
  }

  if (isStart === true) {
    condition = "";
  }

  return condition;
}

/** (userCompanyUsage) 기업 검색 기간 조건에 따라 WHERE 조건문을 반환 */
function userCompanyUsageCompanyCondition (searchCompanyStart, searchCompanyEnd) {
  let condition = "";
  let isStart = true;

  if (searchCompanyStart.length !== 0) {
    isStart = false
    condition = condition + `created_at >= ${searchCompanyStart}`
  }
  if (searchCompanyEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `created_at <= ${searchCompanyEnd}`
  }

  let conditionArray = ["&& " + condition, "WHERE " + condition];

  if (isStart === true) {
    conditionArray = ["", ""];
  }

  return conditionArray;
}


/** (userDailyCompany) 검색 조건에 따라 WHERE 조건문을 반환 */
function userDailyCompanySearchCondition (searchCountingStart, searchCountingEnd, searchUserCountingStart, searchUserCountingEnd) {
  let condition = "WHERE ";
  let isStart = true;

  if (searchCountingStart.length !== 0) {
    isStart = false;
    condition = condition + `totalSearchCounting >= ${searchCountingStart}`;
  }
  if (searchCountingEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `totalSearchCounting <= ${searchCountingEnd}`
  }
  if (searchUserCountingStart.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `watchCounting >= ${searchUserCountingStart}`
  }
  if (searchUserCountingEnd.length !== 0) {
    if (isStart === true) {
      isStart = false; 
    } else {
      condition = condition + " && ";
    }
    condition = condition + `watchCounting <= ${searchUserCountingEnd}`
  }

  if (isStart === true) {
    condition = "";
  }
  
  return condition;
}


export { 
  sortTypeReturn,
  userInfoSortField,
  userInfoSearchType,
  userMemoSortField,
  userUsageSortField,
  userUsageSearchCondition,
  userDailyCompanySortField,
  userEntireSortField,
  userUsageCompanyCondition,
  userCompanyUsageSortField,
  userCompanyUsageSearchCondition,
  userCompanyUsageCompanyCondition,
  userDailyCompanySearchCondition,
}
