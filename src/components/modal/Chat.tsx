import styled from 'styled-components';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import InfoBar from '../chat/InfoBar';
import Messages from '../chat/Messges';
import Input from '../chat/Input';

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

interface ChatProps {
  talkId: number | string | undefined; // 채팅방 고유 id
  close: () => void;
  roomName: string;
}

// interface ChatMessageReqeust {
//   chatRoomId: number;
//   chatRoomName: string;
//   senderId: number;
//   message: string;
//   type: string;
// }
interface ChatMessageResponse {
  chatRoomId: number;
  chatRoomName: string;
  senderId: number;
  receiverId: number;
  message: string;
  type: string;
  content: string;
}

function Chat({ talkId, close, roomName }: ChatProps) {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);

  // console.log(roomName);

  const stompClient = useRef<any>(null);

  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await axios.get(
          `/api/v1/chatrooms/not-use-redis/messages/${talkId}`,
          {
            headers: {
              access: localStorage.getItem('accessToken'),
            },
          },
        );
        // console.log(response);
        const message = response.data as ChatMessageResponse[];
        setMessages(message);
      } catch (error) {
        // console.error('채팅 내역 로드 실패', error);
      }
    };

    loadChatHistory();

    const connect = () => {
      // const socket = new WebSocket(`ws://localhost:8080/ws`);
      // const socket = new WebSocket(`wss://api.dogcatworld.site/ws`);
      const socket = new WebSocket(`wss://dogcatworld.site/ws`);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        console.log('서버 연결 성공');
        stompClient.current.subscribe(
          `/topic/chat/room/${talkId}`,
          (message: any) => {
            const newMessage = JSON.parse(message.body) as ChatMessageResponse;
            setMessages((prevMessage) => [...prevMessage, newMessage]);
          },
        );
      });
    };

    connect();

    // const client = new Client({
    //   brokerURL: 'ws://localhost:8080/ws', // 서버 WebSocket URL
    //   reconnectDelay: 5000,
    //   onConnect: () => {
    //     client.subscribe(`/topic/chat/rooms/${talkId}`, (message: IMessage) => {
    //       const msg: ChatMessageResponse = JSON.parse(message.body);
    //       setMessages((prevMessages) => [...prevMessages, msg]);
    //     });
    //   },
    // });
    // client.activate();
    // setStompClient(client);

    // 웹 소켓 연결 해제
    // return () => {
    //   client.deactivate();
    // };
  }, [talkId]);

  const sendMessage = (message: string) => {
    // console.log(message);
    if (stompClient.current && message) {
      // console.log(
      //   `chatRoonId${talkId}, chatRoomName${roomName}, senderId:${userId}, message: ${message}, `,
      // );

      // 여기서부터 126까지
      stompClient.current.send(
        '/app/message',
        {},
        JSON.stringify({
          chatRoomId: talkId,
          chatRoomName: roomName,
          senderId: userId,
          message,
          type: 'TALK',
        }),
      );
    } else alert('메세지 전송 실패');

    // console.log(message);  // 입력 메세지 전달 확인

    // if (stompClient && newMessage) {
    //   const chatMessage: ChatMessageReqeust = {
    //     chatRoomId: talkId,
    //     chatRoomName: roomName,
    //     senderId: userId,
    //     message: newMessage,
    //     type: 'TALK',
    //   };
    //   stompClient.publish({
    //     destination: `/app/message`,
    //     body: JSON.stringify(chatMessage),
    //   });
    //   console.log(messages);
    //   // setNewMessage('');
    // }
  };

  return (
    <ChatContainer>
      <InfoBar close={close} roomName={roomName} />
      <Messages content={messages} />
      <Input sendMessage={sendMessage} />
    </ChatContainer>
  );
}

export default Chat;
