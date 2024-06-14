import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';

const Code = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [codeGroups, setCodeGroups] = useState([
    {
      id: Date.now(),
      areas: [
        {
          id: Date.now(),
          type: 'text',
          label: 'name',
          text: '',
          height: '50px',
        },
        {
          id: Date.now() + 1,
          type: 'code',
          label: 'code',
          text: '',
          height: '200px',
        },
        {
          id: Date.now() + 2,
          type: 'text',
          label: 'description',
          text: '',
          height: '50px',
        },
      ],
    },
  ]);
  const [isSaved, setIsSaved] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);

  useEffect(() => {
    if (location.state && location.state.portfolioId) {
      setPortfolioId(location.state.portfolioId);
    }
  }, [location.state]);

  const addCodeGroup = () => {
    const now = Date.now();
    const newGroup = {
      id: now,
      areas: [
        {
          id: now,
          type: 'text',
          label: 'name',
          text: '',
          height: '50px',
        },
        {
          id: now + 1,
          type: 'code',
          label: 'code',
          text: '',
          height: '200px',
        },
        {
          id: now + 2,
          type: 'text',
          label: 'description',
          text: '',
          height: '50px',
        },
      ],
    };
    setCodeGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleDynamicChange = (e, areaId, groupId) => {
    const { value } = e.target;
    setCodeGroups((prevGroups) =>
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

  const handleEditorChange = (newValue, areaId, groupId) => {
    setCodeGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              areas: group.areas.map((area) =>
                area.id === areaId ? { ...area, text: newValue } : area
              ),
            }
          : group
      )
    );
  };

  const removeCodeGroup = (groupId) => {
    setCodeGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  const handleSave = () => {
    console.log('保存ボタンがクリックされました');
    setIsSaved(true);
    console.log('isSaved:', true);
  };

  return (
    <div className="form-body">
      <div className="fixed-bar">
        <div className="button-container">
          {!isSaved && (
            <>
              <button onClick={addCodeGroup}>코드 추가</button>
              <button onClick={handleSave}>저장</button>
            </>
          )}
          {isSaved && (
            <>
              <button onClick={() => navigate('/code', { state: { portfolioId } })}>코드 추가</button>
              <button onClick={() => navigate('/design', { state: { portfolioId } })}>설계</button>
              <button onClick={() => navigate('/function', { state: { portfolioId } })}>기능명세</button>
              <button onClick={() => navigate('/database', { state: { portfolioId } })}>DB</button>
              <button onClick={() => navigate('/pfapi', { state: { portfolioId } })}>API</button>
              <button onClick={() => navigate('/register', { state: { portfolioId } })}>등록</button>
            </>
          )}
        </div>
      </div>
      <div className="form-container">
        {codeGroups.map((group) => (
          <div key={group.id} className="dynamic-textarea-group">
            {group.areas.map((area) => (
              <div key={area.id} className="dynamic-area">
                <label>{area.label}</label>
                {area.type === 'code' ? (
                  <AceEditor
                    mode="javascript"
                    theme="monokai"
                    value={area.text}
                    onChange={(newValue) => handleEditorChange(newValue, area.id, group.id)}
                    name={`code_editor_${area.id}`}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                    }}
                    style={{ width: '100%', height: area.height }}
                  />
                ) : (
                  <textarea
                    className="textarea-field"
                    value={area.text}
                    onChange={(e) => handleDynamicChange(e, area.id, group.id)}
                    style={{ height: area.height, overflowY: 'hidden' }}
                  />
                )}
              </div>
            ))}
            <button className="remove-group-button" onClick={() => removeCodeGroup(group.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Code;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AceEditor from 'react-ace';
// import 'ace-builds/webpack-resolver';
// import 'ace-builds/src-noconflict/ace';
// import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/worker-javascript';

// const Code = () => {
//   const [codeGroups, setCodeGroups] = useState([
//     {
//       id: Date.now(),
//       areas: [
//         {
//           id: Date.now(),
//           type: 'text',
//           label: 'name',
//           text: '',
//           height: '50px',
//         },
//         {
//           id: Date.now() + 1,
//           type: 'code',
//           label: 'code',
//           text: '',
//           height: '200px',
//         },
//         {
//           id: Date.now() + 2,
//           type: 'text',
//           label: 'description',
//           text: '',
//           height: '50px',
//         },
//       ],
//     },
//   ]);

//   const [portfolioId, setPortfolioId] = useState(null);

//   useEffect(() => {
//     const fetchPortfolioId = async () => {
//       try {
//         const response = await axios.get('http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio');
//         const portfolios = response.data.data; // API 응답 데이터가 이와 같이 구성되어 있다고 가정합니다。
//         if (portfolios.length > 0) {
//           setPortfolioId(portfolios[0].id); // 첫 번째 포트폴리오의 ID를 사용
//           console.log('Fetched Portfolio ID:', portfolios[0].id);
//         }
//       } catch (error) {
//         console.error('Error fetching portfolios:', error);
//       }
//     };

//     fetchPortfolioId();
//   }, []);

//   const addCodeGroup = () => {
//     const now = Date.now();
//     const newGroup = {
//       id: now,
//       areas: [
//         {
//           id: now,
//           type: 'text',
//           label: 'name',
//           text: '',
//           height: '50px',
//         },
//         {
//           id: now + 1,
//           type: 'code',
//           label: 'code',
//           text: '',
//           height: '200px',
//         },
//         {
//           id: now + 2,
//           type: 'text',
//           label: 'description',
//           text: '',
//           height: '50px',
//         },
//       ],
//     };
//     setCodeGroups((prevGroups) => [...prevGroups, newGroup]);
//   };

//   const handleDynamicChange = (e, areaId, groupId) => {
//     const { value } = e.target;
//     setCodeGroups((prevGroups) =>
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

//   const handleEditorChange = (newValue, areaId, groupId) => {
//     setCodeGroups((prevGroups) =>
//       prevGroups.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               areas: group.areas.map((area) =>
//                 area.id === areaId ? { ...area, text: newValue } : area
//               ),
//             }
//           : group
//       )
//     );
//   };

//   const removeCodeGroup = (groupId) => {
//     setCodeGroups((prevGroups) =>
//       prevGroups.filter((group) => group.id !== groupId)
//     );
//   };

//   const handleSave = async () => {
//     if (!portfolioId) {
//       console.error('Portfolio ID is not set');
//       return;
//     }

//     try {
//       const codeFormData = new FormData();
//       codeGroups.forEach((group) => {
//         group.areas.forEach((area) => {
//           codeFormData.append(area.label, area.text || '');
//         });
//       });

//       // 포트폴리오 코드 생성
//       const codeResponse = await axios.post(
//         `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio/${portfolioId}/code`,
//         codeFormData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       const newCodeId = codeResponse.data.id;
//       console.log('Code created:', newCodeId);

//       // 콘솔에 FormData 내용 출력
//       for (let pair of codeFormData.entries()) {
//         console.log(pair[0] + ': ' + pair[1]);
//       }

//       console.log('Code saved:', codeResponse.data);
//     } catch (error) {
//       console.error('Error saving code:', error);
//     }
//   };

//   return (
//     <div className="form-body">
//       <div className="fixed-bar">
//         <div className="button-container">
//           <button onClick={addCodeGroup}>코드 추가</button>
//           <button onClick={handleSave} disabled={!portfolioId}>저장</button>
//         </div>
//       </div>
//       <div className="form-container">
//         {codeGroups.map((group) => (
//           <div key={group.id} className="dynamic-textarea-group">
//             {group.areas.map((area) => (
//               <div key={area.id} className="dynamic-area">
//                 <label>{area.label}</label>
//                 {area.type === 'code' ? (
//                   <AceEditor
//                     mode="javascript"
//                     theme="monokai"
//                     value={area.text}
//                     onChange={(newValue) => handleEditorChange(newValue, area.id, group.id)}
//                     name={`code_editor_${area.id}`}
//                     setOptions={{
//                       enableBasicAutocompletion: true,
//                       enableLiveAutocompletion: true,
//                       enableSnippets: true,
//                       showLineNumbers: true,
//                       tabSize: 2,
//                     }}
//                     style={{ width: '100%', height: area.height }}
//                   />
//                 ) : (
//                   <textarea
//                     className="textarea-field"
//                     value={area.text}
//                     onChange={(e) => handleDynamicChange(e, area.id, group.id)}
//                     style={{ height: area.height, overflowY: 'hidden' }}
//                   />
//                 )}
//               </div>
//             ))}
//             <button
//               className="remove-group-button"
//               onClick={() => removeCodeGroup(group.id)}
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Code;


