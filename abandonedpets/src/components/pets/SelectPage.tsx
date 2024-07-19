import React from 'react';
import styled from 'styled-components';
import Pagination from '@mui/material/Pagination';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3%;
`;

interface SelectPageProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

function SelectPage({ count, page, onChange }: SelectPageProps) {
  return (
    <Wrapper>
      <Pagination
        count={count}
        page={page}
        color="primary"
        size="medium"
        onChange={onChange}
      />
    </Wrapper>
  );
}

export default SelectPage;
