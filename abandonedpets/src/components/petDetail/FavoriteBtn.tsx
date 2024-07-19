import { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import Favorite from '../../assets/Favorite.svg';
import FavoriteFill from '../../assets/Favorite_fill.svg';

interface PetDetail {
  description: string;
  likeCount: number;
  liked: boolean;
  petBoardId: number;

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
    shelter: {
      name: string;
      coordinate: {
        latitude: number;
        longitude: number;
      } | null;
      careNm: string;
      careTel: string;
      careAddr: string;
    };
    publicApi: boolean;
  };

  status: string;
  title: string;
}

interface InfoProps {
  favInfo: PetDetail;
}

function FavoriteBtn({ favInfo }: InfoProps) {
  const favorite = favInfo;
  const [isFavorite, setIsFavorite] = useState<boolean>(favorite.liked); // 북마크 여부 true/false
  const [favCnt, setFavCnt] = useState<number>(favInfo.likeCount);
  const userId = localStorage.getItem('userId');

  const favBtnClickHandler = () => {
    if (localStorage.getItem('userId') === null) {
      setIsFavorite(!isFavorite);
      return;
    }

    if (isFavorite) {
      axios
        .delete(`https://dogcatworld.site:8080/api/v1/bookmark`, {
          data: {
            userId,
            petBoardId: favorite.petBoardId,
          },

          headers: {
            access: localStorage.getItem('accessToken'),
          },
        })
        .then(() => {
          setIsFavorite(!isFavorite);
          setFavCnt(favCnt - 1);
        });
    } else {
      axios
        .post(
          `https://dogcatworld.site:8080/api/v1/bookmark`,
          {
            userId,
            petBoardId: favorite.petBoardId,
          },
          {
            headers: {
              access: localStorage.getItem('accessToken'),
            },
          },
        )
        .then(() => {
          setIsFavorite(!isFavorite);
          setFavCnt(favCnt + 1);
        });
    }
  };

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

  return (
    <Button onClick={favBtnClickHandler} variant="outlined">
      {isFavorite ? <img src={FavoriteFill} /> : <img src={Favorite} />}
      <span>{favCnt}</span>
    </Button>
  );
}

export default FavoriteBtn;
