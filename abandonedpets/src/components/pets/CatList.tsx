import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import PetCard from './PetCard';
import SelectPage from './SelectPage';

const PetContainer = styled.div`
  max-width: 75%;
  width: 100%;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(3, 1fr); // 3개의 열
  gap: 20px;
  margin: 3% auto;

  @media screen and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr); // 2개의 열
  }

  @media screen and (max-width: 767px) {
    grid-template-columns: repeat(1, 1fr); // 1개의 열
  }
`;

interface PetInfo {
  id: number;
  desertionNo: number;
  filename: string;
  popfile: string;
  processState: string;
  age: string;
  weight: string;
  sexCd: string;
  kindCd: string;
  name: number | string;
  img: string;
  fav: boolean;
  favCnt: number;
}

interface SearchParams {
  categories: string | null;
  status: string | null;
  minAge: string | null;
  maxAge: string | null;
  title: string | null;
  isYoung: boolean | null;
  page: number | null;
  size: number | null;
}

function DogList({ searchParams }: { searchParams: SearchParams }) {
  // axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

  const [pets, setPets] = useState<PetInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPets = async (page: number, params: SearchParams) => {
      // console.log(params);
      try {
        const endpoint =
          Object.keys(params).length === 0
            ? `https://dogcatworld.site:8080/api/v1/pet_board/list/type/고양이?page=${page - 1}&size=12`
            : `https://dogcatworld.site:8080/api/v1/pet_board/search`;

        if (Object.keys(params).length === 0) {
          try {
            const response = await axios.get(endpoint, {
              headers: {
                access: localStorage.getItem('accessToken'),
              },
            });

            // console.log(`if문 내부 ${res}`, res);
            if (response.data && response.data.result) {
              // console.log(response.data.result);
              const petData = response.data.result.map((petBoard: any) => ({
                id: petBoard.petInfo.id,
                desertionNo: petBoard.petInfo.desertionNo,
                filename: petBoard.petInfo.filename,
                popfile: petBoard.petInfo.popfile,
                processState: petBoard.petInfo.processState,
                age: petBoard.petInfo.age,
                weight: petBoard.petInfo.weight,
                sexCd: petBoard.petInfo.sexCd,
                kindCd: petBoard.petInfo.kindCd,
                img: petBoard.petInfo.popfile || '이미지 없음',
                favCnt: petBoard.likeCount,
                name: petBoard.petInfo.desertionNo || petBoard.title,
              }));
              setPets(petData);
              setTotalPages(response.data.totalPages);
            } else {
              // console.error('Invalid response structure', response.data);
            }
          } catch (error) {
            // console.error('Error fetching pet data:', error);
          }
        } else {
          try {
            const response = await axios.get(endpoint, {
              params: {
                ...params,
                page: page - 1,
              },
              headers: {
                access: localStorage.getItem('accessToken'),
              },
            });

            if (response.data) {
              if (response.data.content.length === 0) {
                alert('검색 결과가 없습니다');
                return;
              }
              // console.log(response.data.result);
              const petData = response.data.content.map((petBoard: any) => ({
                id: petBoard.petInfo.id,
                desertionNo: petBoard.petInfo.desertionNo,
                filename: petBoard.petInfo.filename,
                popfile: petBoard.petInfo.popfile,
                processState: petBoard.petInfo.processState,
                age: petBoard.petInfo.age,
                weight: petBoard.petInfo.weight,
                sexCd: petBoard.petInfo.sexCd,
                kindCd: petBoard.petInfo.kindCd,
                img: petBoard.petInfo.popfile || '이미지 없음',
                favCnt: petBoard.likeCount,
                name: petBoard.petInfo.desertionNo || petBoard.title,
              }));
              setPets(petData);
              setTotalPages(response.data.totalPages);
            } else {
              console.error('Invalid response structure', response.data);
            }
          } catch (err) {
            console.log(err);
            alert('잘못된 검색입니다');
          }

          // console.log(`if문 내부 res ${res}`);
        }
      } catch (err) {
        // console.log(err);
      }
    };
    fetchPets(currentPage, searchParams).catch((error) => {
      console.error('Error fetching pet data:', error);
    });
  }, [currentPage, searchParams]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <PetContainer>
        {pets.map((pet, index) => (
          <PetCard key={index} pet={pet} />
        ))}
      </PetContainer>
      <SelectPage
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default DogList;
