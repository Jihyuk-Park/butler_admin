import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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
import StyledTableCell from '../../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../../component/UI/StyledTableRow';
import { url } from '../../../../../../component/commonVariable';
import {
  scrollRight,
  periodArrayAuto,
  addComma,
  changeKeyName,
} from '../../../../../../component/commonFunction';
import EditAddSalesModal from './EditAddSalesModal';

export default function Sales() {
  // corp_code
  const { searchCorpCode } = useParams();

  // salesData
  const [salesData, setSalesData] = useState([]);
  const salesDataArray = ['부문1', '부문2', '부문3'];
  const periodArray = periodArrayAuto();
  // unit
  const [unit, setUnit] = useState(1);

  // editModal
  const [editModalSwitch, setEditModalSwitch] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshSwitch, setRefreshSwitch] = useState(false);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/sector/individual/performance/sales/getData/${searchCorpCode}`)
        .then(result => {
          setSalesData(result.data);
          // console.log(result.data);
          scrollRight();
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode, refreshSwitch]);

  useEffect(() => {
    if (searchCorpCode !== 'main') {
      axios
        .get(`${url}/admin/company/sector/individual/info/company/getData/${searchCorpCode}`)
        .then(result => {
          // console.log(result.data[0].unit);
          setUnit(result.data[0].unit);
          scrollRight();
        })
        .catch(() => {
          console.log('실패했습니다');
        });
    }
  }, [searchCorpCode]);

  const openAddEditModal = period => {
    setEditModalSwitch(true);

    const tempSelectedData = [];
    const withoutSum = salesData.slice(0, salesData.length - 1);
    withoutSum.map(each => {
      tempSelectedData.push({
        id: each.id,
        depth1: each.depth1,
        depth2: each.depth2,
        depth3: each.depth3,
        value: each[changeKeyName(period)] / unit || null,
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
          {salesData.length === 0 ? '매출액 데이터가 없습니다' : '매출액'}
        </Typography>
      </Stack>
      {salesData.length === 0 ? null : (
        <TableContainer
          id="table"
          component={Paper}
          sx={{ maxHeight: { md: '635px', xl: '935px' }, mt: '10px' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[...salesDataArray, ...periodArray].map(function (eachdata, index) {
                  return (
                    <StyledTableCell
                      key={eachdata}
                      align="center"
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
                    </StyledTableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map(function (eachdata, index) {
                return (
                  <StyledTableRow
                    key={eachdata.id}
                    sx={{
                      '&:last-child th, &:last-child td': {
                        borderTop: '1px solid black',
                      },
                    }}
                  >
                    {index !== salesData.length - 1 ? (
                      <>
                        <StyledTableCell
                          align="center"
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
                          align="center"
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
                          align="center"
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
                        {periodArray.map(function (period) {
                          return (
                            <PeriodTableCell align="center" key={`${eachdata}${period}`}>
                              {eachdata[changeKeyName(period)] === null ||
                              eachdata[changeKeyName(period)] === undefined
                                ? null
                                : addComma(eachdata[changeKeyName(period)] / unit)}
                            </PeriodTableCell>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <StyledTableCell
                          align="center"
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
                            <PeriodTableCell align="center" key={`${eachdata}${period}`}>
                              {eachdata[changeKeyName(period)] === null ||
                              eachdata[changeKeyName(period)] === undefined
                                ? null
                                : addComma(eachdata[changeKeyName(period)] / unit)}
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
        <EditAddSalesModal
          editModalSwitch={editModalSwitch}
          setEditModalSwitch={setEditModalSwitch}
          editData={selectedData}
          editDate={selectedDate}
          refreshSwitch={refreshSwitch}
          setRefreshSwitch={setRefreshSwitch}
          unit={unit}
        />
      ) : null}
    </div>
  );
}
