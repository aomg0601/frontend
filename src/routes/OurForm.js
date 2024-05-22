// src/components/OurForm.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Form.css';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/worker-javascript';
import Popup from '../components/Popup';

function OurForm({ addCard, updateCard }) {
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    durationStart: null,
    durationEnd: null,
    name: '',
    technology: '',
    summary: '',
    coverPhoto: null,
    id: null,
  });

  const [textAreas, setTextAreas] = useState([]);
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  const refs = {
    title: useRef(null),
    durationStart: useRef(null),
    durationEnd: useRef(null),
    name: useRef(null),
    technology: useRef(null),
    summary: useRef(null),
  };

  useEffect(() => {
    if (location.state) {
      const { formData, textAreas } = location.state;
      setFormData(formData);
      setTextAreas(textAreas || []);
    }
  }, [location.state]);

  useEffect(() => {
    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        ref.current.style.height = 'auto';
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    });
  }, [formData]);

  useEffect(() => {
    const isValid =
      formData.title.length >= 5 &&
      formData.name.length >= 2 &&
      formData.technology.length >= 5 &&
      formData.summary.length >= 5 &&
      formData.durationStart !== null &&
      formData.durationEnd !== null;

    setIsFormValid(isValid);
    if (!isValid) {
      setIsSaved(false);
    }
  }, [formData]);

  const handleSaveButtonClick = () => {
    const currentDate = new Date();
    const savedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;

    const newCard = {
      ...formData,
      savedDate,
      textAreas, // 수정 부분 
      id: formData.id !== null ? formData.id : Date.now(),
    };

    if (formData.id !== null) {
      updateCard(newCard);
    } else {
      addCard(newCard);
      setFormData((prevState) => ({ ...prevState, id: newCard.id }));
    }

    setIsSaved(true);
    setIsEdited(false);
  };

  const handleGenerateButtonClick = () => {
    setShowPopup(true);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedOption('');
  };

  const handleNext = () => {
    if (selectedOption === 'AI') {
      navigate('/createquestion');
    } else if (selectedOption === 'PPT') {
      navigate('/createppt', { state: { formData, textAreas } });
    }
  };

  const addTextArea = (type) => {
    const now = Date.now();
    let newGroup = { id: now, areas: [] };

    if (type === 1) {
      newGroup.areas.push({
        id: now,
        type: 'code',
        label: '코드',
        text: '',
        height: '50px',
      });
      newGroup.areas.push({
        id: now + 1,
        type: 'text',
        label: '설명',
        text: '',
        height: '50px',
      });
    } else if (type === 2) {
      newGroup.areas.push({
        id: now,
        type: 'image',
        label: '이미지',
        file: null,
        preview: null,
        height: 'auto',
      });
      newGroup.areas.push({
        id: now + 1,
        type: 'text',
        label: '텍스트',
        text: '',
        height: '50px',
      });
    } else {
      newGroup.areas.push({
        id: now,
        type: 'text',
        label: type === 3 ? '기능' : '역할',
        text: '',
        height: '50px',
      });
    }

    setTextAreas((prevTextAreas) => [...prevTextAreas, newGroup]);
  };

  const handleEditorChange = (newValue, areaId, groupId) => {
    const newHeight = `${newValue.split('\n').length * 16 + 20}px`;
    setTextAreas((prevTextAreas) =>
      prevTextAreas.map((group) =>
        group.id === groupId
          ? {
              ...group,
              areas: group.areas.map((area) =>
                area.id === areaId
                  ? { ...area, text: newValue, height: newHeight }
                  : area
              ),
            }
          : group
      )
    );
    setIsEdited(true);
    setIsSaved(false);
  };

  const handleDynamicChange = (e, areaId, groupId) => {
    const { value } = e.target;
    const newHeight = `${value.split('\n').length * 16 + 20}px`;
    setTextAreas((prevTextAreas) =>
      prevTextAreas.map((group) =>
        group.id === groupId
          ? {
              ...group,
              areas: group.areas.map((area) =>
                area.id === areaId ? { ...area, text: value, height: newHeight } : area
              ),
            }
          : group
      )
    );
    setIsEdited(true);
    setIsSaved(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    autoResizeTextArea(e);
    setIsEdited(true);
    setIsSaved(false);
  };

  const handleDateChange = (date, field) => {
    setFormData((prevState) => ({ ...prevState, [field]: date }));
    setIsEdited(true);
    setIsSaved(false);
  };

  const handleFileChange = (e, areaId, groupId) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const preview = reader.result;
      setTextAreas((prevTextAreas) =>
        prevTextAreas.map((group) =>
          group.id === groupId
            ? {
                ...group,
                areas: group.areas.map((area) =>
                  area.id === areaId ? { ...area, file, preview, height: 'auto' } : area
                ),
              }
            : group
        )
      );
    };
    reader.readAsDataURL(file);
    setIsEdited(true);
    setIsSaved(false);
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevState) => ({ ...prevState, coverPhoto: reader.result }));
        setIsEdited(true);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeTextArea = (groupId) => {
    setTextAreas((prevTextAreas) => prevTextAreas.filter((group) => group.id !== groupId));
    setIsEdited(true);
    setIsSaved(false);
  };

  const autoResizeTextArea = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div>
      <div className="fixed-bar">
        <div className="button-container">
          <button onClick={() => addTextArea(1)}>코드+설명</button>
          <button onClick={() => addTextArea(2)}>설계(사진+글)</button>
          <button onClick={() => addTextArea(3)}>기능명세</button>
          <button onClick={() => addTextArea(4)}>나의 역할</button>
          {isFormValid && (
            <>
              <button
                style={{ marginLeft: '20px' }}
                onClick={() => document.getElementById('cover-photo-input').click()}
              >
                커버 이미지 선택
              </button>
              <input
                type="file"
                id="cover-photo-input"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleCoverPhotoChange}
              />
              {formData.coverPhoto && <span className="photo-selected">이미지가 선택되었습니다</span>}
              <button onClick={handleSaveButtonClick} style={{ marginLeft: '20px' }}>
                저장
              </button>
            </>
          )}
          {isSaved && !isEdited && (
            <button onClick={handleGenerateButtonClick} style={{ marginLeft: '20px' }}>
              생성
            </button>
          )}
        </div>
      </div>
      <div className="form-container">
        <div className="input-group">
          <div className="label-container">
            <label htmlFor="title">*제목</label>
          </div>
          <textarea
            ref={refs.title}
            className="textarea-field"
            name="title"
            onChange={handleChange}
            value={formData.title}
          />
        </div>
        <div className="input-row">
          <div className="label-container">
            <label htmlFor="duration">*기간</label>
          </div>
          <DatePicker
            selected={formData.durationStart}
            onChange={(date) => handleDateChange(date, 'durationStart')}
            selectsStart
            startDate={formData.durationStart}
            endDate={formData.durationEnd}
            dateFormat="yyyy년MM월dd일"
            placeholderText="시작일"
            className="datepicker"
          />
          <DatePicker
            selected={formData.durationEnd}
            onChange={(date) => handleDateChange(date, 'durationEnd')}
            selectsEnd
            startDate={formData.durationStart}
            endDate={formData.durationEnd}
            dateFormat="yyyy년MM월dd일"
            placeholderText="종료일"
            className="datepicker"
          />
          <div className="label-container" style={{ marginLeft: '20px' }}>
            <label htmlFor="name">*이름</label>
          </div>
          <textarea
            ref={refs.name}
            className="textarea-field"
            name="name"
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className="input-group">
          <div className="label-container">
            <label htmlFor="technology">*사용기술 / 언어</label>
          </div>
          <textarea
            ref={refs.technology}
            className="textarea-field"
            name="technology"
            onChange={handleChange}
            value={formData.technology}
          />
        </div>
        <div className="input-group last-input-group">
          <div className="label-container">
            <label htmlFor="summary">*프로젝트 개요</label>
          </div>
          <textarea
            ref={refs.summary}
            className="textarea-field"
            name="summary"
            onChange={handleChange}
            value={formData.summary}
          />
        </div>
        {textAreas.map((group) => (
          <div key={group.id} className="dynamic-textarea-group">
            {group.areas.map((area) => (
              <div key={area.id}>
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
                ) : area.type === 'image' ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, area.id, group.id)}
                    />
                    {area.preview && (
                      <img
                        src={area.preview}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                      />
                    )}
                  </div>
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
            <button className="remove-button" onClick={() => removeTextArea(group.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {showPopup && (
        <Popup
          selectedOption={selectedOption}
          handleOptionChange={handleOptionChange}
          handleClosePopup={handleClosePopup}
          handleNext={handleNext}
        />
      )}
    </div>
  );
}

export default OurForm;








// // src/components/OurForm.js
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AceEditor from 'react-ace';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import './Form.css';
// import 'ace-builds/src-noconflict/ace';
// import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/worker-javascript';
// import Popup from '../components/Popup';

// function OurForm({ addCard, updateCard }) {
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     title: '',
//     durationStart: null,
//     durationEnd: null,
//     name: '',
//     technology: '',
//     summary: '',
//     coverPhoto: null,
//     id: null,
//   });

//   const [textAreas, setTextAreas] = useState([]);
//   const navigate = useNavigate();
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [isEdited, setIsEdited] = useState(false);

//   const refs = {
//     title: useRef(null),
//     durationStart: useRef(null),
//     durationEnd: useRef(null),
//     name: useRef(null),
//     technology: useRef(null),
//     summary: useRef(null),
//   };

//   useEffect(() => {
//     if (location.state) {
//       const { formData, textAreas } = location.state;
//       setFormData(formData);
//       setTextAreas(textAreas || []);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     Object.values(refs).forEach((ref) => {
//       if (ref.current) {
//         ref.current.style.height = 'auto';
//         ref.current.style.height = `${ref.current.scrollHeight}px`;
//       }
//     });
//   }, [formData]);

//   useEffect(() => {
//     const isValid =
//       formData.title.length >= 5 &&
//       formData.name.length >= 2 &&
//       formData.technology.length >= 5 &&
//       formData.summary.length >= 5 &&
//       formData.durationStart !== null &&
//       formData.durationEnd !== null;

//     setIsFormValid(isValid);
//     if (!isValid) {
//       setIsSaved(false);
//     }
//   }, [formData]);

//   const handleSaveButtonClick = () => {
//     const currentDate = new Date();
//     const savedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;

//     const newCard = {
//       ...formData,
//       savedDate,
//       id: formData.id !== null ? formData.id : Date.now(),
//     };

//     if (formData.id !== null) {
//       updateCard(newCard);
//     } else {
//       addCard(newCard);
//       setFormData((prevState) => ({ ...prevState, id: newCard.id }));
//     }

//     setIsSaved(true);
//     setIsEdited(false);
//   };

//   const handleGenerateButtonClick = () => {
//     setShowPopup(true);
//   };

//   const handleOptionChange = (option) => {
//     setSelectedOption(option);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     setSelectedOption('');
//   };

//   const handleNext = () => {
//     if (selectedOption === 'AI') {
//       navigate('/createquestion');
//     } else if (selectedOption === 'PPT') {
//       navigate('/createppt', { state: { formData, textAreas } });
//     }
//   };

//   const addTextArea = (type) => {
//     const now = Date.now();
//     let newGroup = { id: now, areas: [] };

//     if (type === 1) {
//       newGroup.areas.push({
//         id: now,
//         type: 'code',
//         label: '코드',
//         text: '',
//         height: '50px',
//       });
//       newGroup.areas.push({
//         id: now + 1,
//         type: 'text',
//         label: '설명',
//         text: '',
//         height: '50px',
//       });
//     } else if (type === 2) {
//       newGroup.areas.push({
//         id: now,
//         type: 'image',
//         label: '이미지',
//         file: null,
//         preview: null,
//         height: 'auto',
//       });
//       newGroup.areas.push({
//         id: now + 1,
//         type: 'text',
//         label: '텍스트',
//         text: '',
//         height: '50px',
//       });
//     } else {
//       newGroup.areas.push({
//         id: now,
//         type: 'text',
//         label: type === 3 ? '기능' : '역할',
//         text: '',
//         height: '50px',
//       });
//     }

//     setTextAreas((prevTextAreas) => [...prevTextAreas, newGroup]);
//   };

//   const handleEditorChange = (newValue, areaId, groupId) => {
//     const newHeight = `${newValue.split('\n').length * 16 + 20}px`;
//     setTextAreas((prevTextAreas) =>
//       prevTextAreas.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               areas: group.areas.map((area) =>
//                 area.id === areaId
//                   ? { ...area, text: newValue, height: newHeight }
//                   : area
//               ),
//             }
//           : group
//       )
//     );
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const handleDynamicChange = (e, areaId, groupId) => {
//     const { value } = e.target;
//     const newHeight = `${value.split('\n').length * 16 + 20}px`;
//     setTextAreas((prevTextAreas) =>
//       prevTextAreas.map((group) =>
//         group.id === groupId
//           ? {
//               ...group,
//               areas: group.areas.map((area) =>
//                 area.id === areaId ? { ...area, text: value, height: newHeight } : area
//               ),
//             }
//           : group
//       )
//     );
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => ({ ...prevState, [name]: value }));
//     autoResizeTextArea(e);
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const handleDateChange = (date, field) => {
//     setFormData((prevState) => ({ ...prevState, [field]: date }));
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const handleFileChange = (e, areaId, groupId) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onload = () => {
//       const preview = reader.result;
//       setTextAreas((prevTextAreas) =>
//         prevTextAreas.map((group) =>
//           group.id === groupId
//             ? {
//                 ...group,
//                 areas: group.areas.map((area) =>
//                   area.id === areaId ? { ...area, file, preview, height: 'auto' } : area
//                 ),
//               }
//             : group
//         )
//       );
//     };
//     reader.readAsDataURL(file);
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const handleCoverPhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFormData((prevState) => ({ ...prevState, coverPhoto: reader.result }));
//         setIsEdited(true);
//         setIsSaved(false);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removeTextArea = (groupId) => {
//     setTextAreas((prevTextAreas) => prevTextAreas.filter((group) => group.id !== groupId));
//     setIsEdited(true);
//     setIsSaved(false);
//   };

//   const autoResizeTextArea = (e) => {
//     const target = e.target;
//     target.style.height = 'auto';
//     target.style.height = `${target.scrollHeight}px`;
//   };

//   return (
//     <div>
//       <div className="fixed-bar">
//         <div className="button-container">
//           <button onClick={() => addTextArea(1)}>코드+설명</button>
//           <button onClick={() => addTextArea(2)}>설계(사진+글)</button>
//           <button onClick={() => addTextArea(3)}>기능명세</button>
//           <button onClick={() => addTextArea(4)}>나의 역할</button>
//           {isFormValid && (
//             <>
//               <button
//                 style={{ marginLeft: '20px' }}
//                 onClick={() => document.getElementById('cover-photo-input').click()}
//               >
//                 커버 이미지 선택
//               </button>
//               <input
//                 type="file"
//                 id="cover-photo-input"
//                 style={{ display: 'none' }}
//                 accept="image/*"
//                 onChange={handleCoverPhotoChange}
//               />
//               {formData.coverPhoto && <span className="photo-selected">이미지가 선택되었습니다</span>}
//               <button onClick={handleSaveButtonClick} style={{ marginLeft: '20px' }}>
//                 저장
//               </button>
//             </>
//           )}
//           {isSaved && !isEdited && (
//             <button onClick={handleGenerateButtonClick} style={{ marginLeft: '20px' }}>
//               생성
//             </button>
//           )}
//         </div>
//       </div>
//       <div className="form-container">
//         <div className="input-group">
//           <div className="label-container">
//             <label htmlFor="title">*제목</label>
//           </div>
//           <textarea
//             ref={refs.title}
//             className="textarea-field"
//             name="title"
//             onChange={handleChange}
//             value={formData.title}
//           />
//         </div>
//         <div className="input-row">
//           <div className="label-container">
//             <label htmlFor="duration">*기간</label>
//           </div>
//           <DatePicker
//             selected={formData.durationStart}
//             onChange={(date) => handleDateChange(date, 'durationStart')}
//             selectsStart
//             startDate={formData.durationStart}
//             endDate={formData.durationEnd}
//             dateFormat="yyyy년MM월dd일"
//             placeholderText="시작일"
//             className="datepicker"
//           />
//           <DatePicker
//             selected={formData.durationEnd}
//             onChange={(date) => handleDateChange(date, 'durationEnd')}
//             selectsEnd
//             startDate={formData.durationStart}
//             endDate={formData.durationEnd}
//             dateFormat="yyyy년MM월dd일"
//             placeholderText="종료일"
//             className="datepicker"
//           />
//           <div className="label-container" style={{ marginLeft: '20px' }}>
//             <label htmlFor="name">*이름</label>
//           </div>
//           <textarea
//             ref={refs.name}
//             className="textarea-field"
//             name="name"
//             onChange={handleChange}
//             value={formData.name}
//           />
//         </div>
//         <div className="input-group">
//           <div className="label-container">
//             <label htmlFor="technology">*사용기술 / 언어</label>
//           </div>
//           <textarea
//             ref={refs.technology}
//             className="textarea-field"
//             name="technology"
//             onChange={handleChange}
//             value={formData.technology}
//           />
//         </div>
//         <div className="input-group last-input-group">
//           <div className="label-container">
//             <label htmlFor="summary">*프로젝트 개요</label>
//           </div>
//           <textarea
//             ref={refs.summary}
//             className="textarea-field"
//             name="summary"
//             onChange={handleChange}
//             value={formData.summary}
//           />
//         </div>
//         {textAreas.map((group) => (
//           <div key={group.id} className="dynamic-textarea-group">
//             {group.areas.map((area) => (
//               <div key={area.id}>
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
//                 ) : area.type === 'image' ? (
//                   <div>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) => handleFileChange(e, area.id, group.id)}
//                     />
//                     {area.preview && (
//                       <img
//                         src={area.preview}
//                         alt="Preview"
//                         style={{ width: '100%', height: 'auto', marginTop: '10px' }}
//                       />
//                     )}
//                   </div>
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
//             <button className="remove-button" onClick={() => removeTextArea(group.id)}>
//               ×
//             </button>
//           </div>
//         ))}
//       </div>

//       {showPopup && (
//         <Popup
//           selectedOption={selectedOption}
//           handleOptionChange={handleOptionChange}
//           handleClosePopup={handleClosePopup}
//           handleNext={handleNext}
//         />
//       )}
//     </div>
//   );
// }

// export default OurForm;



