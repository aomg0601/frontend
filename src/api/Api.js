//   src/api/Api.js
import axios from 'axios';

axios.defaults.withCredentials = true;  // 쿠키설정
const API_BASE_URL = 'http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080';





//********** 회원가입 */
export const join = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/join`, userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error during join API call:', error);
    throw error;
  }
};


//********** 로그인 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true 
    });

    console.log('Login response:', response);

    const accessToken = response.data.split(' ')[1];
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken'))
      ?.split('=')[1];

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error logging in:', error.response || error.message);
    throw error;
  }
};

//********** 토큰재발급********** */
export const reissueToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/auth/reissue`, null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Cookie': `refresh-token=${refreshToken}`
      }
    });

    const newAccessToken = response.headers['authorization'].split(' ')[1];
    const newRefreshToken = response.headers['set-cookie']
      .find(cookie => cookie.startsWith('refreshToken'))
      ?.split(';')[0]
      .split('=')[1];

    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Error reissuing token:', error.response || error.message);
    throw error;
  }
};




//********** 유저정보***************** */
export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log('User info response:', response);

    
    return response.data; 
  } catch (error) {
    console.error('Error fetching user info:', error.response || error.message);
    throw error;
  }
};
//****************************************************//

export const createPortfolio = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('AccessToken:', token); 

    const response = await axios.post(
      `${API_BASE_URL}/portfolio`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio:', error.response || error.message);
    console.log('Error details:', error.response); 
    throw error;
  }
};


//********** 데이터베이스 생성 **********/
export const createDatabase = async (portfolioId, databaseData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/database`, databaseData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

//********** 데이터베이스 스키마 등록 **********/
export const registerDatabaseSchema = async (portfolioId, databaseId, schemaData) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.post(`${API_BASE_URL}/portfolio-database/${databaseId}/schema`, schemaData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error registering database schema:', error);
    throw error;
  }
};

//********** 포트폴리오 ID 조회 **********/
export const getPortfolioById = async (portfolioId) => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

//********** 포트폴리오 **********/
export const getPortfolios = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');

    const response = await axios.get(`${API_BASE_URL}/portfolios`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};


//*******************************************************//
export const getUserPortfolios = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.get(`${API_BASE_URL}/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user portfolios:', error.response || error.message);
    throw error;
  }
};



const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};







/**********Portfolio API************* */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// *****************************************************************//






// export const createPortfolio = async (portfolioData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/portfolio`, portfolioData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error during createPortfolio API call:', error);
//     throw error;
//   }
// };






export const updatePortfolio = (portfolioId, portfolioData) => {
  return api.put(`/portfolio/${portfolioId}`, portfolioData);
};

//****************************************************************//
export const createPortfolioCode = async (portfolioId, codeData) => {
  try {
    // 요청 전송
    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/code`, codeData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('포트폴리오 코드 생성 중 에러 발생:', error);
    throw error;
  }
};











// export const createPortfolio = async (portfolioData) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/portfolio`, portfolioData, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating portfolio:', error);
//     throw error;
//   }
// };


// export const updatePortfolio = async (portfolioId, portfolioData) => {
//   try {
//     const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}`, portfolioData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating portfolio:', error);
//     throw error;
//   }
// };

export const deletePortfolio = async (portfolioId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
};




export const getPortfolioDetail = async (portfolioId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio detail:', error);
    throw error;
  }
};
/******여기까지 Portfolio API**** */

// Additional API Endpoints

// export const createPortfolioCode = async (portfolioId, data) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/code`, data, {
//       params: { userId: data.userId }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating portfolio code:', error);
//     throw error;
//   }
// };

export const createPortfolioDesign = async (portfolioId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/design`, data, {
      params: { userId: data.userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio design:', error);
    throw error;
  }
};



export const createPortfolioDesignDiagram = async (designId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio-design/${designId}/diagram`, data, {
      params: { userId: data.userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio design diagram:', error);
    throw error;
  }
};

export const createPortfolioDatabaseSchema = async (portfolioId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/database`, data, {
      params: { userId: data.userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio database schema:', error);
    throw error;
  }
};


export const createPortfolioFunction = async (portfolioId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/function`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio function:', error);
    throw error;
  }
};

export const createPortfolioFunctionModule = async (functionId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio-function/${functionId}/module`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio function module:', error);
    throw error;
  }
};




export const createPortfolioApiModule = async (portfolioId, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/api`, data, {
      params: { userId: data.userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating portfolio API module:', error);
    throw error;
  }
};



























// import axios from 'axios';

// const API_BASE_URL = 'http://ec2-3-37-127-162.ap-northeast-2.compute.amazonaws.com';

// //*******************************  URL 컨트롤러 관련 함수****************************//

// // URL 생성
// export const createUrl = async (urlData) => {
//   const response = await axios.post(`${API_BASE_URL}/url`, urlData);
//   return response.data;
// };

// // URL 업데이트
// export const updateUrl = async (urlId, urlData) => {
//   const response = await axios.put(`${API_BASE_URL}/url/${urlId}`, urlData);
//   return response.data;
// };

// // URL 삭제
// export const deleteUrl = async (urlId) => {
//   const response = await axios.delete(`${API_BASE_URL}/url/${urlId}`);
//   return response.data;
// };

// // URL 포트폴리오 조회
// export const getUrlPortfolio = async (urlId) => {
//   const response = await axios.get(`${API_BASE_URL}/url/${urlId}/portfolio`);
//   return response.data;
// };

// //***********************  URL 컨트롤러 관련 함수 여기까지****************************//


// /**************************포트폴리오 컨트롤러 관련 함수*********************/

// // 포트폴리오 생성
// export const createPortfolio = async (portfolioData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio`, portfolioData);
//   return response.data;
// };

// // 포트폴리오 업데이트
// export const updatePortfolio = async (portfolioId, portfolioData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}`, portfolioData);
//   return response.data;
// };

// // 포트폴리오 삭제
// export const deletePortfolio = async (portfolioId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}`);
//   return response.data;
// };

// // 포트폴리오 조회
// export const getPortfolios = async () => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio`);
//   return response.data;
// };
// /**************************포트폴리오 컨트롤러 관련 함수 여기까지*********************/

// // 포트폴리오 일정 컨트롤러 관련 함수

// // 일정 생성
// export const createPortfolioSchedule = async (portfolioId, scheduleData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/schedule`, scheduleData);
//   return response.data;
// };

// // 일정 업데이트
// export const updatePortfolioSchedule = async (portfolioId, scheduleId, scheduleData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/schedule/${scheduleId}`, scheduleData);
//   return response.data;
// };

// // 일정 삭제
// export const deletePortfolioSchedule = async (portfolioId, scheduleId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/schedule/${scheduleId}`);
//   return response.data;
// };

// // 일정 조회
// export const getPortfolioSchedules = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/schedule`);
//   return response.data;
// };

// // 포트폴리오 기능 컨트롤러 관련 함수

// // 기능 생성
// export const createPortfolioFunction = async (portfolioId, functionData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/function`, functionData);
//   return response.data;
// };

// // 기능 업데이트
// export const updatePortfolioFunction = async (portfolioId, functionId, functionData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/function/${functionId}`, functionData);
//   return response.data;
// };

// // 기능 삭제
// export const deletePortfolioFunction = async (portfolioId, functionId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/function/${functionId}`);
//   return response.data;
// };

// // 기능 조회
// export const getPortfolioFunctions = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/function`);
//   return response.data;
// };

// // 포트폴리오 피드백 컨트롤러 관련 함수

// // 피드백 생성
// export const createPortfolioFeedback = async (portfolioId, feedbackData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/feedback`, feedbackData);
//   return response.data;
// };

// // 피드백 업데이트
// export const updatePortfolioFeedback = async (portfolioId, feedbackId, feedbackData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/feedback/${feedbackId}`, feedbackData);
//   return response.data;
// };

// // 피드백 삭제
// export const deletePortfolioFeedback = async (portfolioId, feedbackId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/feedback/${feedbackId}`);
//   return response.data;
// };

// // 피드백 조회
// export const getPortfolioFeedbacks = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/feedback`);
//   return response.data;
// };

// // 포트폴리오 상세 컨트롤러 관련 함수

// // 상세 조회
// export const getPortfolioDetail = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/detail`);
//   return response.data;
// };

// // 상세 업데이트
// export const updatePortfolioDetail = async (portfolioId, detailData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/detail`, detailData);
//   return response.data;
// };

// // 포트폴리오 디자인 컨트롤러 관련 함수

// // 디자인 생성
// export const createPortfolioDesign = async (portfolioId, designData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/design`, designData);
//   return response.data;
// };

// // 디자인 업데이트
// export const updatePortfolioDesign = async (portfolioId, designId, designData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/design/${designId}`, designData);
//   return response.data;
// };

// // 디자인 삭제
// export const deletePortfolioDesign = async (portfolioId, designId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/design/${designId}`);
//   return response.data;
// };

// // 디자인 조회
// export const getPortfolioDesigns = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/design`);
//   return response.data;
// };

// // 포트폴리오 코멘트 컨트롤러 관련 함수

// // 코멘트 생성
// export const createPortfolioComment = async (portfolioId, commentData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/comment`, commentData);
//   return response.data;
// };

// // 코멘트 업데이트
// export const updatePortfolioComment = async (portfolioId, commentId, commentData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/comment/${commentId}`, commentData);
//   return response.data;
// };

// // 코멘트 삭제
// export const deletePortfolioComment = async (portfolioId, commentId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/comment/${commentId}`);
//   return response.data;
// };

// // 코멘트 조회
// export const getPortfolioComments = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/comment`);
//   return response.data;
// };

// // 포트폴리오 코드 컨트롤러 관련 함수

// // 코드 생성
// export const createPortfolioCode = async (portfolioId, codeData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/code`, codeData);
//   return response.data;
// };

// // 코드 업데이트
// export const updatePortfolioCode = async (portfolioId, codeId, codeData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/code/${codeId}`, codeData);
//   return response.data;
// };

// // 코드 삭제
// export const deletePortfolioCode = async (portfolioId, codeId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/code/${codeId}`);
//   return response.data;
// };

// // 코드 조회
// export const getPortfolioCodes = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/code`);
//   return response.data;
// };

// // 포트폴리오 API 컨트롤러 관련 함수

// // API 생성
// export const createPortfolioAPI = async (portfolioId, apiData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/api`, apiData);
//   return response.data;
// };

// // API 업데이트
// export const updatePortfolioAPI = async (portfolioId, apiId, apiData) => {
//   const response = await axios.put(`${API_BASE_URL}/portfolio/${portfolioId}/api/${apiId}`, apiData);
//   return response.data;
// };

// // API 삭제
// export const deletePortfolioAPI = async (portfolioId, apiId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/api/${apiId}`);
//   return response.data;
// };

// // API 조회
// export const getPortfolioAPIs = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/api`);
//   return response.data;
// };

// // 기술 스택 컨트롤러 관련 함수

// // 기술 스택 생성
// export const createTechStack = async (techStackData) => {
//   const response = await axios.post(`${API_BASE_URL}/tech-stack`, techStackData);
//   return response.data;
// };

// // 기술 스택 조회
// export const getTechStacks = async () => {
//   const response = await axios.get(`${API_BASE_URL}/tech-stack`);
//   return response.data;
// };

// // 포트폴리오 기술 스택 컨트롤러 관련 함수

// // 포트폴리오 기술 스택 생성
// export const createPortfolioTechStack = async (portfolioId, techStackData) => {
//   const response = await axios.post(`${API_BASE_URL}/portfolio/${portfolioId}/tech-stack`, techStackData);
//   return response.data;
// };

// // 포트폴리오 기술 스택 삭제
// export const deletePortfolioTechStack = async (portfolioId, techStackId) => {
//   const response = await axios.delete(`${API_BASE_URL}/portfolio/${portfolioId}/tech-stack/${techStackId}`);
//   return response.data;
// };

// // 포트폴리오 기술 스택 조회
// export const getPortfolioTechStacks = async (portfolioId) => {
//   const response = await axios.get(`${API_BASE_URL}/portfolio/${portfolioId}/tech-stack`);
//   return response.data;
// };

// // 파일 컨트롤러 관련 함수

// // 파일 업로드
// export const uploadFile = async (fileData) => {
//   const response = await axios.post(`${API_BASE_URL}/file/upload`, fileData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// // 파일 조회
// export const getFile = async (fileName) => {
//   const response = await axios.get(`${API_BASE_URL}/file/${fileName}`);
//   return response.data;
// };

// // 이미지 컨트롤러 관련 함수

// // 이미지 조회
// export const getImage = async (imageName) => {
//   const response = await axios.get(`${API_BASE_URL}/images/${imageName}`);
//   return response.data;
// };
