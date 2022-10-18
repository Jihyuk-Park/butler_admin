import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Grid from '@mui/material/Grid';
import NavBar from './component/NavBar';
import UserInfo from './pages/User/UserInfo';
import UserMemo from './pages/User/UserMemo';
import UserUsage from './pages/User/UserUsage';
import UserEntire from './pages/User/UserEntire';
import UserCompanyUsage from './pages/User/UserCompanyUsage';
import UserDailyCompany from './pages/User/UserDailyCompany';
import CompanyList from './pages/Company/CompanyList';
import Stock from './pages/Company/OtherInfo/Stock';
import Dividend from './pages/Company/OtherInfo/Dividend';
import Test from './pages/Test/index2';
import SearchCompany from './pages/Company/SearchCompany';
import Disclosure from './pages/Company/OtherInfo/Disclosure';
import Buyback from './pages/Company/OtherInfo/Buyback';
import Employee from './pages/Company/OtherInfo/Employee';
import Executive from './pages/Company/OtherInfo/Executive';
import MinorityShareHolders from './pages/Company/OtherInfo/MinorityShareHolders';
import IRList from './pages/Company/IR/List';
import IRIndividual from './pages/Company/IR/Individual';

function App() {
  return (
    <div className="App">
      <Grid container maxWidth="false" rowSpacing={1} sx={{ p: 2, backgroundColor: '#F0F2F5' }}>
        <Grid item xs={1.8}>
          <NavBar />
        </Grid>
        <Grid item xs={10.2}>
          <Routes>
            <Route path="Test" element={<Test />} />

            <Route path="/User/UserInfo" element={<UserInfo />} />
            <Route path="/User/UserEntire" element={<UserEntire />} />
            <Route path="/User/UserMemo" element={<UserMemo />} />
            <Route path="/User/UserUsage" element={<UserUsage />} />
            <Route path="/User/UserCompanyUsage" element={<UserCompanyUsage />} />
            <Route path="/User/UserDailyCompany" element={<UserDailyCompany />} />

            <Route path="/Company/CompanyList" element={<CompanyList />} />
            <Route path="/Company/SearchCompany" element={<SearchCompany />} />

            <Route path="/Company/OtherInfo/Disclosure" element={<Disclosure />} />
            <Route path="/Company/OtherInfo/Stock" element={<Stock />} />
            <Route path="/Company/OtherInfo/Dividend" element={<Dividend />} />
            <Route path="/Company/OtherInfo/Buyback" element={<Buyback />} />
            <Route path="/Company/OtherInfo/Employee" element={<Employee />} />
            <Route path="/Company/OtherInfo/Executive" element={<Executive />} />
            <Route
              path="/Company/OtherInfo/MinorityShareHolders"
              element={<MinorityShareHolders />}
            />

            <Route path="/Company/IR/List" element={<IRList />} />
            <Route path="/Company/IR/Individual/:searchStockCode" element={<IRIndividual />} />
          </Routes>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
