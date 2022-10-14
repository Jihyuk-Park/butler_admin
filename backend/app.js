import express from 'express';
const app = express();
const port = 9988;

app.use(express.urlencoded( {extended : false } ));
app.use(express.json());


// common
import common from './router/common.js';
app.use('/admin/common', common);

// user
import userInfo from './router/user/userInfo.js';
import userMemo from './router/user/userMemo.js';
import userEntire from './router/user/userEntire.js';
import userUsage from './router/user/userUsage.js';
import userCompanyUsage from './router/user/userCompanyUsage.js';
import userDailyCompany from './router/user/userDailyCompany.js';
app.use('/admin/user/userInfo', userInfo);
app.use('/admin/user/userMemo', userMemo);
app.use('/admin/user/userEntire', userEntire);
app.use('/admin/user/userUsage', userUsage);
app.use('/admin/user/userCompanyUsage', userCompanyUsage);
app.use('/admin/user/userDailyCompany', userDailyCompany);

// company
// companyList
import companyList from './router/company/companyList.js';
app.use('/admin/company/companyList', companyList);

// otherInfo
import disclosure from './router/company/otherInfo/disclosure.js';
import dividend from './router/company/otherInfo/dividend.js';
app.use('/admin/company/otherInfo/disclosure', disclosure);
app.use('/admin/company/otherInfo/dividend', dividend);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
