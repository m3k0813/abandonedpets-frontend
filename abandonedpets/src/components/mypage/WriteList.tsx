import styled from 'styled-components';
import Dog from '../../assets/sampleImg/Dog.png';
import FavoriteFill from '../../assets/Favorite_fill.svg';

const Wrapper = styled.div`
  border: 1px solid #f6d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  width: 60rem;
  height: 50rem;
  margin: 3% auto;
`;

const InfoContainer = styled.div`
  width: 95%;
  padding: 0.5rem;
  font-size: 1.2rem;
  font-weight: 900;
`;

const ListWrapper = styled.div`
  width: 95%;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(3, 1fr); //3개의 열
  gap: 20px;
  margin: 2% 0;
  overflow: auto;
`;

const ListItem = styled.div`
  width: 14rem;
  height: 14rem;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PetImg = styled.img`
  width: 9rem;
  height: 9rem;
`;

const PetInfo = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-evenly;
`;

const InfoDetail = styled.p`
  font-size: 1rem;
`;

const PetData = {
  pets: [
    {
      name: '강아지1',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지2',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지3',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지4',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지5',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지6',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지7',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지8',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지9',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
    {
      name: '강아지10',
      age: '2살',
      gender: '남',
      weight: '6kg',
      img: Dog,
      fav: FavoriteFill,
    },
  ],
};

function WriteList() {
  return (
    <Wrapper>
      <InfoContainer>내가 작성한 글</InfoContainer>
      <ListWrapper>
        {PetData.pets.map((pet) => (
          <ListItem>
            <PetImg src={pet.img} />
            <PetInfo key={pet.name}>
              <InfoDetail>{pet.name}</InfoDetail>
              <InfoDetail>{pet.age}</InfoDetail>
              <InfoDetail>{pet.gender}</InfoDetail>
              <InfoDetail>{pet.weight}</InfoDetail>
              <img src={pet.fav} />
            </PetInfo>
          </ListItem>
        ))}
      </ListWrapper>
    </Wrapper>
  );
}

export default WriteList;
