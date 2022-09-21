import * as React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';
import PropTypes from 'prop-types';

const MyButton = styled(Button)({
  color: 'white',
  fontSize: '1.05rem',
  width: '180px',
  fontWeight: 400,
  marginBottom: '5px',
});

export default function NavBarButton({ name }) {
  return (
    <div>
      <MyButton>{name}</MyButton>
    </div>
  );
}

NavBarButton.defaultProps = {
  name: '버튼 이름을 입력해주세요',
};

NavBarButton.propTypes = {
  name: PropTypes.string,
};
