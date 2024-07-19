import styled from 'styled-components';
import { Stomp } from '@stomp/stompjs';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import Send from '../../assets/Send.png';

const Wrapper = styled.div`
  width: 50%;
  position: relative;
`;

const SendBtn = styled.button`
  width: 100%;
  height: 2.3rem;
  background-color: #ffe7ce;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  font-weight: 500;

  &: hover {
    cursor: pointer;
    background-color: #ffdab9;
  }
`;

const SendIng = styled.img`
  width: 1em;
  height: 1em;
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translate(0%, -50%);
`;

function SendMessageBtn({ chatInfo }: any) {
  // axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

  // const [stompClient, setStompClient] = useState<Client | null>(null);
  // const [chatRoomId, setChatRoomId] = useState(2); // 예시로 chatRoomId 2 설정
  // const [receiverId, setReceiverId] = useState(1); // 예시로 receiverId 3 설정

  // const [chatRoomId, setChatRoomId] = useState();

  const userId = Number(localStorage.getItem('userId'));
  // const { id } = useParams<{ id: string }>(); // 게시글 상세정보 고유 id
  // console.log(id);

  // console.log(typeof Number(chatInfo.shelter.careNm));
  // dd
  const stompClient = useRef<any>(null);

  useEffect(() => {
    // useEffect로 소켓서버를 띄우지말고, 그냥 메세지 전송 버튼을 눌렀을 때, 동기처리하면 되지않을까?

    const connect = () => {
      // const socket = new WebSocket(`ws://localhost:8080/ws`);
      const socket = new WebSocket(`ws://dogcatworld.site:8080/ws`);
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, () => {
        // console.log('서버연결 성공');
        // 임시의 roomId = 1로 설정
        // stompClient.current.send(
        //   `/app/message`,
        //   {},
        //   JSON.stringify({
        //     // chatRoomId: 3,
        //     senderId: 1, // 로그인한 유저의 Id 저장
        //     chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
        //     receiverId: 1, // Number(chatInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
        //     message: '채팅방에 입장했습니다.',
        //     type: 'ENTER',
        //   }),
        // );
      });
    };

    connect();
  }, []);

  // // 테스트
  // const stompClient = useRef(null);

  // const connect = () => {
  //   const socket = new WebSocket(`ws://localhost:8080/ws`);
  //   stompClient.current = Stomp.over(socket);
  // };

  // // 웹소켓 연결 해제
  // const disconnect = () => {
  //   if (stompClient.current) {
  //     stompClient.current.disconnect();
  //   }
  // };

  // useEffect(() => {
  //   connect();

  //   return () => disconnect;
  // }, []);

  // // 테스트

  // useEffect(() => {
  //   const client = new Client({
  //     brokerURL: `ws://localhost:8080/ws`,
  //     onConnect: () => {
  //       console.log('서버 연결 성공');
  //     },
  //   });

  //   client.activate();
  //   setStompClient(client);

  //   return () => {
  //     client.deactivate();
  //   };
  // }, []);

  const connectToChat = async () => {
    if (stompClient) {
      const createRoom = async () => {
        // console.log(
        //   `보내는 쪽 데이터 senderId: ${userId}, chatRoomName: ${chatInfo.kindCd}, receiverId: ${Number(chatInfo.shelter.careNm)}, `,
        // );
        await stompClient.current.send(
          `/app/message`,
          {},
          JSON.stringify({
            // chatRoomId: 3,
            senderId: userId, // 로그인한 유저의 Id 저장
            chatRoomName: chatInfo.title, // 채팅방 이름은 게시글 이름
            receiverId: Number(chatInfo.petInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
            message: '채팅방에 입장했습니다.',
            type: 'ENTER',
          }),
        );
      };
      // 채팅방 입장 메시지 전송
      // stompClient.current.send(
      //   `/app/message`,
      //   {},
      //   JSON.stringify({
      //     // chatRoomId: 3,
      //     senderId: userId, // 로그인한 유저의 Id 저장
      //     chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
      //     receiverId: Number(chatInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
      //     message: '채팅방에 입장했습니다.',
      //     type: 'ENTER',
      //   }),
      // );

      // `/app/message`,
      // {},
      // JSON.stringify({
      //   senderId, // 로그인한 유저의 Id 저장
      //   chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
      //   receiverId: chatInfo.shelter.careNM, // 게시글을 작성한 유저의 Id
      //   message: '채팅방에 입장하였습니다.',
      //   type: 'ENTER',
      // }),

      // `/app/message`,
      // {},
      // JSON.stringify({
      //   // chatRoomId: 3, // 임시값: 채팅방 Id
      //   senderId, // 로그인한 유저의 Id 저장
      //   chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
      //   receiverId: chatInfo.shelter.careNM, // 게시글을 작성한 유저의 Id
      //   message: '채팅방에 입장하였습니다.',
      //   type: 'ENTER',
      // }),

      // 채팅방 생성하면 sendUser가 참여한 채팅방에서 receiveUser
      // 아이디를 뽑아서 TALK로 receiver 아이디를 넣어준다.
      // const loadChatRoomHistory = async () => {
      //   try {
      //     const response = await axios.get(
      //       `http://localhost:8080/api/v1/chatrooms/participants/${userId}`,
      //     );
      //     response.data.map((item) => {
      //       if (item.receiverId === Number(chatInfo.shelter.careNm)) {
      //         // roomId = item.chatRoomId;
      //         console.log(item.chatRoomId);
      //         // console.log(roomId);
      //         setChatRoomId(item.chatRoomId);
      //       }
      //       // return item.chatRoomId;
      //     });
      //     console.log(response);
      //   } catch (err) {
      //     console.log(err);
      //   }
      // };
      // loadChatRoomHistory();
      // // console.log(roomId);
      // console.log(chatRoomId);

      // // 받는 사람도 채팅방에 참여하는법
      // stompClient.current.send(
      //   `/app/message`,
      //   {},
      //   JSON.stringify({
      //     chatRoomId, // 여기에 receiver 아이디와 일치하는 채팅방 아이디를 넣어준다.
      //     senderId: Number(chatInfo.shelter.careNm), // Number(chatInfo.shelter.careNm), // 로그인한 유저의 Id 저장
      //     chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
      //     // receiverId: userId, // Number(chatInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
      //     message: '채팅 받는 사람 참가 완료',
      //     type: 'TALK',
      //   }),
      // );

      const loadChatRoomHistory = async () => {
        try {
          let roomId = 0;
          const response = await axios.get(
            `https://dogcatworld.site:8080/api/v1/chatrooms/participants/${userId}`,
          );
          // console.log(response.data);
          response.data.forEach((item: any) => {
            if (item.receiverId === Number(chatInfo.petInfo.shelter.careNm)) {
              // console.log(item.chatRoomId);
              roomId = item.chatRoomId;
              // setChatRoomId(item.chatRoomId);
            }
          });
          // console.log(`chatRoomid: ${chatRoomId}`);
          // console.log(`roomid: ${roomId}`);

          // After chatRoomId is set, send the second message
          if (roomId) {
            // console.log(
            //   `참가자 정보 chatRoomId: ${roomId}, senderId: ${Number(chatInfo.shelter.careNm)}, chatRoomName:${chatInfo.kindCd}, `,
            // );
            stompClient.current.send(
              `/app/message`,
              {},
              JSON.stringify({
                chatRoomId: roomId,
                senderId: Number(chatInfo.petInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
                chatRoomName: chatInfo.title, // 채팅방 이름은 게시글 이름
                message: '채팅방에 입장했습니다.',
                type: 'TALK',
              }),
            );
            alert('채팅방 생성 성공');
          } else console.log('받는 쪽 채팅 방 생성 실패');
        } catch (err) {
          console.log('채팅방 생성 실패');
          console.log(err);
        }
      };

      await createRoom();
      setTimeout(async () => {
        await loadChatRoomHistory();
      }, 2000);
    } else {
      // console.log('채팅방 만들기 데이터 전송 실패');
    }
  };

  // const connectToChat = async () => {
  //   if (stompClient) {
  //     const createRoom = () => {
  //       return new Promise((resolve, reject) => {
  //         try {
  //           stompClient.current.send(
  //             `/app/message`,
  //             {},
  //             JSON.stringify({
  //               senderId: userId, // 로그인한 유저의 Id 저장
  //               chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
  //               receiverId: Number(chatInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
  //               message: '채팅방에 입장했습니다.',
  //               type: 'ENTER',
  //             }),
  //           );
  //           resolve();
  //         } catch (error) {
  //           reject(error);
  //         }
  //       });
  //     };

  //     const loadChatRoomHistory = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:8080/api/v1/chatrooms/participants/${userId}`,
  //         );
  //         response.data.map((item) => {
  //           if (item.receiverId === Number(chatInfo.shelter.careNm)) {
  //             console.log(item.chatRoomId);
  //             setChatRoomId(item.chatRoomId);
  //           }
  //         });
  //         console.log(response);

  //         // After chatRoomId is set, send the second message
  //         stompClient.current.send(
  //           `/app/message`,
  //           {},
  //           JSON.stringify({
  //             chatRoomId, // Use the chatRoomId set from the response
  //             senderId: Number(chatInfo.shelter.careNm), // 게시글을 작성한 유저의 Id
  //             chatRoomName: chatInfo.kindCd, // 채팅방 이름은 게시글 이름
  //             message: '채팅 받는 사람 참가 완료',
  //             type: 'TALK',
  //           }),
  //         );
  //         alert('채팅방 생성 성공');
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };

  //     try {
  //       await createRoom(); // createRoom 함수가 완료될 때까지 기다립니다.
  //       await loadChatRoomHistory(); // loadChatRoomHistory 함수 실행
  //     } catch (error) {
  //       console.log('채팅방 만들기 데이터 전송 실패:', error);
  //     }
  //   } else {
  //     console.log('채팅방 만들기 데이터 전송 실패');
  //   }
  // };

  return (
    <Wrapper>
      <SendBtn onClick={connectToChat} type="button">
        메세지 보내기
      </SendBtn>
      <SendIng src={Send} alt="전송이미지" />
    </Wrapper>
  );
}

export default SendMessageBtn;
