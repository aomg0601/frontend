import React, { useState, useEffect } from 'react';
import './Form.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Pfapi = () => {
  const [apiGroups, setApiGroups] = useState([
    {
      id: Date.now(),
      areas: [
        {
          id: Date.now(),
          label: 'name',
          text: '',
          height: '50px',
        },
      ],
    },
  ]);

  const [portfolioId, setPortfolioId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolioId = async () => {
      try {
        const response = await axios.get('http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio');
        const portfolios = response.data.data; // API 응답 데이터가 이와 같이 구성되어 있다고 가정합니다.
        if (portfolios.length > 0) {
          setPortfolioId(portfolios[0].id); // 첫 번째 포트폴리오의 ID를 사용
          console.log('Fetched Portfolio ID:', portfolios[0].id);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolioId();
  }, []);

  const addApiGroup = () => {
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
      ],
    };
    setApiGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleDynamicChange = (e, areaId, groupId) => {
    const { value } = e.target;
    setApiGroups((prevGroups) =>
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

  const removeApiGroup = (groupId) => {
    setApiGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  const handleSave = async () => {
    if (!portfolioId) {
      console.error('Portfolio ID is not set');
      return;
    }

    try {
      const apiFormData = new FormData();
      apiGroups.forEach((group, index) => {
        group.areas.forEach((area) => {
          apiFormData.append(area.label, area.text || '');
        });
      });

      // 콘솔에 FormData 내용 출력
      for (let pair of apiFormData.entries()) {
        console.log('API FormData:', pair[0], pair[1]);
      }

      const apiResponse = await axios.post(
        `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio/${portfolioId}/api`,
        apiFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('API saved:', apiResponse.data);
      navigate('/code'); // 저장 후 '/code'로 이동
    } catch (error) {
      console.error('Error saving API:', error);
    }
  };

  return (
    <div className="form-body">
      <div className="fixed-bar">
        <div className="button-container">
          <button onClick={addApiGroup}>API</button>
          <button onClick={handleSave} disabled={!portfolioId}>저장</button>
        </div>
      </div>
      <div className="form-container">
        {apiGroups.map((group) => (
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
              onClick={() => removeApiGroup(group.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pfapi;
