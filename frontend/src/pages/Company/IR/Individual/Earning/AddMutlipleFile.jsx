import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from '@mui/material';
import StyledTableCell from '../../../../../component/UI/StyledTableCell';
import StyledTableRow from '../../../../../component/UI/StyledTableRow';
import { YearArrayAuto } from '../../../../../component/commonFunction';
import DropDown from '../../../../../component/UI/DropDown';

export default function AddMutlipleFile({
  addMutlipleModalSwitch,
  setAddMutlipleModalSwitch,
  refreshSwitch,
  setRefreshSwitch,
  earningData,
}) {
  const { searchStockCode } = useParams();
  // 실적발표 목록
  const earningTable = ['파일 목록', '사업 연도', '분기'];

  // 파일 추가 시
  const [newFile, setNewFile] = useState([]);
  const fileInput = useRef();
  const [newFileText, setNewFileText] = useState([]);

  // 연도 및 분기 인풋
  const yearArray = YearArrayAuto(2000);
  const quarterArray = ['1', '2', '3', '4'];

  const addFile = () => {
    fileInput.current.click();
  };

  // 파일 다중 업로드
  const onChangeFile = e => {
    const uploadFiles = [...e.target.files];

    if (e.target.files) {
      const checkDuplicateFileArray = [];

      // 업로드한 파일들 및 기존 데이터들간에 이름 중복 검사
      uploadFiles.forEach(file => {
        const checkArray = earningData.filter(data => data.file_name === file.name);
        if (checkArray.length !== 0) {
          checkDuplicateFileArray.push(checkArray[0].file_name);
        }
      });

      if (checkDuplicateFileArray.length === 0) {
        setNewFile(e.target.files);

        const tempArray = [];
        uploadFiles.forEach(file => {
          tempArray.push({ name: file.name, bsns_year: '', quarter_id: '' });
        });
        setNewFileText(tempArray);
      } else {
        alert(`동일한 파일명이 존재합니다\n${checkDuplicateFileArray[0]}`);
      }
    }
  };

  const onChangeYear = (e, index) => {
    const tempArray = [...newFileText];
    tempArray[index].bsns_year = e.target.value;
    setNewFileText(tempArray);
  };

  const onChangeQuarter = (e, index) => {
    const tempArray = [...newFileText];
    tempArray[index].quarter_id = e.target.value;
    setNewFileText(tempArray);
  };

  const saveData = () => {
    if (newFile.length === 0) {
      alert('파일과 데이터를 추가해주세요');
    } else if (newFile.length === 1) {
      alert('하나의 파일은 개별 파일 추가를 이용해주세요');
    } else {
      // 추가할 데이터간 기간 중복 체크
      const checkDuplicateAddPeriod = [];
      newFileText.forEach(each => {
        if (each.bsns_year === '') {
          alert('연도를 입력해주세요');
        } else if (each.quarter_id === '') {
          alert('분기를 입력해주세요');
        } else {
          // 연도, 분기가 같은 데이터 개수 검사 (중복 없을 시 1개)
          const checkArray = newFileText.filter(
            data => data.bsns_year === each.bsns_year && data.quarter_id === each.quarter_id,
          );
          if (checkArray.length !== 1) {
            checkDuplicateAddPeriod.push(checkArray[0]);
          }
        }
      });

      if (checkDuplicateAddPeriod.length !== 0) {
        alert('입력한 데이터 내 중복된 기간이 있습니다');
      } else {
        // 입력한 연도, 분기에 기존 데이터가 있는지 검사 (중복 여부에 따라 DB 수정 혹은 추가)
        newFileText.forEach((each, index) => {
          const checkDuplicateOgPeriod = earningData.filter(
            data =>
              data.bsns_year === parseInt(each.bsns_year, 10) &&
              data.quarter_id === parseInt(each.quarter_id, 10),
          );

          let isDuplicate = 0;
          let deleteFileName = '';
          // 중복 기간이 있으므로 수정
          if (checkDuplicateOgPeriod.length !== 0) {
            isDuplicate = 1;
            deleteFileName = checkDuplicateOgPeriod[0].file_name;
          }
          const tempArray = [...newFileText];
          tempArray[index].isDuplicate = isDuplicate;
          tempArray[index].deleteFileName = deleteFileName;
          setNewFileText(tempArray);
        });

        // formData에 데이터 삽입
        const formData = new FormData();

        formData.append('stock_code', searchStockCode);
        formData.append('directory', '1. Earnings Release');
        for (let i = 0; i < newFileText.length; i += 1) {
          formData.append('bsns_year', newFileText[i].bsns_year);
          formData.append('quarter_id', newFileText[i].quarter_id);
          formData.append('file_name', newFile[i].name);
          formData.append('isDuplicate', newFileText[i].isDuplicate);
          formData.append('deleteFileName', newFileText[i].deleteFileName);
        }

        for (let i = 0; i < newFile.length; i += 1) {
          formData.append('files', newFile[i]);
        }
        // const body = JSON.stringify({ newFileText });

        axios.post(`/admin/company/ir/individual/add/multiple/earning`, formData).then(() => {
          alert('추가가 완료되었습니다');
          setRefreshSwitch(!refreshSwitch);
          modalClose();
        });
      }
    }
  };

  const modalClose = () => {
    setAddMutlipleModalSwitch(false);
    setRefreshSwitch(!refreshSwitch);
  };

  return (
    <div>
      <Modal open={addMutlipleModalSwitch} onClose={modalClose}>
        <Box
          sx={{
            width: 800,
            height: { lg: 550, xl: 650 },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflowY: 'scroll',
            bgcolor: '#F8F8F8',
            border: '1px solid #B8B8B8;',
            borderRadius: '4px',
            p: '40px 100px 40px 100px',
            outline: 'none',
          }}
        >
          <Typography
            component="div"
            align="center"
            color="#333333"
            fontSize="26px"
            fontWeight={600}
          >
            <Box sx={{ mb: '30px' }}>실적발표 파일 다중 추가</Box>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{ mb: '30px', maxHeight: { md: '400px', xl: '500px' } }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {earningTable.map(function (eachdata) {
                    return <StyledTableCell key={eachdata}>{eachdata}</StyledTableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {newFileText.map(function (each, index) {
                  return (
                    <StyledTableRow key={each.name}>
                      <StyledTableCell>{each.name}</StyledTableCell>
                      <StyledTableCell>
                        <DropDown
                          label=""
                          selectList={yearArray}
                          value={each.bsns_year}
                          onChange={e => onChangeYear(e, index)}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <DropDown
                          label=""
                          selectList={quarterArray}
                          value={each.quarter_id}
                          onChange={e => onChangeQuarter(e, index)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: '10px' }}>
            <Button variant="contained" color="secondary" onClick={addFile}>
              파일 추가하기
              <input
                type="file"
                multiple="multiple"
                hidden
                onChange={onChangeFile}
                ref={fileInput}
                accept="application/pdf"
              />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button variant="contained" onClick={saveData} sx={{ color: 'white', mr: '10px' }}>
              추가하기
            </Button>
            <Button variant="contained" color="secondary" onClick={modalClose}>
              취소
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

AddMutlipleFile.defaultProps = {
  addMutlipleModalSwitch: true,
  setAddMutlipleModalSwitch: () => {},
  refreshSwitch: true,
  setRefreshSwitch: () => {},
  earningData: [],
};

AddMutlipleFile.propTypes = {
  addMutlipleModalSwitch: PropTypes.bool,
  setAddMutlipleModalSwitch: PropTypes.func,
  refreshSwitch: PropTypes.bool,
  setRefreshSwitch: PropTypes.func,
  // eslint-disable-next-line
  earningData: PropTypes.array,
};
