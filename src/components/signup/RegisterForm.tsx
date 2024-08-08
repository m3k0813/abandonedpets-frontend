import { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';

const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5%;
`;

const Explan = styled.div`
  font-size: 2rem;
`;

const FormContainer = styled.form`
  width: 18rem;
  display: flex;
  flex-direction: column;
  margin-top: 3%;
  gap: 20px;
`;

/*
const SubmitBtn = styled.span`
  width: 18rem;
  height: 2.5rem;
  background-color: #ffdfbf;
  font-size: 1rem;
  border: none;
  border-radius: 70px;
  margin-top: 10%;
  cursor: pointer;

  &:active {
    transform: scale(0.95);
  }
`;
*/

const LoginContainer = styled.div`
  width: 18rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5%;
`;

const LoginExplan = styled.p`
  font-size: 0.875rem;
  color: #939393;
`;

const LoginText = styled(Link)`
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &: hover {
    text-decoration: underline;
  }
`;

interface userForm {
  name: string;
  email: string;
  password: string;
  phone: string;
}

function RegisterForm() {
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

  const navigate = useNavigate();
  const [form, setForm] = useState<userForm>({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const formChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    // console.log(form.password.length);
    if (form.password.length < 8 || form.password.length > 20) {
      alert('비밀번호는 8자 이상, 20자 이하로 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `/api/v1/users/register`,
        {
          username: form.name,
          email: form.email,
          password: form.password,
          phoneNum: form.phone,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      alert(response.data.message);
      navigate('/login');
    } catch (err: any) {
      console.log(err);
      const errMsg = err.response.data.errorMessage;
      // console.log(err.response.data.errorMessage);
      alert(errMsg);
    }
  };

  return (
    <SignUpContainer>
      <Explan>회원가입</Explan>
      <FormContainer onSubmit={submitHandler}>
        <TextField
          name="name"
          variant="standard"
          label="이름"
          required
          onChange={formChangeHandler}
        />
        <TextField
          name="email"
          variant="standard"
          label="이메일"
          required
          onChange={formChangeHandler}
        />
        <TextField
          name="password"
          variant="standard"
          label="비밀번호"
          type="password"
          placeholder="8~20자로 해주세요."
          required
          onChange={formChangeHandler}
        />
        <TextField
          name="phone"
          variant="standard"
          label="전화번호"
          placeholder="01012345678"
          required
          onChange={formChangeHandler}
        />
        <Button type="submit" variant="contained" color="warning" size="large">
          회원가입
        </Button>
      </FormContainer>
      <LoginContainer>
        <LoginExplan>이미 회원이신가요?</LoginExplan>
        <LoginText to="/login">로그인하기</LoginText>
      </LoginContainer>
    </SignUpContainer>
  );
}

export default RegisterForm;
