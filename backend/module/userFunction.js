/** 검색 타입에 따라 필드명을 변환해주는 함수  ex) 로그인 방식 => AuthType 반환 */
function userInfoSearchType (input) {
  let result;

  if (input === "닉네임") {
    result = 'a.NickName';
  } else if (input === "로그인 방식") {
    result = 'a.AuthType';
  } else if (input === "이름") {
    result = 'a.Name';
    // 임시로. Grade, Type 아직 없는 듯한
  } else if (input === "Grade") {
    result = 'b.status';
  } else if (input === "Type") {
    result = 'b.type';
  } else {
    result = 'a.id';
  }

  // console.log(input);

  return result;
}

export { userInfoSearchType }