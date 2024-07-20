import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { logoutHandler } from '../NavBar.tsx';
import Dog from '../../assets/sampleImg/Dog.png';

const styles = {
  main: {
    padding: '2rem',
  } as React.CSSProperties,
  section: {
    display: 'flex',
  } as React.CSSProperties,
  sidebar: {
    width: '25%',
    height: 'auto', // 높이를 자동으로 설정
    maxHeight: '715px', // 최대 높이를 설정하여 작게 조정
    backgroundColor: '#ffffff',
    padding: '1rem',
    marginRight: '2rem',
    border: '1px solid #d1d5db', // Add border
    borderRadius: '0.25rem', // Optional: to add rounded corners
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  profileImage: {
    width: '6rem',
    height: '6rem',
    backgroundColor: '#d1d5db',
    borderRadius: '50%',
    margin: '0 auto 1rem auto',
  } as React.CSSProperties,
  textCenter: {
    textAlign: 'center',
  } as React.CSSProperties,
  textLarge: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
  textSmall: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '2rem',
  } as React.CSSProperties,
  textGray: {
    color: '#6b7280',
  } as React.CSSProperties,
  buttonGroup: {
    marginTop: 'auto',
  } as React.CSSProperties,
  contentArea: {
    width: '75%',
  } as React.CSSProperties,
  contentBox: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    marginBottom: '2rem',
    border: '1px solid #d1d5db', // Add border
    borderRadius: '0.25rem', // Optional: to add rounded corners
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  } as React.CSSProperties,
  title: {
    fontSize: '1.25rem',
    marginBottom: '1rem',
  } as React.CSSProperties,
};

interface BookmarkProps {
  id: number;
  petBoard: {
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

function FavoriteList() {
  const [currentPagePosts, setCurrentPagePosts] = useState(0);
  const [currentPageBookmarks, setCurrentPageBookmarks] = useState(0);
  const [bookmarks, setBookmarks] = useState<BookmarkProps[]>([]);
  const [myPetBoard, setmypetBoard] = useState<MypetBoardProps[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserProps | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedUserInfo, setEditedUserInfo] = useState<UserProps | null>(null);
  const navigate = useNavigate();
  const itemsPerPage = 3;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setUser(userId);
    if (!userId) {
      console.error('No user ID found in local storage');
      return;
    }

    // 유저 정보 가져오기
    (async () => {
      try {
        const userRes = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}`,
        );
        if (userRes.data.status === 'OK') {
          setUserInfo(userRes.data.result);
          setEditedUserInfo(userRes.data.result);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    })();

    // 북마크 정보 가져오기
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/bookmark/${userId}`,
        );

        if (res.data.status === 'OK') {
          setBookmarks(res.data.result);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    })();

    // 게시글 정보 가져오기
    (async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/pet_board/myPetBoard/${userId}`,
        );
        setmypetBoard(res.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
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
        const res = await axios.put(
          `http://localhost:8080/api/v1/users/${user}`,
          editedUserInfo,
        );
        if (res.data.status === 'OK') {
          alert('회원 정보가 수정되었습니다.');
          setUserInfo(editedUserInfo);
        }
      } catch (error) {
        console.error('Failed to edit profile', error);
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
      const res = await axios.delete(
        `http://localhost:8080/api/v1/users/${user}`,
      );
      if (res.data.status === 'OK') {
        alert('회원 탈퇴가 완료되었습니다.');
        logoutHandler(); // 로그아웃 처리
        navigate('/'); // 메인 홈으로 이동
      }
    } catch (error) {
      console.error('Failed to delete account', error);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/detail/${id}`);
  };

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <div style={styles.sidebar}>
          <div>
            <div style={styles.profileImage} />
            {userInfo && ( // 수정된 부분: 조건부 렌더링 추가 및 간격 조정
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
                    <h3
                      style={{
                        ...styles.textCenter,
                        ...styles.textLarge,
                        margin: '32px 0',
                      }}
                    >
                      {userInfo.username}
                    </h3>
                    <p
                      style={{
                        ...styles.textCenter,
                        ...styles.textSmall,
                        margin: '32px 0',
                      }}
                    >
                      {userInfo.email}
                    </p>
                    <p
                      style={{
                        ...styles.textCenter,
                        ...styles.textSmall,
                        margin: '32px 0',
                      }}
                    >
                      {userInfo.phoneNum}
                    </p>
                  </>
                )}
              </>
            )}
          </div>

          <div style={styles.buttonGroup}>
            {isEditing ? (
              <>
                <div
                  style={{
                    ...styles.textCenter,
                    ...styles.textSmall,
                    ...styles.textGray,
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                  }}
                >
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
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    ...styles.textCenter,
                    ...styles.textSmall,
                    ...styles.textGray,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    alignItems: 'center',
                  }}
                >
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
                </div>
              </>
            )}
          </div>
        </div>
        <div style={styles.contentArea}>
          <div style={styles.contentBox}>
            <h3 style={styles.title}>내 작성 글</h3>
            <div style={styles.grid}>
              {currentItemsPosts.length > 0 ? (
                currentItemsPosts.map((post, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Card
                      sx={{ maxWidth: 250 }}
                      onClick={() => handleCardClick(post.petBoardId)}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={post.petInfo ? post.petInfo.popfile : Dog}
                          alt={post.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {post.title}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </div>
                ))
              ) : (
                <p style={styles.textCenter}>작성한 글이 없습니다.</p>
              )}
            </div>
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
          </div>
          <div style={styles.contentBox}>
            <h3 style={styles.title}>북마크</h3>
            <div style={styles.grid}>
              {currentItemsBookmarks.length > 0 ? (
                currentItemsBookmarks.map((bookmark, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <Card
                      sx={{ maxWidth: 250 }}
                      onClick={() => handleCardClick(bookmark.id)}
                    >
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="140"
                          image={bookmark.petBoard.popfile}
                          alt={bookmark.petBoard.title}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {bookmark.petBoard.title}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </div>
                ))
              ) : (
                <p style={styles.textCenter}>북마크한 글이 없습니다.</p>
              )}
            </div>
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
          </div>
        </div>
      </section>
    </main>
  );
}
export default FavoriteList;
