import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ListItem from '../chat/ListItem';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 22px;
  width: 24em;
  height: 37em;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  padding: 16px;
`;

const InfoText = styled.span`
  font-size: 1.5em;
`;

const ListWrapper = styled.div`
  width: 100%;
  height: 530px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 10px 0;
  overflow-y: auto;
`;

interface ChatRoom {
  chatRoomId: number;
  receiverId: number;
  senderId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

interface Props {
  openChatRoom: (chatRoomId: number, chatRoomName: string) => void;
}

function ChatList({ openChatRoom }: Props) {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  const [chatRoomList, setChatRoomList] = useState<ChatRoom[]>();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const loadChatRoomHistory = async () => {
      try {
        const response = await axios.get(
          `/api/v1/chatrooms/participants/${userId}`,
          {
            headers: {
              access: localStorage.getItem('accessToken'),
            },
          },
        );
        if (
          response.data ===
          'User has no active chat rooms or has left all chat rooms.'
        ) {
          return;
        }
        const RoomList: ChatRoom[] = response.data.map((item: ChatRoom) => {
          return {
            chatRoomId: item.chatRoomId,
            receiverId: item.receiverId,
            senderId: item.senderId,
            name: item.name,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            deleted: item.deleted,
          } as ChatRoom;
        });
        setChatRoomList(RoomList);
      } catch (error) {
        console.error('채팅 내역 로드 실패', error);
        // setChatRoomList(response.data);
      }
    };
    loadChatRoomHistory();
  }, [userId]);

  const removeRoomHandler = (chatRoomId: number) => {
    setChatRoomList((prevChatRoomList) =>
      prevChatRoomList
        ? prevChatRoomList.filter((room) => room.chatRoomId !== chatRoomId)
        : prevChatRoomList,
    );
  };

  return (
    <ChatContainer>
      <header>
        <InfoText>채팅 목록</InfoText>
      </header>
      <ListWrapper>
        {chatRoomList ? (
          chatRoomList.map((chat, idx) => (
            <ListItem
              key={idx}
              chat={chat}
              openChatRoom={openChatRoom}
              onRemoveRoom={removeRoomHandler}
            />
          ))
        ) : (
          <div>채팅 목록 없음</div>
        )}
      </ListWrapper>
    </ChatContainer>
  );
}

export default ChatList;
