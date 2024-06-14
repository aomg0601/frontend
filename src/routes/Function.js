import './Form.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Function = () => {
  const [functionGroups, setFunctionGroups] = useState([
    {
      id: Date.now(),
      areas: [
        {
          id: Date.now(),
          label: 'name',
          text: '',
          height: '50px',
        },
        {
          id: Date.now() + 1,
          label: 'description',
          text: '',
          height: '50px',
        },
      ],
    },
  ]);

  const [portfolioId, setPortfolioId] = useState(null);
  const [functionId, setFunctionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioId = async () => {
      try {
        const response = await axios.get('http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio');
        const portfolios = response.data.data;
        if (portfolios.length > 0) {
          setPortfolioId(portfolios[0].id);
          console.log('Fetched Portfolio ID:', portfolios[0].id);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolioId();
  }, []);

  useEffect(() => {
    if (functionId) {
      console.log('Function ID set:', functionId);
    }
  }, [functionId]);

  const addFunctionGroup = () => {
    const now = Date.now();
    const newGroup = {
      id: now,
      areas: [
        {
          id: now,
          label: 'name',
          text: '',
          height: '50px',
        },
        {
          id: now + 1,
          label: 'description',
          text: '',
          height: '50px',
        },
      ],
    };
    setFunctionGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleDynamicChange = (e, areaId, groupId) => {
    const { value } = e.target;
    setFunctionGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              areas: group.areas.map((area) =>
                area.id === areaId ? { ...area, text: value } : area
              ),
            }
          : group
      )
    );
  };

  const removeFunctionGroup = (groupId) => {
    setFunctionGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  const handleSaveFunction = async () => {
    if (!portfolioId) {
      console.error('Portfolio ID is not set');
      return;
    }

    const functionFormData = new FormData();
    functionGroups.forEach((group) => {
      group.areas.forEach((area) => {
        functionFormData.append(area.label, area.text || '');
      });
    });

    for (let pair of functionFormData.entries()) {
      console.log('Function FormData:', pair[0], pair[1]);
    }

    try {
      const functionResponse = await axios.post(
        `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio/${portfolioId}/function`,
        functionFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Function API Response:', functionResponse);

      // 응답 데이터를 로그에 출력
      console.log('Function API Response Data:', functionResponse.data);

      if (functionResponse.status === 200) {
        navigate('/pfapi');
      } else {
        console.error('Invalid response structure:', functionResponse.data);
      }
    } catch (error) {
      console.error('Error saving function:', error);
    }
  };

  const handleSaveFunctionModule = async () => {
    if (!portfolioId || !functionId) {
      console.error('Portfolio ID or Function ID is not set');
      return;
    }

    const functionModuleFormData = new FormData();
    functionGroups.forEach((group) => {
      group.areas.forEach((area) => {
        functionModuleFormData.append(area.label, area.text || '');
      });
    });

    for (let pair of functionModuleFormData.entries()) {
      console.log('Function Module FormData:', pair[0], pair[1]);
    }

    try {
      const functionModuleResponse = await axios.post(
        `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio-function/${functionId}/module`,
        functionModuleFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Function module saved:', functionModuleResponse.data);
      
      navigate('/design');
    } catch (error) {
      console.error('Error saving function module:', error);
    }
  };

  return (
    <div className="form-body">
      <div className="fixed-bar">
        <div className="button-container">
          <button onClick={addFunctionGroup}>기능 추가</button>
          <button onClick={handleSaveFunction} disabled={!portfolioId}>저장</button>
          {/* <button onClick={handleSaveFunctionModule} disabled={!portfolioId || !functionId}>다음</button> */}
        </div>
      </div>
      <div className="form-container">
        {functionGroups.map((group) => (
          <div key={group.id} className="dynamic-textarea-group">
            {group.areas.map((area) => (
              <div key={area.id} className="dynamic-area">
                <label>{area.label}</label>
                <textarea
                  className="textarea-field"
                  value={area.text}
                  onChange={(e) => handleDynamicChange(e, area.id, group.id)}
                  style={{ height: area.height, overflowY: 'hidden' }}
                />
              </div>
            ))}
            <button
              className="remove-group-button"
              onClick={() => removeFunctionGroup(group.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Function;






// import './Form.css';
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Function = () => {
//   const [functionGroups, setFunctionGroups] = useState([
//     {
//       id: Date.now(),
//       areas: [
//         {
//           id: Date.now(),
//           label: 'name',
//           text: '',
//           height: '50px',
//         },
//         {
//           id: Date.now() + 1,
//           label: 'description',
//           text: '',
//           height: '50px',
//         },
//       ],
//     },
//   ]);

//   const [portfolioId, setPortfolioId] = useState(null);
//   const [functionId, setFunctionId] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPortfolioId = async () => {
//       try {
//         const response = await axios.get('http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio');
//         const portfolios = response.data.data;
//         if (portfolios.length > 0) {
//           setPortfolioId(portfolios[0].id);
//           console.log('Fetched Portfolio ID:', portfolios[0].id);
//         }
//       } catch (error) {
//         console.error('Error fetching portfolios:', error);
//       }
//     };

//     fetchPortfolioId();
//   }, []);

//   const addFunctionGroup = () => {
//     const now = Date.now();
//     const newGroup = {
//       id: now,
//       areas: [
//         {
//           id: now,
//           label: 'name',
//           text: '',
//           height: '50px',
//         },
//         {
//           id: now + 1,
//           label: 'description',
//           text: '',
//           height: '50px',
//         },
//       ],
//     };
//     setFunctionGroups((prevGroups) => [...prevGroups, newGroup]);
//   };

//   const handleDynamicChange = (e, areaId, groupId) => {
//     const { value } = e.target;
//     setFunctionGroups((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               areas: group.areas.map((area) =>
//                 area.id === areaId ? { ...area, text: value } : area
//               ),
//             }
//           : group
//       )
//     );
//   };

//   const removeFunctionGroup = (groupId) => {
//     setFunctionGroups((prevGroups) =>
//       prevGroups.filter((group) => group.id !== groupId)
//     );
//   };

//   const handleSaveFunction = async () => {
//     if (!portfolioId) {
//       console.error('Portfolio ID is not set');
//       return;
//     }

//     const functionFormData = new FormData();
//     functionGroups.forEach((group) => {
//       group.areas.forEach((area) => {
//         functionFormData.append(area.label, area.text || '');
//       });
//     });

//     for (let pair of functionFormData.entries()) {
//       console.log('Function FormData:', pair[0], pair[1]);
//     }

//     try {
//       const functionResponse = await axios.post(
//         `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio/${portfolioId}/function`,
//         functionFormData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log('Function API Response:', functionResponse);

//       // 응답 데이터를 로그에 출력
//       console.log('Function API Response Data:', functionResponse.data);

//       // 실제로 데이터 구조를 확인하고 적절히 수정
//       const { data } = functionResponse;
//       if (data && typeof data === 'object') {
//         const newFunctionId = data.id; // API 응답에서 functionId 추출
//         setFunctionId(newFunctionId);
//         console.log('Function created:', newFunctionId);
//       } else {
//         console.error('Invalid response structure:', functionResponse.data);
//       }
//     } catch (error) {
//       console.error('Error saving function:', error);
//     }
//   };

//   const handleSaveFunctionModule = async () => {
//     if (!portfolioId || !functionId) {
//       console.error('Portfolio ID or Function ID is not set');
//       return;
//     }

//     const functionModuleFormData = new FormData();
//     functionGroups.forEach((group) => {
//       group.areas.forEach((area) => {
//         functionModuleFormData.append(area.label, area.text || '');
//       });
//     });

//     for (let pair of functionModuleFormData.entries()) {
//       console.log('Function Module FormData:', pair[0], pair[1]);
//     }

//     try {
//       const functionModuleResponse = await axios.post(
//         `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio-function/${functionId}/module`,
//         functionModuleFormData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       console.log('Function module saved:', functionModuleResponse.data);

//       if (functionModuleResponse.status === 200) {
//         navigate('/design');
//       }
//     } catch (error) {
//       console.error('Error saving function module:', error);
//     }
//   };

//   return (
//     <div className="form-body">
//       <div className="fixed-bar">
//         <div className="button-container">
//           <button onClick={addFunctionGroup}>기능 추가</button>
//           <button onClick={handleSaveFunction} disabled={!portfolioId}>저장</button>
//           <button onClick={handleSaveFunctionModule} disabled={!portfolioId || !functionId}>다음</button>
//         </div>
//       </div>
//       <div className="form-container">
//         {functionGroups.map((group) => (
//           <div key={group.id} className="dynamic-textarea-group">
//             {group.areas.map((area) => (
//               <div key={area.id} className="dynamic-area">
//                 <label>{area.label}</label>
//                 <textarea
//                   className="textarea-field"
//                   value={area.text}
//                   onChange={(e) => handleDynamicChange(e, area.id, group.id)}
//                   style={{ height: area.height, overflowY: 'hidden' }}
//                 />
//               </div>
//             ))}
//             <button
//               className="remove-group-button"
//               onClick={() => removeFunctionGroup(group.id)}
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Function;
