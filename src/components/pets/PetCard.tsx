import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import axios from 'axios';
import FavoriteFill from '../../assets/Favorite_fill.svg';

const InfoDetail = styled.div`
  margin-bottom: 0;
`;

interface PetInfo {
  id: number;
  desertionNo: number;
  name: number | string;
  age: string;
  sexCd: string;
  weight: string;
  kindCd: string;
  img: string;
  fav: boolean;
  favCnt: number;
  processState: string;
}

interface PetCardProps {
  pet: PetInfo;
}

function PetCard({ pet }: PetCardProps) {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  // const handleFavoriteClick = async () => {
  //   if (localStorage.getItem('userId') === null) {
  //     setIsFavorite(!isFavorite);
  //     return;
  //   }
  //   if (pet.fav === false) {
  //     axios
  //       .post(`/api/v1/bookmark`, {
  //         userId,
  //         petBoardId: pet.id,
  //       })
  //       .then((res) => console.log(res));
  //   } else {
  //     console.log('delete', isFavorite);
  //     axios.delete(`/api/v1/bookmark/${userId}`, {
  //       data: {
  //         userId,
  //         petBoardId: pet.id,
  //       },
  //     });
  //   }

  // await setIsFavorite(!isFavorite);
  // console.log(isFavorite);
  // if (isFavorite) {
  //   console.log('post', isFavorite);
  //   axios
  //     .post(`/api/v1/bookmark`, {
  //       userId,
  //       petBoardId: pet.id,
  //     })
  //     .then((res) => console.log(res));
  // } else {
  //   console.log('delete', isFavorite);
  //   axios.delete(`/api/v1/bookmark/${userId}`, {
  //     data: {
  //       userId,
  //       petBoardId: pet.id,
  //     },
  //   });
  // }
  // };

  useEffect(() => {}, [pet.fav]);

  return (
    <Card sx={{ width: '100%' }}>
      <CardActionArea onClick={() => navigate(`/detail/${pet.id}`)}>
        <CardMedia
          component="img"
          height="550"
          image={pet.img}
          alt={`${pet.img}`}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {pet.desertionNo ? (
              <>
                유기번호: [{pet.kindCd}]{pet.name}
              </>
            ) : (
              <>{pet.name}</>
            )}
            유기번호: {pet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <InfoDetail>분류: {pet.processState}</InfoDetail>
            <InfoDetail>나이: {pet.age}</InfoDetail>
            <InfoDetail>무게: {pet.weight}</InfoDetail>
            <InfoDetail>성별: {pet.sexCd}</InfoDetail>
            <InfoDetail>품종: {pet.kindCd}</InfoDetail>
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" color="text.secondary" component="div">
            <img src={FavoriteFill} alt="좋아요" />
            <span>{pet.favCnt}</span>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default PetCard;
