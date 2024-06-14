import React, { useState, useEffect } from 'react';
import { login, reissueToken } from '../api/Api'; 
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.trim().length >= 6;

    setIsFormValid(
      isEmailValid &&
      isPasswordValid
    );
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('양식을 올바르게 작성해주세요');
      return;
    }
    try {
      const { accessToken, refreshToken } = await login({ email, password });
      console.log('Login successful:', { accessToken, refreshToken });
      alert('로그인 성공');
      navigate('/myport'); 
    } catch (error) {
      console.error('Error logging in:', error);
      alert('로그인 중 오류가 발생했습니다');
    }
  };

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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="메일"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid}
            >
              로그인
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  회원가입 화면
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;










// import React, { useState, useEffect } from 'react';
// import { login } from '../api/Api';
// import Avatar from '@mui/material/Avatar';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { Typography } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// const defaultTheme = createTheme();

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isFormValid, setIsFormValid] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//     const isPasswordValid = password.trim().length >= 6;

//     setIsFormValid(isEmailValid && isPasswordValid);
//   }, [email, password]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isFormValid) {
//       alert('Please fill out the form correctly');
//       return;
//     }
//     try {
//       const response = await login({ email, password });
//       localStorage.setItem('token', response.token);
//       console.log('Login successful:', response);
//       alert('로그인 성공');
//       navigate('/myport');
//     } catch (error) {
//       console.error('Error logging in:', error.response?.data || error.message);
//       alert('로그인 중 오류가 발생했습니다');
//     }
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Login
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="메일"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="비밀번호"
//               type="password"
//               id="password"
//               autoComplete="current-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3, mb: 2 }}
//               disabled={!isFormValid}
//             >
//               로그인
//             </Button>
//             <Grid container justifyContent="flex-end">
//               <Grid item>
//                 <Link href="/signup" variant="body2">
//                   회원가입 화면
//                 </Link>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default Login;





// import React, { useState, useEffect } from 'react';
// import { login } from '../api/Api'; 
// import Avatar from '@mui/material/Avatar';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { Typography } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from 'react-router-dom';

// const defaultTheme = createTheme();

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [emailValid, setEmailValid] = useState(false);
//   const [passwordValid, setPasswordValid] = useState(false);
//   const [notAllow, setNotAllow] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const navigate = useNavigate();

//   const handleEmail = (e) => {
//     setEmail(e.target.value);
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (regex.test(e.target.value)) {
//       setEmailValid(true);
//     } else {
//       setEmailValid(false);
//     }
//   };

//   const handlePassword = (e) => {
//     setPassword(e.target.value);
//     const regex = /[a-zA-Z0-9!@#$%^&*]/;
//     if (regex.test(e.target.value)) {
//       setPasswordValid(true);
//     } else {
//       setPasswordValid(false);
//     }
//   };

//   useEffect(() => {
//     if (emailValid && passwordValid) {
//       setNotAllow(false);
//     } else {
//       setNotAllow(true);
//     }
//   }, [emailValid, passwordValid]);

//   const onClickConfirmButton = async () => {
//     try {
//       console.log('Attempting to log in with:', { email, password });
//       const response = await login({ email, password });
//       console.log('Login response:', response);
      
//       if (response.status === 200) {
//         const token = response.data; // 응답 데이터에서 토큰 추출
//         console.log('Token received:', token);
//         localStorage.setItem('token', token);
//         const storedToken = localStorage.getItem('token');
//         console.log('Retrieved token from localStorage:', storedToken);
//         loginSuccess();
//       } else {
//         console.error('Login failed with status:', response.status);
//         alert('로그인에 실패했습니다。Status code: ' + response.status);
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//       if (error.response) {
//         alert('등록안됨。Status code: ' + error.response.status);
//       } else if (error.request) {
//         alert('서버에서 응답없음');
//       } else {
//         alert('error: ' + error.message);
//       }
//     }
//   };

//   const loginSuccess = () => {
//     console.log('Login successful, navigating to MyPort');
//     setIsLoggedIn(true);
//     navigate('/MyPort');
//   };

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Container component="main" maxWidth="xs">
//         <Box
//           sx={{
//             marginTop: 8,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Sign in
//           </Typography>
//           <TextField
//             margin="normal"
//             type="email"
//             label="메일"
//             required
//             fullWidth
//             name="email"
//             autoFocus
//             value={email}
//             onChange={handleEmail}
//           />
//           <div className='errorMessageWrap'>
//             {!emailValid && email.length > 0 && (
//               <div>올바른 메일을 입력해주세요</div>
//             )}
//           </div>
//           <TextField
//             margin="normal"
//             label="비밀번호"
//             type="password"
//             required
//             fullWidth
//             name="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={handlePassword}
//           />
//           <div className='errorMessageWrap'>
//             {!passwordValid && password.length > 0 && (
//               <div>올바른 비밀번호를 입력해주세요</div>
//             )}
//           </div>
//           <Button
//             onClick={onClickConfirmButton}
//             disabled={notAllow}
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             로그인
//           </Button>
//           <Grid container>
//             <Grid item xs>
              
//             </Grid>
//             <Grid item>
//               <Link href="/signup" variant="body2">{"회원가입"}</Link>
//             </Grid>
//           </Grid>
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// };

// export default Login;




