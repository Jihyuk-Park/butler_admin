import { useEffect } from 'react';

/** 테이블 맨끝으로 이동시키는 함수 */
export const scrollRight = () => {
  useEffect(() => {
    const scrollTest = document.getElementById('table');
    scrollTest.scrollTo(2000, 0);
  }, []);
};

/** 15년 ~ 현재 년도까지 자동 */
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

/** 세 자리 마다 콤마를 추가 */
export const addComma = input => {
  let newInput = input;
  if (input) {
    newInput = input.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return newInput;
};

/** `19Q1 => Q119로 변경 (변수명 영문 앞으로 와야하기에 DB에서 Q119로 불러오는) */
export const changeKeyName = input => {
  const key = input.substring(3, 5) + input.substring(1, 3);
  return key;
};

// /** 배열 내의 값들을 더한 결과를 나타내는 함수 */
// export function plusCalculation(arr, name){
//   let answer = {};

//   arr.map((each, index) => {
//     if (index === 0) {
//         answer = Object.assign(answer, each);
//         // console.log('answer1 : ', answer);
//     } else {
//         for(const prop in each){
//             if (prop === 'name'){
//                 answer[prop] = name;
//             } else {
//                 answer[prop] += each[prop];
//             }
//         }
//     }
//   })

//   console.log(answer);
//   return answer;
// };

// /** 배열 내의 값들을 뺀 결과를 나타내는 함수 */
// export function minusCalculation(arr, name){
//   let answer = {};

//   arr.map((each, index) => {
//     if (index === 0) {
//         answer = Object.assign(answer, each);
//         // console.log('answer1 : ', answer);
//     } else {
//         for(const prop in each){
//             if (prop === 'name'){
//                 answer[prop] = name;
//             } else {
//                 answer[prop] -= each[prop];
//             }
//         }
//     }
//   })

//   console.log(answer);
//   return answer;
// };

// /** 배열 내의 값들을 나눈 결과를 나타내는 함수 */
// export function divideCalculation(arr, name){
//   let answer = {};

//   arr.map((each, index) => {
//     if (index === 0) {
//         answer = Object.assign(answer, each);
//         // console.log('answer1 : ', answer);
//     } else {
//         for(const prop in each){
//             if (prop === 'name'){
//                 answer[prop] = name;
//             } else {
//                 answer[prop] /= each[prop];
//             }
//         }
//     }
//   })

//   console.log(answer);
//   return answer;
// };
