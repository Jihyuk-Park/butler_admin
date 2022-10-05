/** 내림차순/오름차순 타입을 반환 */
function sortTypeReturn (sortType) {
  if (sortType === "내림차순") {
    sortType = 'DESC';
  } else {
    sortType = 'ASC';
  }
  return sortType;
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
  } else {
    sortField = 'c.NickName';
  }

  return sortField;
}

/** (userUsage) 정렬 기준(필드)을 반환 */
function userUsageSortField (sortField) {
  if (sortField === "가입일"){
    sortField = 'a.createdAt';
  } else if (sortField === "최근 접속일") {
    sortField = 'a.updatedAt';
  } else if (sortField === "기업 검색 횟수") {
    sortField = 'c.searchCounting';
  } else if (sortField === "관심목록 그룹 수") {
    sortField = 'g.watchCompanyCounting';
  } else {
    sortField = 'd.watchGroupCounting';
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
  if (sortField === "가입자의 검색 횟수"){
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
  userInfoSearchType,
  userMemoSortField,
  userUsageSortField,
  userUsageSearchCondition,
  userUsageCompanyCondition,
  userCompanyUsageSortField,
  userCompanyUsageSearchCondition,
  userCompanyUsageCompanyCondition,
  userDailyCompanySearchCondition,
}
