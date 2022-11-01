import { useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/ko';

/** 테이블 맨끝으로 이동시키는 함수 (useEffect Hook) */
export const scrollRightUseEffect = data => {
  useEffect(() => {
    const scrollTest = document.getElementById('table');
    scrollTest.scrollTo(4000, 0);
  }, [data]);
};

/** 테이블 맨끝으로 이동시키는 함수 */
export const scrollRight = name => {
  const scrollTest = document.getElementById(`table${name}`);
  scrollTest.scrollTo(4000, 0);
};

/** 날짜 형 변환 YYYY-MM-DD */
export const changeDateDash = date => {
  let publishDate;
  if (date) {
    publishDate = moment(date).format('YYYY-MM-DD');
  }
  return publishDate;
};

/** 날짜 형 변환 YYYY.MM.DD */
export const changeDateDot = date => {
  let publishDate;
  if (date) {
    publishDate = moment(date).format('YYYY.MM.DD');
  }
  return publishDate;
};

/** 날짜 형 변환 YYYYMMDD */
export const changeDateNoDot = date => {
  let publishDate;
  if (date) {
    publishDate = moment(date).format('YYYYMMDD');
  }
  return publishDate;
};

/** 0,1을 O,X로 변환 */
export const transOX = input => {
  if (input === 1) {
    return 'O';
  }
  return 'X';
};

/** 연도&분기 - 15년 ~ 현재 년도까지 분기별 자동 */
export const periodArrayAuto = () => {
  const thisYear = new Date().getFullYear() - 2000;
  const yearArr = [];
  for (let year = 15; year <= thisYear; year += 1) {
    for (let quarter = 1; quarter <= 4; quarter += 1) {
      yearArr.push(`'${year}Q${quarter}`);
    }
  }
  return yearArr;
};

/** 년 - n년 ~ 현재 년도까지 자동 */
export const YearArrayAuto = (startYear, addText) => {
  const thisYear = new Date().getFullYear();
  const yearArr = [];
  for (let year = startYear; year <= thisYear; year += 1) {
    // 문자열
    if (addText) {
      yearArr.push(`${year}${addText}`);
    } else {
      yearArr.push(`${year}`);
    }
  }
  return yearArr;
};

/** 세 자리 마다 콤마를 추가 */
export const addComma = input => {
  let newInput = input;

  if (input) {
    newInput = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return newInput;
};

/** 콤마 삭제 */
export const removeComma = input => {
  let newInput = input;
  if (input) {
    newInput = input.replace(/,/g, '');
  }
  return newInput;
};

/** 소수점 세 자리까지 */
export const decimalPercent = input => {
  let newInput = input;
  if (input && input !== '-') {
    newInput = `${parseFloat(input * 100).toFixed(2)}%`;
  }
  // console.log(newInput);
  return newInput;
};

/** 나누고 콤마 */
export const divideAndComma = (input, divideNum, inputDigit) => {
  let newInput = input;
  if (input && input !== '-') {
    newInput = addComma((input / divideNum).toFixed(inputDigit));
  }
  // console.log(newInput);
  return newInput;
};

/** `19Q1 => Q119로 변경 (변수명 영문 앞으로 와야하기에 DB에서 Q119로 불러오는) */
export const changeKeyName = input => {
  const key = input.substring(3, 5) + input.substring(1, 3);
  return key;
};
