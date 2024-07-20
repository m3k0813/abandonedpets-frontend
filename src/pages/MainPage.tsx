import styled from 'styled-components';
import Header from '../components/NavBar';
import Footer from '../components/Footer';
import Dog from '../assets/MainDog.png';

const FullWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;

const Wrapper = styled.div`
  height: auto;
  min-height: 100%;
`;

const ExplanContainer = styled.div`
  height: 40rem;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1023px) {
    flex-direction: column;
  }
`;

const ExplanHeader = styled.p`
  font-size: 2.5em;
`;

const Explan = styled.p`
  font-size: 2em;
`;

const ExplanImg = styled.img`
  height: 18.75rem;
`;

function MainPage() {
  return (
    <FullWrapper>
      <Wrapper>
        <Header />
        <ExplanContainer>
          <div>
            <ExplanHeader>반려동물 사지말고 입양하세요</ExplanHeader>
            <Explan>유기동물의 가족이 되어주세요</Explan>
            <Explan>입양,분양부터 장례까지 정보를 제공합니다.</Explan>
          </div>

          <ExplanImg src={Dog} alt="강아지 이미지" />
        </ExplanContainer>
      </Wrapper>

      <Footer />
    </FullWrapper>
  );
}

export default MainPage;
