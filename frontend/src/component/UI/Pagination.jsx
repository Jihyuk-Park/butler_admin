import React from 'react';
import ReactPagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { itemNumber } from '../commonVariable';
import './Pagenation.css';

export default function Pagination({ page, totalItem, setPage }) {
  return (
    <Box sx={{ mt: '25px' }}>
      <ReactPagination
        activePage={page}
        itemsCountPerPage={itemNumber}
        totalItemsCount={totalItem}
        pageRangeDisplayed={5}
        prevPageText="‹"
        firstPageText="‹‹"
        nextPageText="›"
        lastPageText="››"
        onChange={setPage}
      />
      <b>전체 {totalItem}</b> ({page} / {Math.ceil(totalItem / itemNumber)})
    </Box>
  );
}

Pagination.defaultProps = {
  page: 1,
  totalItem: 100,
  setPage: () => {},
};

Pagination.propTypes = {
  page: PropTypes.number,
  totalItem: PropTypes.number,
  setPage: PropTypes.func,
};
