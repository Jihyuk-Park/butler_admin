import express from 'express';
const router = express.Router();
import { getDataS3 } from '../../../module/aws.js';
import { filterS3Depth3 } from '../../../module/companyFunction.js';

// getData
router.get('/getData/search/:reportsType/:buybackType/:searchCompanyCode', async function(req,res){

  let searchCompanyCode = req.params.searchCompanyCode;
  let reportsType = req.params.reportsType;
  let buybackType = req.params.buybackType;

  let S3Data = await getDataS3(searchCompanyCode, reportsType);

  if (S3Data === "X"){
    return res.json("X");
  }

  let accountArray = [
    [['직접취득', 'directBuyBacks'],
      [{ type_nm: '헤더', type: 'header'}, { type_nm: '기초', type: 'bsis_qy' }, { type_nm: '변동', type: 'change_qy' }, { type_nm: '기말', type: 'trmend_qy' }]],
    [['신탁계약', 'investBuyBacks'],
      [{ type_nm: '헤더', type: 'header'}, { type_nm: '기초', type: 'bsis_qy' }, { type_nm: '변동', type: 'change_qy' }, { type_nm: '기말', type: 'trmend_qy' }]],
    [['기타', 'etcBuyBacks'],
      [{ type_nm: '헤더', type: 'header'}, { type_nm: '기초', type: 'bsis_qy' }, { type_nm: '변동', type: 'change_qy' }, { type_nm: '기말', type: 'trmend_qy' }]],
    [['합계', 'totalBuyBacks'],
      [{ type_nm: '헤더', type: 'header'}, { type_nm: '기초', type: 'bsis_qy' }, { type_nm: '취득', type: 'change_qy_acqs' },
      { type_nm: '처분', type: 'change_qy_dsps' }, { type_nm: '소각', type: 'change_qy_incnr' }, { type_nm: '변동', type: 'change_qy' }, { type_nm: '기말', type: 'trmend_qy'}]],
  ];

  const buyBackData = filterS3Depth3(accountArray, S3Data, 'buyback', buybackType);

  return res.json(buyBackData);
});

export default router;
