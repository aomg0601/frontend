import React, { useState, useEffect } from 'react';
import {Route, Routes, BrowserRouter} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
// import "./MyPortPop.css";
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate,useLocation } from 'react-router-dom';
import App from '../App';

// 다미 데이터
const User = {
  id: 'caucap1111',
  pw: 'caucap1111'
}

const defaultTheme = createTheme();

const Login = () => {
  const [id, setId ] = useState('');
  const [pw, setPw] = useState('');

  const [idValid, setIdValid ] = useState(false);
  const [pwValid, setPwValid] = useState(false);

  const [notAllow, setNotAllow] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();



// id 확인
  const handleId = (e) => {
      setId(e.target.value);
      const regex =  /(?=.*\d)(?=.*[a-z]).{6,}/;
      if (regex.test(id)) {
        setIdValid(true) ;
      } else{
        setIdValid(false);
      }
  }
  // 비번
  const handlePassword = (e) => {
      setPw(e.target.value);
      const regex =  /(?=.*\d)(?=.*[a-z]).{8,}/;
      if (regex.test(pw)) {
        setPwValid(true) ;
      } else{
        setPwValid(false);
      }

  }
  // 로그인버튼 활성화 여부 체크
  useEffect(() => {
    // id, 비번 두개 다 true면 버튼 활성화
      if(idValid && pwValid) {
        setNotAllow(false);
        return;
      }
      setNotAllow(true);
  }, [idValid, pwValid]);

  // 로그인 버튼 동작
  const onClickConfirmButton = () => {
    if (id === User.id && pw === User.pw ){
      // alert('로그인에 성공하였습니다 ');
      setIsLoggedIn(true);
      loginSuccess();
    } else {
      alert('등록되지 않은 회원입니다 ');
    }
  }

    const loginSuccess = () => {
         navigate("/MyPort");
    }


  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     id: data.get('id'),
  //     password: data.get('password'),
  //   });
  // };
  return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
      <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
      >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
      <LockOutlinedIcon/>
      </Avatar>
      {/* 내용은 h1인데 디자인은 h5 */}
      <Typography component= "h1" variant='h5'>
          Sign in
      </Typography>
        <TextField
            margin="normal"
            type = "text"
            label = "아이디" 
            required // 반드시 입력 
            fullWidth
            name = "id"
            autoFocus
            value={id}
            onChange={handleId}
        />
        <div className='errorMessageWrap'>
          {!idValid && id.length >0 &&(
            <div>올바른 아이디를 입력해주세요</div>
          )}

        </div>

        <TextField
            margin="normal"
            label = "비밀번호"
            type = "password" 
            required
            fullWidth
            name='password'
            autoComplete='current-password'
            value={pw}
            onChange={handlePassword}
        />
        <div className='errorMessageWrap'>
          {!pwValid && pw.length >0 &&(
            <div>올바른 비밀번호를 입력해주세요</div>
          )}

        </div>
        <FormControlLabel control={<Checkbox value="remember" color='primary' />}
            label="Remember me"
     
        />

        <Button onClick={onClickConfirmButton} disabled = {notAllow} 
            type = "submit" fullWidth variant = "contained" 
        sx = {{ mt: 3, mb:2}}>
            로그인
        </Button>

        <Grid container>
          <Grid item xs>
              <Link>Forget password?</Link>
          </Grid>
          <Grid item>
              <Link>Sign up</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>

    </ThemeProvider>
  );
};

export default Login;
