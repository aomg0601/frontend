import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function CreatePPT() {
  const location = useLocation();
  const { formData, textAreas } = location.state || { formData: {}, textAreas: [] };
  const [pptUrl, setPptUrl] = useState(null);

  useEffect(() => {
    if (formData.title && textAreas.length > 0) {
      generatePPT();
    }
  }, [formData, textAreas]);

  const generatePPT = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/ppt/generate`, { 
        title: formData.title,
        summary: formData.summary,
        textAreas: textAreas.map(group => group.areas.map(area => ({ text: area.text }))).flat()
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPptUrl(url);
    } catch (error) {
      console.error('PPT生成中にエラーが発生しました', error);
    }
  };

  return (
    <div>
      <h1>PPT 레이아웃을 선택하세요</h1>
      {pptUrl && (
        <a href={pptUrl} download="presentation.pptx">PPT 다운로드</a>
      )}
    </div>
  );
}

export default CreatePPT;
