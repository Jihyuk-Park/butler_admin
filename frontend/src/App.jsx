import React, { useState } from 'react';
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
import SearchCompany from './pages/Company/SearchCompany';
import Disclosure from './pages/Company/OtherInfo/Disclosure';
import Buyback from './pages/Company/OtherInfo/Buyback';
import Employee from './pages/Company/OtherInfo/Employee';
import Executive from './pages/Company/OtherInfo/Executive';
import MinorityShareHolders from './pages/Company/OtherInfo/MinorityShareHolders';
import IRList from './pages/Company/IR/List';
import IRIndividual from './pages/Company/IR/Individual';
import SectorList from './pages/Company/Sector/List';
import SectorIndividual from './pages/Company/Sector/Individual';
import GeographyList from './pages/Company/Geography/List';
import GeographyIndividual from './pages/Company/Geography/Individual';
import IndividualCompany from './pages/Company/IndividualCompany';
import Crawling from './pages/Company/Financial/Crawling';
import Dart from './pages/Company/Financial/Dart';
import Management from './pages/Company/Financial/Management';
import Entrance from './pages/Entrance';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  return (
    <div className="App">
      {isLogin === false ? (
        <Entrance setIsLogin={setIsLogin} />
      ) : (
        <Grid container maxWidth="false" rowSpacing={1} sx={{ p: 2, backgroundColor: '#F0F2F5' }}>
          <Grid item xs={1.8}>
            <NavBar />
          </Grid>
          <Grid item xs={10.2} sx={{ minHeight: { lg: '95vh', xl: '97vh' } }}>
            <Routes>
              {/* 메인(기본url) 페이지('/') */}
              <Route path="/" element={<CompanyList />} />

              {/* 유저 메뉴 */}
              <Route path="/User/UserInfo" element={<UserInfo />} />
              <Route path="/User/UserEntire" element={<UserEntire />} />
              <Route path="/User/UserMemo" element={<UserMemo />} />
              <Route path="/User/UserUsage" element={<UserUsage />} />
              <Route path="/User/UserCompanyUsage" element={<UserCompanyUsage />} />
              <Route path="/User/UserDailyCompany" element={<UserDailyCompany />} />

              {/* 기업 목록 */}
              <Route path="/Company/CompanyList" element={<CompanyList />} />
              {/* 기업 탐색 */}
              <Route path="/Company/SearchCompany" element={<SearchCompany />} />
              {/* 개별 기업 */}
              <Route path="/Company/IndividualCompany" element={<IndividualCompany />} />

              {/* 재무제표 */}
              <Route path="/Company/Financial/Crawling" element={<Crawling />} />
              <Route path="/Company/Financial/Dart" element={<Dart />} />
              <Route path="/Company/Financial/Management" element={<Management />} />

              {/* 기타 정보 */}
              <Route path="/Company/OtherInfo/Disclosure" element={<Disclosure />} />
              <Route path="/Company/OtherInfo/Stock/:searchCorpCode" element={<Stock />} />
              <Route path="/Company/OtherInfo/Dividend/:searchCorpCode" element={<Dividend />} />
              <Route path="/Company/OtherInfo/Buyback/:searchCorpCode" element={<Buyback />} />
              <Route path="/Company/OtherInfo/Employee/:searchCorpCode" element={<Employee />} />
              <Route path="/Company/OtherInfo/Executive/:searchCorpCode" element={<Executive />} />
              <Route
                path="/Company/OtherInfo/MinorityShareHolders/:searchCorpCode"
                element={<MinorityShareHolders />}
              />

              {/* IR */}
              <Route path="/Company/IR/List" element={<IRList />} />
              <Route path="/Company/IR/Individual/:searchStockCode" element={<IRIndividual />} />

              {/* 부문별 */}
              <Route path="/Company/Sector/List" element={<SectorList />} />
              <Route
                path="/Company/Sector/Individual/:searchCorpCode"
                element={<SectorIndividual />}
              />

              {/* 지역별 */}
              <Route path="/Company/Geography/List" element={<GeographyList />} />
              <Route
                path="/Company/Geography/Individual/:searchCorpCode"
                element={<GeographyIndividual />}
              />
            </Routes>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default App;
