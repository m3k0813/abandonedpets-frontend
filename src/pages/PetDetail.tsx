import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Info from '../components/petDetail/Info';
import SendMessageBtn from '../components/petDetail/SendMessageBtn';
import FavoriteBtn from '../components/petDetail/FavoriteBtn';
import ImgList from '../components/petDetail/ImgList';

const BtnWrapper = styled.div`
  width: 25em;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
`;

interface ShelterInfo {
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  } | null;
  careNm: string;
  careTel: string;
  careAddr: string;
}

interface PetDetail {
  description: string;
  likeCount: number;
  liked: boolean;
  petBoardId: number;
  imageUrls: string[] | null;

  petInfo: {
    id: number;
    desertionNo: number;
    filename: string;
    happenDt: string;
    happenPlace: string;
    petType: string;
    kindCd: string;
    colorCd: string;
    age: string;
    weight: string;
    noticeNo: string;
    noticeSdt: string;
    noticeEdt: string;
    popfile: string;
    processState: string;
    sexCd: string;
    neuterYn: string;
    specialMark: string;
    shelter: ShelterInfo;
    publicApi: boolean;
  };

  status: string;
  title: string;
}

function PetDetail() {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

  const { id } = useParams<{ id: string }>();
  const [petDetail, setPetDetail] = useState<PetDetail | null>(null);
  const [isAdoption, setIsAdoption] = useState<boolean>(false);

  useEffect(() => {
    const fetchPetDetail = async () => {
      try {
        const res = localStorage.getItem('userId')
          ? await axios.get<PetDetail>(
              `/api/v1/pet_board/${id}?userId=${localStorage.getItem('userId')}`,
              {
                headers: {
                  access: localStorage.getItem('accessToken'),
                },
              },
            )
          : await axios.get<PetDetail>(`/api/v1/pet_board/${id}`);

        // const res = await axios.get(
        //   `/api/v1/pet_board/${id}?userid=${localStorage.getItem('userId')}`,
        // );

        // console.log(res.data);
        setPetDetail(res.data);
        setIsAdoption(res.data.petInfo.processState.includes('종료'));
      } catch (error) {
        // console.error('Error fetching pet details:', error);
      }
    };

    fetchPetDetail();
  }, [id]);

  if (!petDetail) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <Info petInfo={petDetail} petState={isAdoption} />
      <BtnWrapper>
        {petDetail.petInfo.publicApi ? null : (
          <SendMessageBtn chatInfo={petDetail} />
        )}
        <FavoriteBtn favInfo={petDetail} />
      </BtnWrapper>
      <ImgList images={petDetail} />
    </>
  );
}

export default PetDetail;
