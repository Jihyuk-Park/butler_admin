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
  Grid,
  Button,
} from '@mui/material';
import { url } from '../../../../../../component/commonVariable';
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import EditSectorModal from './EditSectorModal';

export default function SectorInfo() {
  // 기업 stockCode url
  const { searchCorpCode } = useParams();

  // 기업 정보
  const [companyInfoData, setCompanyInfoData] = useState({ corp_name: '', analysis_id: null });

  // 부문 정보 데이터 관련
  const dataTable = ['부문정보', '부문1', '부문2', '부문3', '주요부문', '부문설명'];
  const [sectorInfoData, setSectorInfoData] = useState([]);

  // 부문정보 편집 모달 스위치 & 리프레시
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [refreshSwitch, setRefreshSwitch] = useState(false);

  // 기업정보를 받아오는 Hook
  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/sector/individual/info/company/getData/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data[0]);
          if (result.data[0] !== undefined) {
            setCompanyInfoData(result.data[0]);
          }
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode, refreshSwitch]);

  // 부문정보를 받아오는 Hook
  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/sector/individual/info/sector/getData/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data);
          setSectorInfoData(result.data);
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
      <Grid container justifyContent="space-between" sx={{ mt: '20px' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={openEditModal}
          disabled={searchCorpCode === 'main' || companyInfoData.analysis_id === null}
        >
          {companyInfoData.analysis_id === null ? '파일을 먼저 등록해주세요' : '부문정보 편집'}
        </Button>
      </Grid>

      {/* 부문정보 영역 */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: { md: '400px', xl: '650px' }, mt: '10px' }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {dataTable.map(function (eachdata) {
                return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {sectorInfoData.map((eachdata, index) => (
              <StyledTableRow key={eachdata.id}>
                <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>{index + 1}</StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.depth1}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.depth2}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 60, maxWidth: 60 }}>
                  {eachdata.depth3}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 30, maxWidth: 30 }}>
                  {eachdata.is_importance}
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: 70, maxWidth: 70 }}>
                  {eachdata.description}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {editModalSwitch === true ? (
        <EditSectorModal
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
        />
      ) : null}
    </div>
  );
}
