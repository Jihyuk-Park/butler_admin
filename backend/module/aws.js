import AWS from 'aws-sdk';
import config from './config.js';
import multer from 'multer';
import multerS3 from 'multer-s3';

// aws region 및 자격증명 설정
AWS.config.update({
   accessKeyId: config['AWS_S3_ACCESS_KEY_ID'],
   secretAccessKey: config['AWS_S3_SECRET_ACCESS_KEY'],
   region: config['AWS_S3_REGION'],
});

// S3 객체 얻기
const s3 = new AWS.S3();

const jsonBucket = config['AWS_S3_JSONDATA'];
const irBucket = config['AWS_S3_IRDATA'];

// IR delete
const deleteIRS3 = (fileName) => s3.deleteObject({
   Bucket: irBucket,
   Key: fileName
}, function(err, data) {
   if (err) { 
      console.log(err);
      return false;
   } else {
      // console.log('s3 deleteObject', data);
      return true;
   }
})

// IR upload
const uploadIRS3 = multer({
   storage: multerS3({
       s3: s3,
       bucket: irBucket,
       key: function(req, file, cb) {
         // console.log(`${req.body.stock_code}/${req.body.directory}/${file.originalname}`);
           cb(null, `${req.body.stock_code}/${req.body.directory}/${file.originalname}`);
       }
   }),
});

/** s3 내 필요한 데이터를 얻는 함수 - 기업 코드, 필요한 데이터(분기, 연간누적 등) 종류, 연결/개별을 인풋으로 */
async function getDataS3 (corp_code, whichData, fs_div) {
   const fs_div_type = fs_div === "OFS" ? "OFS" : "CFS";
   const params = {Bucket: jsonBucket, Key: `v1/${corp_code}_${fs_div_type}.json`};

   let s3Obj;
   try {
      s3Obj = await s3.getObject(params).promise();
   } catch (err) {
      console.log(err);
   };
   
   // 키(데이터 파일)이 있는 경우
   if (s3Obj) {
      let jsonData = JSON.parse(s3Obj.Body.toString('utf8'));
      // console.log('Object Key : ', Object.keys(jsonData));
      
      // 필요한 데이터 종류 선택 ex) quarterReports, accumulteReports, yearReports, etc...
      let s3Data = jsonData[whichData];
      // console.log(s3Data);
      return s3Data;
   } else {
      // 키(데이터 파일)가 없는 경우 X => 프론트 alert
      return "X";
   }   
}

export { s3, deleteIRS3, uploadIRS3, getDataS3 }
