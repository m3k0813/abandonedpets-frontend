import styled from 'styled-components';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const InfoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const InfoText = styled.div`
  width: 16em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1em;
`;

function InfoBar({ close, roomName }: any) {
  return (
    <InfoContainer>
      <Button
        sx={{
          position: 'absolute',
          left: 0,
        }}
        size="small"
        onClick={close}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </Button>
      <InfoText>{roomName}</InfoText>
    </InfoContainer>
  );
}

export default InfoBar;
