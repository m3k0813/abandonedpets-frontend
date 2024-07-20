import React from 'react';
import styled from 'styled-components';

const TextArea = styled.div`
  width: 60%;
  margin: 3% auto;
  background-color: #ffefde;
  border-radius: 10px;
  min-height: 7em;
  padding: 15px;
  font-size: 1em;
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  text-align: center;
  white-space: pre-line; // \n 줄바꿈 적용
`;

interface DetailTextProps {
  specialMark: string;
}

const DetailText: React.FC<DetailTextProps> = ({ specialMark }) => {
  if (!specialMark) {
    return null;
  }

  return <TextArea>{specialMark}</TextArea>;
};

export default DetailText;
