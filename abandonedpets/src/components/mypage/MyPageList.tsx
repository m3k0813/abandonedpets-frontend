import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardActionArea, CardActions } from '@mui/material';
import { logoutHandler } from '../NavBar.tsx';
import Dog from '../../assets/sampleImg/Dog.png';
import Favorite from '../../assets/Favorite.svg';
import FavoriteFill from '../../assets/Favorite_fill.svg';

const Main = styled.main`
  padding: 1rem; /* Padding reduced */
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  height: 100vh; /* Full viewport height */
  background-color: #ffffff;
  padding: 1rem;
  margin-bottom: 1rem; /* Margin reduced */
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (min-width: 768px) {
    width: 25%;
    margin-right: 1rem; /* Margin reduced */
    margin-bottom: 0;
    height: 100vh; /* Full viewport height for larger screens */
  }
`;

const ProfileImage = styled.div`
  width: 12em;
  height: 12em;
  background-color: #d1d5db;
  border-radius: 50%;
  margin: 0 auto 5rem auto;
`;

const TextLarge = styled.h3`
  font-size: 1.5em; /* Increased font size */
  margin-bottom: 3em; /* Increased margin */
  text-align: center;
`;

const TextSmall = styled.p`
  font-size: 1em; /* Increased font size */
  color: #6b7280;
  margin-bottom: 3em; /* Increased margin */
  text-align: center;
`;

const ButtonGroup = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Gap reduced */
  align-items: center;
  margin-bottom: 10px; /* Margin reduced */
`;

const ContentArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    width: 75%;
  }
`;

const ContentBox = styled.div`
  background-color: #ffffff;
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Grid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem; /* Gap reduced */

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Title = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem; /* Margin reduced */
`;

interface BookmarkProps {
  id: number;
  petBoard: {
    petBoardId: number;
    title: string;
    popfile: string;
  };
}

interface UserProps {
  id: number;
  username: string;
  email: string;
  phoneNum: string;
}

interface MypetBoardProps {
  petBoardId: number;
  title: string;
  petInfo: {
    popfile: string;
  } | null;
}

function MyPageList() {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

  const [currentPagePosts, setCurrentPagePosts] = useState(0);
  const [currentPageBookmarks, setCurrentPageBookmarks] = useState(0);
  const [bookmarks, setBookmarks] = useState<BookmarkProps[]>([]);
  const [myPetBoard, setmypetBoard] = useState<MypetBoardProps[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUserInfo, setEditedUserInfo] = useState<UserProps | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const navigate = useNavigate();
  const itemsPerPage = 3;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUser(userId);
    if (!userId) {
      // console.error('No user ID found in local storage');
      return;
    }

    // 유저 정보 가져오기
    (async () => {
      try {
        const userRes = await axios.get(`/api/v1/users/${userId}`, {
          headers: {
            access: localStorage.getItem('accessToken'),
          },
        });
        if (userRes.data.status === 'OK') {
          setUserInfo(userRes.data.result);
          setEditedUserInfo(userRes.data.result);
        }
      } catch (error) {
        // console.error('Failed to fetch user data', error);
      }
    })();

    // 북마크 정보 가져오기
    (async () => {
      try {
        const res = await axios.get(`/api/v1/bookmark/${userId}`, {
          headers: {
            access: localStorage.getItem('accessToken'),
          },
        });

        if (res.data.status === 'OK') {
          setBookmarks(res.data.result);
        }
      } catch (error) {
        // console.error('Failed to fetch data', error);
      }
    })();

    // 게시글 정보 가져오기
    (async () => {
      try {
        const res = await axios.get(`/api/v1/pet_board/myPetBoard/${userId}`, {
          headers: {
            access: localStorage.getItem('accessToken'),
          },
        });
        setmypetBoard(res.data);
      } catch (error) {
        // console.error('Failed to fetch posts', error);
      }
    })();
  }, []);

  const handlePrevPagePosts = () => {
    setCurrentPagePosts((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPagePosts = () => {
    setCurrentPagePosts((prev) =>
      Math.min(prev + 1, Math.floor(myPetBoard.length / itemsPerPage)),
    );
  };

  const handlePrevPageBookmarks = () => {
    setCurrentPageBookmarks((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPageBookmarks = () => {
    setCurrentPageBookmarks((prev) =>
      Math.min(prev + 1, Math.floor(bookmarks.length / itemsPerPage)),
    );
  };

  const currentItemsPosts = myPetBoard.slice(
    currentPagePosts * itemsPerPage,
    (currentPagePosts + 1) * itemsPerPage,
  );

  const currentItemsBookmarks = bookmarks.slice(
    currentPageBookmarks * itemsPerPage,
    (currentPageBookmarks + 1) * itemsPerPage,
  );

  const handleEditProfile = async () => {
    if (isEditing) {
      if (!user) return;

      try {
        const res = await axios.put(`/api/v1/users/${user}`, editedUserInfo, {
          headers: {
            access: localStorage.getItem('accessToken'),
          },
        });
        if (res.data.status === 'OK') {
          alert('회원 정보가 수정되었습니다.');
          setUserInfo(editedUserInfo);
        }
      } catch (error) {
        // console.error('Failed to edit profile', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUserInfo((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUserInfo(userInfo);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      const res = await axios.delete(`/api/v1/users/${user}`, {
        headers: {
          access: localStorage.getItem('accessToken'),
        },
      });
      if (res.data.status === 'OK') {
        alert('회원 탈퇴가 완료되었습니다.');
        logoutHandler(); // 로그아웃 처리
        navigate('/'); // 메인 홈으로 이동
      }
    } catch (error) {
      // console.error('Failed to delete account', error);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  const handleDeletePost = async (petBoardId: number) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (!confirmDelete) {
      return;
    }

    try {
      console.log(`Attempting to delete post with id: ${petBoardId}`);
      const res = await axios.delete(`/api/v1/pet_board/${petBoardId}`, {
        headers: {
          access: localStorage.getItem('accessToken'),
        },
      });
      console.log('Delete response:', res);
      if (res.status === 200 && res.data === '게시물 삭제에 성공하였습니다.') {
        alert('게시글이 삭제되었습니다.');
        setmypetBoard((prev) => {
          const updatedList = prev.filter(
            (post) => post.petBoardId !== petBoardId,
          );
          console.log('Updated List:', updatedList);
          return updatedList;
        });
        console.log(`Deleted post with id: ${petBoardId}`);
      } else {
        console.error('Failed to delete post', res.data);
        alert('삭제하는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Failed to delete post', error);
      alert('삭제하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const deleteBookMarkHandler = (petBoardId: number) => {
    const confirmDelete = window.confirm('북마크를 취소하시겠습니까??');

    if (!confirmDelete) {
      return;
    }

    axios
      .delete(`/api/v1/bookmark`, {
        data: {
          userId: user,
          petBoardId,
        },

        headers: {
          access: localStorage.getItem('accessToken'),
        },
      })
      .then(() => {
        setIsFavorite(!isFavorite);
        alert('북마크 삭제에 성공했습니다.');
        setBookmarks((prev) => {
          const updatedList = prev.filter(
            (post) => post.petBoard.petBoardId !== petBoardId,
          );
          console.log('Updated List:', updatedList);
          return updatedList;
        });
      });
  };

  return (
    <Main>
      <Section>
        <Sidebar>
          <div>
            <ProfileImage />
            {userInfo && (
              <>
                {isEditing ? (
                  <>
                    <TextField
                      label="이름"
                      name="username"
                      value={editedUserInfo?.username}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="이메일"
                      name="email"
                      value={editedUserInfo?.email}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="전화번호"
                      name="phoneNum"
                      value={editedUserInfo?.phoneNum}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                  </>
                ) : (
                  <>
                    <TextLarge>{userInfo.username}</TextLarge>
                    <TextSmall>{userInfo.email}</TextSmall>
                    <TextSmall>{userInfo.phoneNum}</TextSmall>
                  </>
                )}
              </>
            )}
          </div>

          <ButtonGroup>
            {isEditing ? (
              <>
                <Button variant="outlined" onClick={handleEditProfile}>
                  저장
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelEdit}
                >
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={handleEditProfile}>
                  회원정보수정
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteAccount}
                >
                  회원탈퇴
                </Button>
              </>
            )}
          </ButtonGroup>
        </Sidebar>
        <ContentArea>
          <ContentBox>
            <Title>내 작성 글</Title>
            <Grid>
              {currentItemsPosts.length > 0 ? (
                currentItemsPosts.map((post, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Card
                      sx={{ width: '100%' }}
                      onClick={() => handleCardClick(post.petBoardId)}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="200"
                          image={post.petInfo ? post.petInfo.popfile : Dog}
                          alt={post.title}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{
                              fontSize: '1.2em',
                            }}
                          >
                            {post.title}
                          </Typography>
                          <IconButton
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePost(post.petBoardId);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', marginTop: '5rem' }}>
                  작성한 글이 없습니다.
                </p>
              )}
            </Grid>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Button
                onClick={handlePrevPagePosts}
                disabled={currentPagePosts === 0}
              >
                이전
              </Button>
              <Button
                onClick={handleNextPagePosts}
                disabled={
                  (currentPagePosts + 1) * itemsPerPage >= myPetBoard.length
                }
              >
                다음
              </Button>
            </div>
          </ContentBox>
          <ContentBox>
            <Title>북마크</Title>
            <Grid>
              {currentItemsBookmarks.length > 0 ? (
                currentItemsBookmarks.map((bookmark, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Card sx={{ width: '100%' }}>
                      <CardActionArea
                        onClick={() =>
                          handleCardClick(bookmark.petBoard.petBoardId)
                        }
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={bookmark.petBoard.popfile}
                          alt={bookmark.petBoard.title}
                        />
                        <CardContent>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            sx={{ fontSize: '1.2em' }}
                          >
                            {bookmark.petBoard.title}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button
                          onClick={() =>
                            deleteBookMarkHandler(bookmark.petBoard.petBoardId)
                          }
                        >
                          {isFavorite ? (
                            <img src={FavoriteFill} />
                          ) : (
                            <img src={Favorite} />
                          )}
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', marginTop: '5rem' }}>
                  북마크한 글이 없습니다.
                </p>
              )}
            </Grid>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Button
                onClick={handlePrevPageBookmarks}
                disabled={currentPageBookmarks === 0}
              >
                이전
              </Button>
              <Button
                onClick={handleNextPageBookmarks}
                disabled={
                  (currentPageBookmarks + 1) * itemsPerPage >= bookmarks.length
                }
              >
                다음
              </Button>
            </div>
          </ContentBox>
        </ContentArea>
      </Section>
    </Main>
  );
}

export default MyPageList;
