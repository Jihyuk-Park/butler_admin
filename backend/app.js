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

// individualCompany
import individualCompany from './router/company/individualCompany.js';
app.use('/admin/company/individualCompany', individualCompany);

// otherInfo
import disclosure from './router/company/otherInfo/disclosure.js';
import dividend from './router/company/otherInfo/dividend.js';
import executive from './router/company/otherInfo/executive.js';
import minorityShareHolders from './router/company/otherInfo/minorityShareHolders.js';
app.use('/admin/company/otherInfo/disclosure', disclosure);
app.use('/admin/company/otherInfo/dividend', dividend);
app.use('/admin/company/otherInfo/executive', executive);
app.use('/admin/company/otherInfo/minorityShareHolders', minorityShareHolders);

// ir
import irList from './router/company/ir/list.js';
import irIndividual from './router/company/ir/individual.js';
app.use('/admin/company/ir/list', irList);
app.use('/admin/company/ir/individual', irIndividual);

// sector
import sectorList from './router/company/sector/list.js';
import sectorIndividual from './router/company/sector/individual.js';
app.use('/admin/company/sector/list', sectorList);
app.use('/admin/company/sector/individual', sectorIndividual);

// region
import geographyList from './router/company/geography/list.js';
import geographyIndividual from './router/company/geography/individual.js';
app.use('/admin/company/geography/list', geographyList);
app.use('/admin/company/geography/individual', geographyIndividual);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
