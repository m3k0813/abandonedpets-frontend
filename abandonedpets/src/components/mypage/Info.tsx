import styled from 'styled-components';

const Title = styled.h1`
  text-align: center;
`;

const Explan = styled.div`
  text-align: center;
  font-size: 0.875rem;
  color: #7b7b7b;
`;

function Info() {
  return (
    <div>
      <Title>마이페이지</Title>
      <Explan>
        마이페이지에서는 내가 관심등록한 목록과 작성한 글을 볼 수 있어요
      </Explan>
    </div>
  );
}

export default Info;
