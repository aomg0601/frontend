// src/components/ViewCard.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../routes/Form.css';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/worker-javascript';

function ViewCard({ updateCard, deleteCard }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { formData, textAreas = [] } = location.state || { formData: {}, textAreas: [] }; // デフォルト値を設定

  const handleEdit = () => {
    navigate('/ourform', { state: { formData, textAreas } });
  };

  const handleDelete = () => {
    deleteCard(formData.id);
    navigate('/myport');
  };

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
      <div className="input-row">
        <div className="label-container">
          <label>기간</label>
        </div>
        <DatePicker
          selected={formData.durationStart}
          dateFormat="yyyy년MM월dd일"
          className="datepicker"
          readOnly
        />
        <DatePicker
          selected={formData.durationEnd}
          dateFormat="yyyy년MM월dd일"
          className="datepicker"
          readOnly
        />
        <div className="label-container" style={{ marginLeft: '20px' }}>
          <label>이름</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.name}
          readOnly
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label>사용기술 / 언어</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.technology}
          readOnly
        />
      </div>
      <div className="input-group last-input-group">
        <div className="label-container">
          <label>프로젝트 개요</label>
        </div>
        <textarea
          className="textarea-field"
          value={formData.summary}
          readOnly
        />
      </div>
      {textAreas.length > 0 && textAreas.map((group) => (
        <div key={group.id} className="dynamic-textarea-group">
          {group.areas.map((area) => (
            <div key={area.id}>
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
      ))}
      <div className="button-container">
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleDelete} style={{ marginLeft: '20px' }}>
          삭제
        </button>
      </div>
    </div>
  );
}

export default ViewCard;
