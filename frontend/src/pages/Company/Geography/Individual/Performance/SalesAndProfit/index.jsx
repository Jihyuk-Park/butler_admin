import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Stack,
  Typography,
} from '@mui/material';
import PeriodTableCell from '../../../../../../component/UI/PeriodTableCell';
import PeriodTableCell3 from '../../../../../../component/UI/PeriodTableCell3';
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../../component/commonVariable';
import {
  scrollRight,
  periodArrayAuto,
  addComma,
  changeKeyName,
} from '../../../../../../component/commonFunction';
import EditAddSalesAndProfitModal from './EditAddSalesAndProfitModal';

// * 매출액, 영업이익 공통 컴포넌트 (type에 따라 매출액, 영업이익 등)
export default function SalesAndProfit({ infoData, type, searchCorpCode }) {
  // salesAndProfitData
  const [salesAndProfitData, setSalesAndProfitData] = useState([]);
  const salesAndProfitDataArray = ['지역1', '지역2', '지역3'];
  const periodArray = periodArrayAuto();

  // editModal
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshSwitch, setRefreshSwitch] = useState(false);

  useEffect(() => {
    // 기업 검색을 하지 않았거나 정보1,2의 값이 없거나 빈칸이면 데이터를 불러오지 않음
    if (
      searchCorpCode !== 'main' &&
      `${infoData[`geography_title${type}`]}` !== 'null' &&
      `${infoData[`geography_title${type}`]}` !== ''
    ) {
      axios
        .get(
          `${url}/admin/company/geography/individual/performance/getData/${searchCorpCode}/
          ${infoData[`geography_title${type}`]}`,
        )
        .then(result => {
          // console.log(result.data);
          if (result.data.length !== 1) {
            setSalesAndProfitData(result.data);
          }

          scrollRight(type);
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode, refreshSwitch]);

  const openAddEditModal = period => {
    setEditModalSwitch(true);

    const tempSelectedData = [];
    const withoutSum = salesAndProfitData.slice(0, salesAndProfitData.length - 1);
    withoutSum.map(each => {
      tempSelectedData.push({
        id: each.id,
        depth1: each.depth1,
        depth2: each.depth2,
        depth3: each.depth3,
        value: each[changeKeyName(period)] / infoData.unit || null,
      });
      return null;
    });
    setSelectedData(tempSelectedData);
    setSelectedDate(period);
  };

  return (
    <div>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: '20px', pl: '5px' }}>
        <Typography fontSize={20} fontWeight={600}>
          {infoData[`geography_title${type}`]}
          {salesAndProfitData.length === 0 ? ' 데이터가 없습니다' : null}
        </Typography>
      </Stack>
      {salesAndProfitData.length === 0 ? null : (
        <TableContainer
          id={`table${type}`}
          component={Paper}
          sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[...salesAndProfitDataArray, ...periodArray].map(function (eachdata, index) {
                  return (
                    <PeriodTableCell3
                      key={eachdata}
                      onClick={
                        index === 0 || index === 1 || index === 2
                          ? null
                          : () => openAddEditModal(eachdata)
                      }
                      sx={[
                        index === 0 || index === 1 || index === 2
                          ? {
                              minWidth: 90,
                              position: 'sticky',
                              left: 110 * index,
                              zIndex: 100,
                            }
                          : {
                              cursor: 'pointer',
                            },
                      ]}
                    >
                      {eachdata}
                    </PeriodTableCell3>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {salesAndProfitData.map(function (eachdata, index) {
                return (
                  <StyledTableRow
                    key={eachdata.id}
                    sx={{
                      '&:last-child th, &:last-child td': {
                        borderTop: '1px solid black',
                      },
                    }}
                  >
                    {index !== salesAndProfitData.length - 1 ? (
                      <>
                        <StyledTableCell
                          sx={{
                            minWidth: 90,
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#FFFAFA',
                            fontWeight: 600,
                          }}
                        >
                          {eachdata.depth1}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            minWidth: 90,
                            position: 'sticky',
                            left: 110,
                            backgroundColor: '#FFFAFA',
                            fontWeight: 600,
                          }}
                        >
                          {eachdata.depth2}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{
                            minWidth: 90,
                            position: 'sticky',
                            left: 220,
                            backgroundColor: '#FFFAFA',
                            fontWeight: 600,
                            borderRight: '1px solid black',
                          }}
                        >
                          {eachdata.depth3}
                        </StyledTableCell>
                        {periodArray.map(function (period, periodIndex) {
                          return (
                            <PeriodTableCell3
                              key={`${eachdata}${period}`}
                              sx={[
                                periodIndex % 4 === 3 ? { borderRight: '0.8px solid #A9A9A9' } : {},
                              ]}
                            >
                              {eachdata[changeKeyName(period)] === null ||
                              eachdata[changeKeyName(period)] === undefined
                                ? null
                                : addComma(eachdata[changeKeyName(period)] / infoData.unit)}
                            </PeriodTableCell3>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <StyledTableCell
                          colSpan={3}
                          sx={{
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#E8E8E8',
                            fontWeight: 600,
                          }}
                        >
                          합계
                        </StyledTableCell>
                        {periodArray.map(function (period) {
                          return (
                            <PeriodTableCell key={`${eachdata}${period}`}>
                              {eachdata[changeKeyName(period)] === null ||
                              eachdata[changeKeyName(period)] === undefined
                                ? null
                                : addComma(eachdata[changeKeyName(period)] / infoData.unit)}
                            </PeriodTableCell>
                          );
                        })}
                      </>
                    )}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {editModalSwitch === true ? (
        <EditAddSalesAndProfitModal
          type={infoData[`geography_title${type}`]}
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          editData={selectedData}
          editDate={selectedDate}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          unit={infoData.unit}
        />
      ) : null}
    </div>
  );
}

SalesAndProfit.defaultProps = {
  type: '1',
  infoData: {},
  searchCorpCode: '0',
};

SalesAndProfit.propTypes = {
  type: PropTypes.string,
  // eslint-disable-next-line
  infoData: PropTypes.object,
  searchCorpCode: PropTypes.string,
};
