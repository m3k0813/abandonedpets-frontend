import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Cookies } from 'react-cookie';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../assets/Logo.png';
import Chat from './modal/Chat';
import ChatList from './modal/ChatList';

const Wrapper = styled.div`
  width: 100%;

  background-color: #f9f0e7;
  border-bottom: solid 1px #b9b9b9;
  margin: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LogoImg = styled.img`
  height: 4.5em;
  margin-top: 0.4rem;
  margin-left: 1.2rem;

  &:hover {
    cursor: pointer;
  }
`;

const MenuBtn = styled.div`
  display: none;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 767px) {
    display: block;
    position: absolute;
    right: 24px;
    top: 16px;
    font-size: 24px;
  }
`;

const CategoryContainer = styled.ul<{ isopen: string }>`
  display: flex;

  @media screen and (max-width: 767px) {
    display: ${({ isopen }) => (isopen === 'true' ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 8px;
    padding: 0;
  }
`;

const Category = styled(Link)`
  font-family: pretendard;
  font-size: 1.25em;
  margin: 0 1.6rem;
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const AuthContainer = styled.div<{ isopen: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 1.6rem;

  @media screen and (max-width: 767px) {
    display: ${({ isopen }) => (isopen === 'true' ? 'flex' : 'none')};
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 0 0 0.5rem 0;
  }
`;

const AuthItem = styled(Link)`
  font-size: 1em;
  margin: 0 1.6rem;
  text-decoration: none;
  color: inherit;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const DropDown = styled.button`
  font-family: pretendard;
  font-size: 1.25em;
  margin: 0 1.6rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  border: none;
  background-color: transparent;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const DropDownMenu = styled.ul`
  display: block;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  list-style: none;
  background-color: #fff;
  padding: 0.5rem;
  z-index: 1; !important;


  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
`;

const DropDownList = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: inherit;
  font-size: 0.6em;

  &: hover {
    background-color: #c9c9c9;
  }
`;

const UserDropDownMenu = styled.ul`
  width: 5rem;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  top: 18%;
  left: 40%;
  transform: translate(-50%, 0);
  list-style: none;
  background-color: #fff;
  padding: 0.5rem;
  z-index: 1;

  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23);
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 22px;
  z-index: 10;
`;

const cookies = new Cookies();

export const logoutHandler = () => {
  // 변경된 부분
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('phone');
  cookies.remove('refreshToken', { path: '/' });
};

function NavBar() {
  const [isDropDown, setIsDropDown] = useState<boolean>(false); // navbar 드롭다운
  const [isUserDropDown, setIsUserDropDown] = useState<boolean>(false);
  // const [isLogin, setIsLogin] = useState<boolean>(false); // 로그인 여부 확인
  const [isLogin, setIsLogin] = useState<boolean>(
    localStorage.getItem('accessToken') !== null,
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // 메뉴 오픈 여부
  const [isChatListOpen, setIsChatListOpen] = useState<boolean>(false); // 채팅 리스트 open 확인
  const [isChatRoomOpen, setIsChatRoomOpen] = useState<boolean>(false); // 채팅 리스트에서 채팅 방 연결, 채팅방 open 확인
  const [currentTalk, setCurrentTalk] = useState<number | string>(); // 채팅방 Id 연결
  const [chatName, setchatName] = useState<string>('');

  const chatRoomLink = (talkId: number, name: string) => {
    // 채팅방 리스트에서 대화하기를 클릭하면 talkId는 chatRoomId 저장하고 있음
    // 이 talkId를 채팅방으로 전달
    setCurrentTalk(talkId);
    setchatName(name);
    setIsChatRoomOpen(true);
  };

  const ChatRoomClose = () => {
    setIsChatRoomOpen(false);
    setCurrentTalk('');
  };

  const logOutHandler = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('phone');
    cookies.remove('refreshToken', { path: '/' });
    setIsLogin(false);
  };

  return (
    <>
      <Wrapper>
        <MenuBtn onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuIcon />
        </MenuBtn>
        <Link to="/">
          <LogoImg src={Logo} alt="메인로고" />
        </Link>
        <CategoryContainer isopen={isMenuOpen.toString()}>
          <DropDown
            type="button"
            onMouseEnter={() => setIsDropDown(true)}
            onMouseLeave={() => setIsDropDown(false)}
          >
            입양/분양
            {isDropDown ? (
              <DropDownMenu>
                <DropDownList to="/dog">강아지</DropDownList>
                <DropDownList to="/cat">고양이</DropDownList>
              </DropDownMenu>
            ) : null}
          </DropDown>
          <Category to="/shelter">인근 보호소</Category>
          <Category to="/funeral">장례식장</Category>
        </CategoryContainer>

        {isLogin ? (
          <AuthContainer isopen={isMenuOpen.toString()}>
            <IconButton
              sx={{ position: 'relative' }}
              onMouseEnter={() => setIsUserDropDown(true)}
              onMouseLeave={() => setIsUserDropDown(false)}
            >
              <PersonIcon fontSize="medium" />
              {isUserDropDown ? (
                <UserDropDownMenu>
                  <DropDownList to="/mypage">마이페이지</DropDownList>
                  <DropDownList to="/" onClick={logOutHandler}>
                    로그아웃
                  </DropDownList>
                </UserDropDownMenu>
              ) : (
                ''
              )}
            </IconButton>
          </AuthContainer>
        ) : (
          <AuthContainer isopen={isMenuOpen.toString()}>
            <AuthItem to="/login">로그인</AuthItem>
            <AuthItem to="/signup">회원가입</AuthItem>
          </AuthContainer>
        )}
      </Wrapper>
      {isLogin ? (
        <ChatContainer>
          {isChatListOpen &&
            (isChatRoomOpen ? (
              <Chat
                talkId={currentTalk}
                close={ChatRoomClose}
                roomName={chatName}
              />
            ) : (
              <ChatList openChatRoom={chatRoomLink} />
            ))}
          <Fab
            color="primary"
            onClick={() => setIsChatListOpen(!isChatListOpen)}
          >
            {isChatListOpen ? <CloseIcon /> : <ChatIcon />}
          </Fab>
        </ChatContainer>
      ) : null}
    </>
  );
}

export default NavBar;
