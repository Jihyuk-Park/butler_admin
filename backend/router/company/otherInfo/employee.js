import express from 'express';
const router = express.Router();
import { getDataS3 } from '../../../module/aws.js';
import { filterS3Employee } from '../../../module/companyFunction.js';

// getData
router.get('/getData/search/:reportsType/:searchCompanyCode', async function(req,res){

  let searchCompanyCode = req.params.searchCompanyCode;
  let reportsType = req.params.reportsType;
  let S3Data = await getDataS3(searchCompanyCode, reportsType);

  if (S3Data === "X"){
    return res.json("X");
  }

  let accountArray;

  if (reportsType === 'rawReports') {
    accountArray = [
      [['남', 'male'],
        [{ type_nm: '직원 수', type: 'count'},
          { type_nm: '근속연수', type: 'serviceYr' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' }]
      ],
      [['여', 'female'],
        [{ type_nm: '직원 수', type: 'count'},
          { type_nm: '근속연수', type: 'serviceYr' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' }]
      ],
      [['합계', 'total'],
        [{ type_nm: '직원 수', type: 'count'},
          { type_nm: '근속연수', type: 'serviceYr' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' },]
      ],
    ];
  } else {
    accountArray = [
      [['남', 'male'],
        [{ type_nm: '직원 수', type: 'count' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' }]
      ],
      [['여', 'female'],
        [{ type_nm: '직원 수', type: 'count' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' }]
      ],
      [['합계', 'total'],
        [{ type_nm: '직원 수', type: 'count' },
          { type_nm: '급여총액(십억)', type: 'salary' },
          { type_nm: '1인평균', type: 'salaryAvg' },
          { type_nm: '매출액대비 급여비율', type: 'salarySalesratio' },
          { type_nm: '영업이익대비 급여비율', type: 'salaryProfitratio' },]
      ],
    ];
  }
  
  const employeeData = filterS3Employee(accountArray, S3Data, 'employees');

  return res.json(employeeData);
});


export default router;