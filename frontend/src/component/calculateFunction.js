/** 배열 내의 값들을 더한 결과를 나타내는 함수 */
export function plusCalculation(arr, name){
  let answer = {};

  arr.map((each, index) => {
    if (index === 0) {
        answer = Object.assign(answer, each);
        // console.log('answer1 : ', answer);
    } else {
        for(const prop in each){
            if (prop === 'name'){
                answer[prop] = name;
            } else {
                answer[prop] += each[prop];
            }
        }
    }
  })

  console.log(answer);
  return answer;
};

/** 배열 내의 값들을 뺀 결과를 나타내는 함수 */
export function minusCalculation(arr, name){
  let answer = {};

  arr.map((each, index) => {
    if (index === 0) {
        answer = Object.assign(answer, each);
        // console.log('answer1 : ', answer);
    } else {
        for(const prop in each){
            if (prop === 'name'){
                answer[prop] = name;
            } else {
                answer[prop] -= each[prop];
            }
        }
    }
  })

  console.log(answer);
  return answer;
};

/** 배열 내의 값들을 나눈 결과를 나타내는 함수 */
export function divideCalculation(arr, name){
  let answer = {};

  arr.map((each, index) => {
    if (index === 0) {
        answer = Object.assign(answer, each);
        // console.log('answer1 : ', answer);
    } else {
        for(const prop in each){
            if (prop === 'name'){
                answer[prop] = name;
            } else {
                answer[prop] /= each[prop];
            }
        }
    }
  })

  console.log(answer);
  return answer;
};

