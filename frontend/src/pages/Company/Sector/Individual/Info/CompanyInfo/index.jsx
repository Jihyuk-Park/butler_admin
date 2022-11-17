import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from '@mui/material';
import PropTypes from 'prop-types';
import { url } from '../../../../../../component/commonVariable';
import { addComma } from '../../../../../../component/commonFunction';
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import EditCompanyInfoModal from './EditCompanyInfoModal';

export default function CompanyInfo({ refreshSwitch, setRefreshSwitch }) {
  // 기업 corp_Code url
  const { searchCorpCode } = useParams();

  // 기업정보 편집 모달 스위치
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [isEdit, setIsEdit] = useState(true);

  // 기업 정보 데이터 관련
  const companyInfoTable = [
    ['최근 파일', 'segment_last_updated'],
    ['정보1', 'segment_title1'],
    ['정보2', 'segment_title2'],
    ['소스', 'segment_source'],
    ['통화', 'currency'],
    ['단위', 'unit'],
    ['서비스 여부', 'is_available'],
  ];
  const [companyInfoData, setCompanyInfoData] = useState({ corp_name: '', analysis_id: null });

  // 기업정보를 받아오는 Hook
  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/sector/individual/info/company/getData/${searchCorpCode}`)
        .then(result => {
          if (result.data[0] !== undefined) {
            setCompanyInfoData(result.data[0]);
            if (result.data[0].analysis_id === null) {
              setIsEdit(false);
            } else {
              setIsEdit(true);
            }
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode, refreshSwitch]);

  const openEditModal = () => {
    setEditModalSwitch(true);
  };

  return (
    <div>
      <Grid container direction="row" justifyContent="space-between" sx={{ mt: '20px' }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={searchCorpCode === 'main'}
          onClick={openEditModal}
        >
          기업정보 편집
        </Button>
      </Grid>

      {/* 기업정보 영역 */}
      <TableContainer component={Paper} sx={{ maxWidth: '400px', mt: '10px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell colSpan={2}>
                <b>{companyInfoData.corp_name || '기업정보'}</b>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companyInfoTable.map((eachdata, index) => (
              <StyledTableRow key={eachdata}>
                <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>{eachdata[0]}</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {index !== 5 ? companyInfoData[eachdata[1]] : null}
                  {index === 5 ? addComma(companyInfoData[eachdata[1]]) : null}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editModalSwitch === true ? (
        <EditCompanyInfoModal
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          editData={companyInfoData}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          isEdit={isEdit}
        />
      ) : null}
    </div>
  );
}

CompanyInfo.defaultProps = {
  refreshSwitch: true,
  setRefreshSwitch: () => {},
};

CompanyInfo.propTypes = {
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
};
