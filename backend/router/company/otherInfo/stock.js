import express from 'express';
const router = express.Router();
import { s3 } from '../../../module/aws.js';

// getData
router.get('/getData/search/:searchCompanyCode', function(req,res){
  let searchCompanyCode = req.params.searchCompanyCode;

  let params = {Bucket: 'butler-dev-storage', Key: 'v1/00266961_OFS.json'}
  // let params = {Bucket: 'butler-dev-storage/v1', Key: '00266961_OFS.json'}

  s3.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

});


export default router;
