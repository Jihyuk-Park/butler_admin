/** 검색 타입에 따라 필드명을 변환해주는 함수  ex) 로그인 방식 => AuthType 반환 */
function userInfoSearchType (input) {
  let result;

  if (input === "닉네임") {
    result = 'NickName';
  } else if (input === "로그인 방식") {
    result = 'AuthType';
  } else if (input === "이름") {
    result = 'Name';
    // 임시로. Grade, Type 아직 없는 듯한
  } else if (input === "Grade") {
    result = 'Name';
  } else if (input === "Type") {
    result = 'Name';
  } else {
    result = 'id';
  }

  // console.log(input);

  return result;
}

export { userInfoSearchType }