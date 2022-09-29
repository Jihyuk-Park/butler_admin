import express from 'express';
const app = express();
const port = 9988;

app.use(express.urlencoded( {extended : false } ));
app.use(express.json());


import userInfo from './router/user/userInfo.js';
import userMemo from './router/user/userMemo.js';
import userEntire from './router/user/userEntire.js';
import userUsage from './router/user/userUsage.js';
app.use('/admin/user/userInfo', userInfo);
app.use('/admin/user/userMemo', userMemo);
app.use('/admin/user/userEntire', userEntire);
app.use('/admin/user/userUsage', userUsage);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
