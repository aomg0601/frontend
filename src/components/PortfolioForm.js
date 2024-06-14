import React from 'react';
import axios from 'axios';

const API_URL = 'http://ec2-3-37-127-162.ap-northeast-2.compute.amazonaws.com:8080/portfolio';

function PortfolioForm({ formData }) {
  const handleSubmit = async () => {
    const userId = 1; // ここに適切なuserIdを設定
    const requestPayload = {
      image: formData.image || '',
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      teamNum: formData.teamNum,
      description: `${formData.technology} + ${formData.summary}`,
      contribution: formData.contribution || 0,
      status: formData.status ? 'SHARE' : 'NONE'
    };

    try {
      const response = await axios.post(`${API_URL}?userId=${userId}`, requestPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default PortfolioForm;
