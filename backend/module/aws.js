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

const dataBucket = config['AWS_S3_JSONDATA'];
const irBucket = config['AWS_S3_IRDATA'];


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

export { s3, deleteIRS3, uploadIRS3 };
