import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'react-datepicker/dist/react-datepicker.css';
import '../routes/Form.css';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/worker-javascript';

function ViewCard({ updateCard, deleteCard }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, textAreas = [] } = location.state || { formData: {}, textAreas: [] };

  const handleEdit = () => {
    navigate('/ourform', { state: { formData, textAreas } });
  };

  const handleDelete = () => {
    deleteCard(formData.id);
    navigate('/myport');
  };

  const handleGenerateButtonClick = () => {
    navigate('/createppt', { state: { formData, textAreas } });
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const renderTextAreaGroup = (group) => {
    switch (group.type) {
      case 'design':
        return renderDesignArea(group);
      case 'db':
        return renderDBArea(group);
      default:
        return renderGenericArea(group);
    }
  };

  const renderDesignArea = (group) => (
    <div key={group.id} className="dynamic-textarea-group">
      <div className="design-header">
        <label>설계</label>
      </div>
      {group.areas.map((diagram) => (
        <div key={diagram.id} className="dynamic-area">
          {diagram.areas.map((area) => (
            <div key={area.id}>
              <label>{area.label}</label>
              {area.type === 'image' ? (
                <div>
                  {area.preview && (
                    <img
                      src={area.preview}
                      alt="Preview"
                      className="img-preview"
                    />
                  )}
                </div>
              ) : (
                <textarea
                  className="textarea-field"
                  value={area.text}
                  readOnly
                  style={{ height: area.height, overflowY: 'hidden' }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderDBArea = (group) => (
    <div key={group.id} className="dynamic-textarea-group">
      <div className="db-header">
        <label>데이터베이스</label>
      </div>
      {group.areas.map((schema) => (
        <div key={schema.id} className="schema-group">
          {(schema.areas || []).map((area) => (
            <div key={area.id} className={`dynamic-area ${area.layout === 'inline' ? 'inline-label' : ''}`}>
              <label>{area.label}</label>
              <textarea
                className="textarea-field"
                value={area.text}
                readOnly
                style={{ height: area.height, overflowY: 'hidden' }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderGenericArea = (group) => (
    <div key={group.id} className="dynamic-textarea-group">
      {group.areas.map((area) => (
        <div key={area.id} className={`dynamic-area ${area.layout === 'inline' ? 'inline-label' : ''}`}>
          <label>{area.label}</label>
          {area.type === 'code' ? (
            <AceEditor
              mode="javascript"
              theme="monokai"
              value={area.text}
              name={`code_editor_${area.id}`}
              readOnly
              setOptions={{
                showLineNumbers: true,
                tabSize: 2,
              }}
              style={{ width: '100%', height: area.height }}
            />
          ) : area.type === 'image' ? (
            <div>
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
              readOnly
              style={{ height: area.height, overflowY: 'hidden' }}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="form-container">
      <div className="input-group">
        <div className="label-container">
          <label>제목</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.title}
          readOnly
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label>기간</label>
        </div>
        <textarea
          className="textarea-field"
          value={`${formatDate(formData.startDate)} ～ ${formatDate(formData.endDate)}`}
          readOnly
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label>인원수</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.teamNum}
          readOnly
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label>기여도</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.contribution}
          readOnly
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label>사용기술</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.techStacks}
          readOnly
        />
      </div>
      <div className="input-group last-input-group">
        <div className="label-container">
          <label>프로젝트 개요</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.description}
          readOnly
        />
      </div>
      {textAreas.length > 0 && textAreas.map(renderTextAreaGroup)}
      <div className="button-container">
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleDelete} style={{ marginLeft: '20px' }}>
          삭제
        </button>
        <button onClick={handleGenerateButtonClick} style={{ marginLeft: '20px' }}>
          생성
        </button>
      </div>
    </div>
  );
}

export default ViewCard;







// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AceEditor from 'react-ace';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import '../routes/Form.css';
// import 'ace-builds/src-noconflict/ace';
// import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/worker-javascript';

// function ViewCard({ updateCard, deleteCard }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { formData, textAreas = [] } = location.state || { formData: {}, textAreas: [] };

//   const handleEdit = () => {
//     navigate('/ourform', { state: { formData, textAreas } });
//   };

//   const handleDelete = () => {
//     deleteCard(formData.id);
//     navigate('/myport');
//   };

//   const handleGenerateButtonClick = () => {
//     navigate('/createppt', { state: { formData, textAreas } });
//   };

//   const renderTextAreaGroup = (group) => {
//     switch (group.type) {
//       case 'design':
//         return renderDesignArea(group);
//       case 'db':
//         return renderDBArea(group);
//       default:
//         return renderGenericArea(group);
//     }
//   };

//   const renderDesignArea = (group) => (
//     <div key={group.id} className="dynamic-textarea-group">
//       <div className="design-header">
//         <label>설계</label>
//       </div>
//       {group.areas.map((diagram) => (
//         <div key={diagram.id} className="dynamic-area">
//           {diagram.areas.map((area) => (
//             <div key={area.id}>
//               <label>{area.label}</label>
//               {area.type === 'image' ? (
//                 <div>
//                   {area.preview && (
//                     <img
//                       src={area.preview}
//                       alt="Preview"
//                       className="img-preview"
//                     />
//                   )}
//                 </div>
//               ) : (
//                 <textarea
//                   className="textarea-field"
//                   value={area.text}
//                   readOnly
//                   style={{ height: area.height, overflowY: 'hidden' }}
//                 />
//               )}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
  
//   const renderDBArea = (group) => (
//     <div key={group.id} className="dynamic-textarea-group">
//       <div className="db-header">
//         <label>데이터베이스</label>
//       </div>
//       {group.areas.map((schema) => (
//         <div key={schema.id} className="schema-group">
//           {(schema.areas || []).map((area) => (
//             <div key={area.id} className={`dynamic-area ${area.layout === 'inline' ? 'inline-label' : ''}`}>
//               <label>{area.label}</label>
//               <textarea
//                 className="textarea-field"
//                 value={area.text}
//                 readOnly
//                 style={{ height: area.height, overflowY: 'hidden' }}
//               />
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
  
//   const renderGenericArea = (group) => (
//     <div key={group.id} className="dynamic-textarea-group">
//       {group.areas.map((area) => (
//         <div key={area.id} className={`dynamic-area ${area.layout === 'inline' ? 'inline-label' : ''}`}>
//           <label>{area.label}</label>
//           {area.type === 'code' ? (
//             <AceEditor
//               mode="javascript"
//               theme="monokai"
//               value={area.text}
//               name={`code_editor_${area.id}`}
//               readOnly
//               setOptions={{
//                 showLineNumbers: true,
//                 tabSize: 2,
//               }}
//               style={{ width: '100%', height: area.height }}
//             />
//           ) : area.type === 'image' ? (
//             <div>
//               {area.preview && (
//                 <img
//                   src={area.preview}
//                   alt="Preview"
//                   style={{ width: '100%', height: 'auto', marginTop: '10px' }}
//                 />
//               )}
//             </div>
//           ) : (
//             <textarea
//               className="textarea-field"
//               value={area.text}
//               readOnly
//               style={{ height: area.height, overflowY: 'hidden' }}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
  
//   return (
//     <div className="form-container">
//       <div className="input-group">
//         <div className="label-container">
//           <label>제목</label>
//         </div>
//         <textarea
//           className="textarea-field"
//           value={formData.title}
//           readOnly
//         />
//       </div>
//       <div className="input-row">
//         <div className="label-container">
//           <label>기간</label>
//         </div>
//         <DatePicker
//           selected={formData.durationStart}
//           dateFormat="yyyy년MM월dd일"
//           className="datepicker"
//           readOnly
//         />
//         <DatePicker
//           selected={formData.durationEnd}
//           dateFormat="yyyy년MM월dd일"
//           className="datepicker"
//           readOnly
//         />
//       </div>
//       <div className="input-group">
//         <div className="label-container">
//           <label>팀 구성</label>
//         </div>
//         <textarea
//           className="textarea-field"
//           value={formData.teamNum}
//           readOnly
//         />
//       </div>
      
//       <div className="input-group">
//         <div className="label-container">
//           <label>기여도</label>
//         </div>
//         <textarea
//           className="textarea-field"
//           value={formData.contribution}
//           readOnly
//         />
//       </div>
     
//       <div className="input-group last-input-group">
//         <div className="label-container">
//           <label>프로젝트 개요</label>
//         </div>
//         <textarea
//           className="textarea-field"
//           value={formData.summary}
//           readOnly
//         />
//       </div>
//       {textAreas.length > 0 && textAreas.map(renderTextAreaGroup)}
//       <div className="button-container">
//         <button onClick={handleEdit}>수정</button>
//         <button onClick={handleDelete} style={{ marginLeft: '20px' }}>
//           삭제
//         </button>
//         <button onClick={handleGenerateButtonClick} style={{ marginLeft: '20px' }}>
//           생성
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ViewCard;

