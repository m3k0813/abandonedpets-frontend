import styled from 'styled-components';

const MessagesContainer = styled.div`
  height: 32em;
  overflow-y: auto;
  margin: 20px 0 10px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  max-width: 60%; /* 최대 너비를 설정하여 메시지가 너무 길어지지 않도록 함 */
  padding: 10px;
  font-size: 0.875em;
  border-radius: 8px;
  word-wrap: break-word; /* 단어가 박스를 넘지 않도록 함 */
`;

const SendMessage = styled(Message)`
  align-self: flex-end;
  background-color: #4784fb;
  color: #fff;
  border-radius: 8px 8px 0 8px;
`;

const ReceiveMessage = styled(Message)`
  align-self: flex-start;
  background-color: #e2e2e2;
  color: #000;
  border-radius: 8px 8px 8px 0;
`;

const InfoMessage = styled.div`
  font-size: 0.875em;
  text-align: center;
`;

interface ChatMessageResponse {
  chatRoomId: number;
  chatRoomName: string;
  senderId: number;
  receiverId: number;
  message: string;
  type: string;
  content: string;
}

interface Message {
  content: ChatMessageResponse[];
}

function Messages({ content }: Message) {
  // content.map((msg, idx) => {
  //   return console.log(msg);
  // });

  const userId = Number(localStorage.getItem('userId'));
  return (
    <MessagesContainer>
      {/* {content.map((msg, idx) => (
        if(msg.type === 'ENTER' || msg.type === 'LEAVE')
          return <InfoMessage>{msg.content}</InfoMessage>
          else if (msg.senderId === localStorage.getItem('userId'))
            <SendMessage>{msg.content}</SendMessage>
            else
            <ReceiveMessage>{msg.content}</ReceiveMessage>
      ))} */}

      {content.map((msg, idx) => {
        if (msg.type === 'ENTER' || msg.type === 'LEAVE') {
          return <InfoMessage key={idx}>{msg.message}</InfoMessage>;
        }
        if (msg.senderId === userId) {
          return <SendMessage key={idx}>{msg.message}</SendMessage>;
        }
        return <ReceiveMessage key={idx}>{msg.message}</ReceiveMessage>;
      })}
      {/* <SendMessage>안녕하세요 ddddddddddddddddddddddddddddddddd</SendMessage>
      <ReceiveMessage>
        네 안녕하세요! ddddddddddddddddddddddddddddddddd
      </ReceiveMessage>
      <ReceiveMessage>무슨일이세요?</ReceiveMessage>
      <InfoMessage>누가 들어왔습니다.</InfoMessage> */}
    </MessagesContainer>
  );
}

export default Messages;
