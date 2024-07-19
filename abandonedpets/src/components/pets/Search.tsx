import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import SearchIcon from '../../assets/Search.png';
import FilterIcon from '../../assets/Filter.png';

const SearchWrapper = styled.div`
  width: 85%;
  margin: 3% auto;
`;

const SearchContainer = styled.div`
  width: 100%;
  height: 2.7rem;
  display: flex;
  justify-content: center;
  position: relative;
  border-bottom: 1px solid #000;
`;

const FilterImg = styled.img`
  width: 2em;
  height: 2em;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0%, -50%);

  &: hover {
    cursor: pointer;
  }
`;

const SearchImg = styled.img`
  width: 1.5em;
  height: 1.5em;

  &: hover {
    cursor: pointer;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-left: 3em;
`;

const WriteBtn = styled.span`
  width: 10em;
  font-size: 1em;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-size: 1em;
  margin-left: 0.5rem;
`;

const FilterForm = styled.form`
  width: 95%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1% auto;

  @media screen and (max-width: 1023px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  @media screen and (max-width: 767px) {
  }
`;

const FormItems = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const FormInfo = styled.div`
  font-size: 1.25em;
  margin-right: 0.3rem;
`;

interface request {
  categories: string | null;
  status: string | null;
  minAge: string | null;
  maxAge: string | null;
  title: string | null;
  isYoung: boolean | null;
  page: number;
  size: number;
}

interface SearchParams {
  categories: string | null;
  status: string | null;
  minAge: string | null;
  maxAge: string | null;
  title: string | null;
  isYoung: boolean | null;
  page: number;
  size: number;
}

interface SearchProps {
  onSearch: (params: SearchParams) => void;
}

function Search({ onSearch }: SearchProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdoption, setIsAdoption] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');
  const [maxYear, setMaxYear] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('');
  const [isYoung, setIsYoung] = useState<boolean | null>(null); // 기본값 null로 설정

  const FilterOpenHandler = () => {
    setIsOpen(!isOpen);
  };

  const SelectAdoptionHandler = (e: SelectChangeEvent) => {
    setIsAdoption(e.target.value);
  };

  const writeBtnClickHandler = () => {
    if (localStorage.getItem('accessToken') === null) {
      alert('로그인 후 이용 가능합니다.');
    } else navigate('/petwrite');
  };

  const SelectIsYoungHandler = (e: SelectChangeEvent) => {
    const { value } = e.target;

    if (value === 'true') {
      setIsYoung(true);
    } else if (value === 'false') {
      setIsYoung(false);
    } else {
      setIsYoung(null);
    }
  };

  const searchHandler = async () => {
    const filterRequest: request = {
      categories: selectedCategory || null,
      status: isAdoption || null,
      minAge: minYear || null,
      maxAge: maxYear || null,
      title: title || null,
      isYoung: isYoung || null,
      page: 0,
      size: 12,
    };
    // 나이가 입력되지 않았을 경우, 검색 api를 실행하기 전에 막아버린다.
    if (!minYear) {
      alert('잘못된 검색입니다.');
      return;
    }
    onSearch(filterRequest);
    // console.log(filterRequest);

    // try {
    //   const response = await axios.get(
    //     'http://localhost:8080/api/v1/pet_board/search',
    //     {
    //       params: {
    //         categories: selectedCategory,
    //         status: isAdoption,
    //         minAge: minYear,
    //         maxAge: maxYear,
    //         title,
    //         isYoung,
    //         page: 0,
    //         size: 12,
    //       },
    //     },
    //   );

    //   console.log(response);

    //   if (response.data && response.data.content) {
    //     onSearch(response.data.content, response.data.totalPages);
    //     // console.log(onSearch);
    //     console.log(response.data.totalPages);
    //   } else {
    //     // onSearch([], 0);
    //   }
    // } catch (error) {
    //   console.error('검색 중 오류가 발생했습니다.', error);
    //   // onSearch([], 0);
    // }
  };

  const searchInputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchHandler();
    }
  };

  return (
    <SearchWrapper>
      <SearchContainer>
        <FilterImg src={FilterIcon} alt="필터" onClick={FilterOpenHandler} />
        <InputContainer>
          <SearchImg src={SearchIcon} alt="검색" onClick={searchHandler} />
          <Input
            type="text"
            placeholder="검색할 내용을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={searchInputHandler}
          />
        </InputContainer>
        <Button
          variant="outlined"
          color="warning"
          onClick={writeBtnClickHandler}
          sx={{ width: '10.5em' }}
        >
          <WriteBtn>글 작성하기</WriteBtn>
        </Button>
      </SearchContainer>

      {isOpen && (
        <FilterForm>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="state">입양 상태</InputLabel>
            <Select
              id="state"
              value={isAdoption}
              onChange={SelectAdoptionHandler}
            >
              <MenuItem value="Awaiting_adoption">입양 대기</MenuItem>
              <MenuItem value="Adoption_complete">입양 완료</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel id="isYoung">60일 미만</InputLabel>
            <Select
              id="isYoung"
              value={isYoung === null ? '' : isYoung.toString()}
              onChange={SelectIsYoungHandler}
            >
              <MenuItem value="">선택 안 함</MenuItem>
              <MenuItem value="true">예</MenuItem>
              <MenuItem value="false">아니요</MenuItem>
            </Select>
          </FormControl>

          <FormItems>
            <FormInfo>나이</FormInfo>
            <TextField
              variant="outlined"
              placeholder="최소"
              sx={{ width: 100 }}
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              required
            />
            <span>~</span>
            <TextField
              variant="outlined"
              placeholder="최대"
              onChange={(e) => setMaxYear(e.target.value)}
              sx={{ width: 100 }}
              required
            />
          </FormItems>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="selectedCategory">품종</InputLabel>
            <Select
              id="selectedCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">none</MenuItem>
              <MenuItem value="푸들">푸들</MenuItem>
              <MenuItem value="비숑">비숑</MenuItem>
              <MenuItem value="말티즈">말티즈</MenuItem>

              {/* <MenuItem value="웰시 코기">웰시코기</MenuItem> */}
              <MenuItem value="시츄">시츄</MenuItem>
              <MenuItem value="시바견">시바견</MenuItem>
              <MenuItem value="포메라니안">포메라니안</MenuItem>
              <MenuItem value="리트리버">리트리버</MenuItem>
              <MenuItem value="불독">불독</MenuItem>
              <MenuItem value="믹스견">믹스견</MenuItem>
              <MenuItem value="러시안 블루">러시안 블루</MenuItem>
              <MenuItem value="페르시안">페르시안</MenuItem>

              <MenuItem value="레그돌">레그돌</MenuItem>
              <MenuItem value="믹스묘">믹스묘</MenuItem>
            </Select>

            {/* <NativeSelect id="selectedCategory">
              <option value="">none</option>
              <option value="푸들">푸들</option>
              <option value="비숑">비숑</option>
              <option value="말티즈">말티즈</option>
              <option value="웰시코기">웰시코기</option>
              <option value="시츄">시츄</option>
              <option value="시바견">시바견</option>
              <option value="포메라니안">포메라니안</option>
              <option value="리트리버">리트리버</option>
              <option value="불독">불독</option>
              <option value="믹스견">믹스견</option>
              <option value="러시안 블루">러시안 블루</option>
              <option value="페르시안">페르시안</option>
              <option value="레그돌">레그돌</option>
              <option value="믹스묘">믹스묘</option>
            </NativeSelect> */}

            {/* <FormInfo>품종</FormInfo>
            <TextField
              variant="outlined"
              placeholder="품종을 입력해주세요"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              sx={{ width: 250 }}
            /> */}

            {/* <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={top100Films}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="전체" />}
            /> */}
          </FormControl>
        </FilterForm>
      )}
    </SearchWrapper>
  );
}

export default Search;
