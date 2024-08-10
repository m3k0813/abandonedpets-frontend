import styled from 'styled-components';
import Button from '@mui/material/Button';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';

const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #d9d9d9;
`;

const ChatRoomName = styled.div`
  width: 12rem;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BtnContainer = styled.div`
  display: flex;
  gap: 10px;
`;

interface ListProps {
  chat: {
    chatRoomId: number;
    name: string;
  };
  // openRoom: any;
  openChatRoom: (chatRoomId: number, chatRoomName: string) => void;
  onRemoveRoom: (chatRoomId: number) => void;
}

function ListItem({ chat, openChatRoom, onRemoveRoom }: ListProps) {
  // console.log(chat);

  const stompClient = useRef<Stomp | any>(null);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const connect = () => {
      // const socket = new WebSocket(`ws://localhost:8080/ws`);
      // const socket = new WebSocket(`wss://api.dogcatworld.site/ws`);
      const socket = new WebSocket(`wss://dogcatworld.site/ws`);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        console.log('채팅 서버 연결 완료');
      });
    };

    connect();
  }, []);

  const removeRoomHandler = () => {
    if (stompClient.current) {
      stompClient.current.send(
        '/app/message',
        {},
        JSON.stringify({
          chatRoomId: chat.chatRoomId,
          chatRoomName: chat.name,
          senderId: userId,
          type: 'LEAVE',
        }),
      );
    }
    onRemoveRoom(chat.chatRoomId);
  };

  return (
    <List>
      <ChatRoomName>{chat.name}</ChatRoomName>
      <BtnContainer>
        <Button
          variant="outlined"
          size="small"
          onClick={() => openChatRoom(chat.chatRoomId, chat.name)}
          sx={{ minWidth: 67, fontSize: '0.875em' }}
        >
          채팅하기
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={removeRoomHandler}
          sx={{ minWidth: 67, fontSize: '0.875em' }}
        >
          삭제하기
        </Button>
      </BtnContainer>
    </List>
  );
}

export default ListItem;
