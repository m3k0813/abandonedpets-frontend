import { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';

const FormWrapper = styled.form`
  width: 60%;
  margin: 3rem auto 5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
`;

const FromHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const Title = styled.div`
  width: 100%;
  min-width: 300px;
  font-size: 2em;
  font-weight: 900;
  display: flex;
  justify-content: center;
`;

const LeftContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BtnContainer = styled.div`
  width: 17em;
  border: 1px solid #ffbe57;
  margin-bottom: 0.25rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
`;

// 버튼 스타일 - 선택 여부에 따라 동적 스타일 적용
const StyledButton = styled.button<{ choice: boolean }>`
  width: 49.45%;
  height: 100%;
  border: none;
  border-radius: 5px;
  color: #000;
  background-color: ${({ choice }) => (choice ? '#FFBE57' : '#fff')};
  transition: background-color 0.3s;
  font-size: 1.2em;

  &: hover {
    cursor: pointer;
    border-color: #ffac29;
    box-shadow: 0 0 0 3px #ffcf85;
  }
`;

const ImgFile = styled.label`
  width: 90%;
  min-width: 300px;
  height: 30em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ffc184;
  border-radius: 10px;

  &: hover {
    cursor: pointer;
    border-color: #ffac29;
    box-shadow: 0 0 0 3px #ffcf85;
  }
`;

const ImgFileExplan = styled.div`
  width: 100%;
  text-align: center;
  font-size: 0.875em;
`;

const ImgPreview = styled.img`
  width: 95%;
  height: 95%;
  text-align: center;
  object-fit: contain;
`;

const InputFile = styled.input`
  display: none;
`;

const InfoContainer = styled.div`
  width: 50%;
  min-width: 300px;
  display: flex;
  justify-content: space-evenly;
`;

const InfoDetail = styled.div`
  width: 15em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-around;
  gap: 20px;
`;

const PetDetailText = styled.span`
  font-size: 1.2em;
  padding: 0.25rem;
`;

const InputInfo = styled.input`
  width: 100%;
  font-size: 1em;
  outline: none;
  border: 1px solid #ffcf85;
  border-radius: 5px;
  padding: 0.25rem;
  box-sizing: border-box; // input의 길이가 부모 요소의 밖으로 나가는 것을 방지

  &: hover {
    border-color: #ffac29;
  }

  &: focus {
    border-color: #ffac29;
    box-shadow: 0 0 0 3px #ffcf85;
  }
`;

const InputBtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 5px;
`;

const InputGenderBtn = styled.button<{ gender: boolean }>`
  width: 4em;
  border: none;
  border-radius: 5px;
  color: #000;
  background-color: ${({ gender }) => (gender ? '#FFBE57' : '#A9A9A9')};
  transition: background-color 0.3s;
  font-size: 1.2em;

  &:hover {
    cursor: pointer;
    background-color: #ffbe57;
  }
`;

const InputNeuterBtn = styled.button<{ neuter: boolean | string }>`
  width: 4em;
  border: none;
  border-radius: 5px;
  color: #000;
  background-color: ${({ neuter }) => (neuter ? '#FFBE57' : '#A9A9A9')};
  transition: background-color 0.3s;
  font-size: 1.2em;

  &:hover {
    cursor: pointer;
    background-color: #ffbe57;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  min-width: 300px;
`;

const TextArea = styled.textarea`
  width: 90%;
  margin: 3% auto;
  background-color: #ffefde;

  border: 1px solid #ffcf85;
  border-radius: 10px;
  min-height: 7rem;
  resize: vertical;
  outline: #ffc184;
  padding: 15px;
  font-size: 1em;

  &: hover {
    border-color: #ffac29;
  }

  &: focus {
    border-color: #ffac29;
    box-shadow: 0 0 0 3px #ffcf85;
  }
`;

const InputImgList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-flow: row; /* 요소가 너비를 초과하면 다음 행으로 넘어가도록 설정 */
  gap: 20px;
  place-items: center;

  @media screen and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ImgPreviewList = styled.label`
  width: 15em;
  height: 15em;
  border: 1px solid #ffc184;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    cursor: pointer;
    border-color: #ffac29;
    box-shadow: 0 0 0 3px #ffcf85;
  }
`;

const SubmitBtn = styled.span`
  width: 10rem;
  font-size: 1.25em;
`;

function Form() {
  // axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  const navigate = useNavigate();

  const [visibleInputs, setVisibleInputs] = useState<number>(1); // 이미지 리스트 길이
  // const [petType, setPetType] = useState<string | null>(null); // 펫 타입 체크
  const [isSelected, setIsSelected] = useState<string | null>(null); // 입양 상태 버튼
  const [imgFile, setImgFile] = useState<string | null>(null); // 썸네일 미리보기
  const [imgList, setImgList] = useState<(string | undefined)[]>(
    Array(6).fill(undefined),
  ); // 이미지 리스트 미리보기 데이터
  const [isGender, setIsGender] = useState<string | null>(null); // 성별 체크
  const [isNeuter, setIsNeuter] = useState<string | null>(null); // 중성화 체크
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    petType: string;
    name: string;
    age: string;
    weight: string;
    kindCd: string;
    specialMark: string;
    address: string;
    mainImage: File | string;
    images: (File | string)[];
  }>({
    title: '',
    description: '',
    petType: '',
    name: '',
    age: '',
    weight: '',
    kindCd: '',
    specialMark: '',
    address: '',
    mainImage: '',
    images: [],
  });
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 37.5528803113882,
    lng: 126.972601286522,
  }); // 위도 경도 저장
  const { kakao } = window;
  const [address, setAddress] = useState<string | null>(null); // 현재 좌표의 주소를 저장할 상태

  const imgRef = useRef<HTMLInputElement>(null);

  const btnClickHandler = (choice: string) => {
    setIsSelected(choice);
  };

  const genderBtnHendler = (gender: string) => {
    setIsGender(gender);
  };

  const neuterBtnHandler = (neuter: string) => {
    setIsNeuter(neuter);
  };

  const petTypeHandler = (type: string) => {
    setFormData((prevData) => ({
      ...prevData,
      petType: type,
    }));
  };

  // 썸네일 미리보기
  const handleFileChange = () => {
    if (imgRef.current && imgRef.current.files) {
      // console.log(imgRef.current.files);
      const file: File = imgRef.current.files[0]; // 파일 가져오기
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file); // 파일 읽기
        reader.onloadend = () => {
          const result: string | null = reader.result as string; // 결과
          setImgFile(result); // 이미지 파일 설정 (미리보기 )
          setFormData((prevData) => ({
            ...prevData,
            mainImage: file,
          }));

          // console.log(URL.createObjectURL(file));
        };
      }
    }
  };

  // 이미지 리스트 미리보기
  const imgListHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // 이미지 리스트 미리보기 데이터
        setImgList((prevImgList) => {
          const newList = [...prevImgList];
          newList[index] = reader.result as string;
          return newList;
        });
        // 이미지 리스트 업로드 데이터
        setFormData((prevData) => ({
          ...prevData,
          images: [
            ...prevData.images.slice(0, index),
            file,
            ...prevData.images.slice(index + 1),
          ],
        }));
        // Increment visible inputs count if it is less than 6
        if (visibleInputs < 6) {
          setVisibleInputs(visibleInputs + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // 주소 저장
    if (address) {
      formData.address = (address as any).address_name;
    }

    const userId = localStorage.getItem('userId'); // 로컬스토리지의 유저 아이디 저장
    const userPhone = localStorage.getItem('phone'); // 로컬스토리지의 유저 전화번호 저장

    // 보호소 이름에 user_id, 보호소 전화번호에 user 전화번호, 보호소 주소에 보호자가 원하는 주소

    // 백엔드로 전송할 데이터 구성
    const petInfo = {
      title: formData.title,
      description: formData.description,
      petInfo: {
        name: formData.name,
        age: formData.age,
        weight: formData.weight,
        kindCd: formData.kindCd,
        specialMark: formData.specialMark,
        address: formData.address,
        processState: isSelected,
        sexCd: isGender,
        neuterYn: isNeuter,
        // filename: imgFile,
        // popfile: imgFile,
        isPublicApi: false,
        petType: formData.petType,

        shelter: {
          // id: 0,
          // petInfoList: [''],
          careNm: userId, // 보호소 이름: 유저 아이디
          careTel: userPhone, // 보호소 전화번호: 유저 번호
          careAddr: formData.address, // 주소
        },
      },
      userId,
    };

    data.append(
      'petBoardRequestDto',
      new Blob([JSON.stringify(petInfo)], {
        type: 'application/json',
      }),
    );
    data.append('mainImage', formData.mainImage); // 썸네일 이미지
    // data.append('images', formData.images); // 이미지 리스트 // formData.images 로 변경필요
    for (let i = 0; i < formData.images.length; i++) {
      data.append('images', formData.images[i]);
    }
    // formData.images.forEach((image, index) => {
    //   data.append(`images`, image[index]);
    // });

    // console.log(data.getAll('images'));

    // const data = {
    //   title: formData.title,
    //   description: formData.description,
    //   petInfo,
    //   userId,
    // };

    // console.log(data.get('petBoardRequestDto'));
    // console.log(petInfo);
    // console.log(data.get('mainImage'));
    // console.log(data.get('images'));
    try {
      await axios
        .post('https://dogcatworld.site:8080/api/v1/pet_board/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            access: localStorage.getItem('accessToken'),
          },
        })
        .then(() => {
          // console.log(res);
          alert('글 작성 완료');
          navigate('/dog');
        });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('글 작성 실패');
    }
  };

  // 지도 클릭 시 마커를 주소로 변환
  const getAddress = (lat: number, lng: number) => {
    const geocoder = new kakao.maps.services.Geocoder(); // 좌표 -> 주소로 변환해주는 객체
    const coord = new kakao.maps.LatLng(lat, lng); // 주소로 변환할 좌표 입력
    const callback = (result: any, status: any) => {
      if (status === kakao.maps.services.Status.OK) {
        setAddress(result[0].address);
      }
    };
    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
  };

  const handleClick = (_: any, mouseEvent: any) => {
    const latlng = mouseEvent.latLng;
    const newPosition = {
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    };

    setPosition(newPosition);
    getAddress(newPosition.lat, newPosition.lng);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FromHeader>
        <Title>
          <TextField
            fullWidth
            label="제목"
            variant="outlined"
            color="warning"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
        </Title>

        <LeftContainer>
          <BtnContainer>
            <StyledButton
              type="button"
              choice={isSelected === '개인보호중'} // 선택된 버튼인지 확인하여 부울 값으로 전달
              onClick={() => btnClickHandler('개인보호중')}
            >
              입양 대기
            </StyledButton>
            <StyledButton
              type="button"
              choice={isSelected === '종료(입양)'} // 선택된 버튼인지 확인
              onClick={() => btnClickHandler('종료(입양)')}
            >
              입양 완료
            </StyledButton>
          </BtnContainer>
          <ImgFile htmlFor="petImg">
            {imgFile ? (
              <ImgPreview src={imgFile} alt="Preview" />
            ) : (
              <ImgFileExplan>여기를 클릭해서 사진을 올려주세요.</ImgFileExplan>
            )}
          </ImgFile>

          <InputFile
            type="file"
            id="petImg"
            onChange={handleFileChange}
            ref={imgRef}
          />
        </LeftContainer>

        <InfoContainer>
          <InfoDetail>
            <PetDetailText>동물 종류</PetDetailText>
            <PetDetailText>이름</PetDetailText>
            <PetDetailText>성별</PetDetailText>
            <PetDetailText>나이</PetDetailText>
            <PetDetailText>몸무게</PetDetailText>
            <PetDetailText>품종</PetDetailText>
            <PetDetailText>중성화 여부</PetDetailText>
          </InfoDetail>

          <InfoDetail>
            <InputBtnContainer>
              <InputGenderBtn
                type="button"
                gender={formData.petType === '개'}
                onClick={() => petTypeHandler('개')}
              >
                개
              </InputGenderBtn>
              <InputGenderBtn
                type="button"
                gender={formData.petType === '고양이'}
                onClick={() => petTypeHandler('고양이')}
              >
                고양이
              </InputGenderBtn>
            </InputBtnContainer>
            <InputInfo
              name="name"
              placeholder="이름"
              value={formData.name}
              onChange={handleInputChange}
            />
            <InputBtnContainer>
              <InputGenderBtn
                type="button"
                gender={isGender === 'M'}
                onClick={() => genderBtnHendler('M')}
              >
                남
              </InputGenderBtn>
              <InputGenderBtn
                type="button"
                gender={isGender === 'F'}
                onClick={() => genderBtnHendler('F')}
              >
                여
              </InputGenderBtn>
              <InputGenderBtn
                type="button"
                gender={isGender === 'Q'}
                onClick={() => genderBtnHendler('Q')}
              >
                미상
              </InputGenderBtn>
            </InputBtnContainer>
            <InputInfo
              type="text"
              name="age"
              placeholder="나이"
              value={formData.age}
              onChange={handleInputChange}
            />
            <InputInfo
              type="text"
              name="weight"
              placeholder="몸무게"
              value={formData.weight}
              onChange={handleInputChange}
            />
            <InputInfo
              type="text"
              name="kindCd"
              placeholder="품종"
              value={formData.kindCd}
              onChange={handleInputChange}
            />
            <InputBtnContainer>
              <InputNeuterBtn
                type="button"
                neuter={isNeuter === 'Y'}
                onClick={() => neuterBtnHandler('Y')}
              >
                네
              </InputNeuterBtn>
              <InputNeuterBtn
                type="button"
                neuter={isNeuter === 'N'}
                onClick={() => neuterBtnHandler('N')}
              >
                아니요
              </InputNeuterBtn>
              <InputNeuterBtn
                type="button"
                neuter={isNeuter === 'U'}
                onClick={() => neuterBtnHandler('U')}
              >
                모름
              </InputNeuterBtn>
            </InputBtnContainer>
          </InfoDetail>
        </InfoContainer>
      </FromHeader>

      <MapContainer>
        <div>입양자와 만나기 좋은 장소를 골라주세요</div>
        <Map
          center={position}
          style={{ width: '100%', height: '37em' }}
          level={7}
          onClick={handleClick}
        >
          <MapMarker position={position} />
        </Map>
        {address && <div>{(address as any).address_name}</div>}
      </MapContainer>

      <TextArea
        name="specialMark"
        placeholder="추가 설명을 작성해주세요. (예, 성격 또는 특이사항)"
        value={formData.specialMark}
        onChange={handleInputChange}
      />

      <InputImgList>
        {[...Array(visibleInputs)].map((_, index) => (
          <ImgPreviewList key={`listImg${index}`} htmlFor={`listImg${index}`}>
            {imgList[index] ? (
              <ImgPreview src={imgList[index]} alt="Preview" />
            ) : (
              <ImgFileExplan>
                여기를 클릭해서 사진을 올려주세요.
                <br /> <br />
                (최대 6장)
              </ImgFileExplan>
            )}
            <InputFile
              type="file"
              id={`listImg${index}`}
              onChange={(e) => imgListHandler(e, index)}
            />
          </ImgPreviewList>
        ))}
      </InputImgList>

      <Button variant="contained" color="warning" type="submit">
        <SubmitBtn>등록하기</SubmitBtn>
      </Button>
    </FormWrapper>
  );
}

export default Form;
