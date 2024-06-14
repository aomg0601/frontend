import './Form.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Design = () => {
  const [designGroups, setDesignGroups] = useState([
    {
      id: Date.now(),
      areas: [
        {
          id: Date.now(),
          type: 'file',
          label: 'image',
          file: null,
          preview: null,
          base64: '',
          height: 'auto',
        },
        {
          id: Date.now() + 1,
          type: 'text',
          label: 'diagram',
          text: '',
          height: '50px',
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

  const [portfolioId, setPortfolioId] = useState(null);
  const [designId, setDesignId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
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

  const addDesignGroup = () => {
    const now = Date.now();
    const newGroup = {
      id: now,
      areas: [
        {
          id: now,
          type: 'file',
          label: 'image',
          file: null,
          preview: null,
          base64: '',
          height: 'auto',
        },
        {
          id: now + 1,
          type: 'text',
          label: 'diagram',
          text: '',
          height: '50px',
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
    setDesignGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleDynamicChange = (e, areaId, groupId) => {
    const { value } = e.target;
    setDesignGroups((prevGroups) =>
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

  const handleFileChange = (e, areaId, groupId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignGroups((prevGroups) =>
          prevGroups.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  areas: group.areas.map((area) =>
                    area.id === areaId
                      ? { ...area, file: file, preview: reader.result, base64: reader.result.split(',')[1] }
                      : area
                  ),
                }
              : group
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDesignGroup = (groupId) => {
    setDesignGroups((prevGroups) =>
      prevGroups.filter((group) => group.id !== groupId)
    );
  };

  const handleSaveDesign = async () => {
    if (!portfolioId) {
      console.error('Portfolio ID is not set');
      return;
    }

    try {
      const designFormData = new FormData();
      designGroups.forEach((group) => {
        group.areas.forEach((area) => {
          if (area.type === 'text') {
            designFormData.append(area.label, area.text || '');
          }
        });
      });

      const designResponse = await axios.post(
        `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio/${portfolioId}/design`,
        designFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Design API Response:', designResponse);

      const designId = designResponse.data;
      setDesignId(designId);
      console.log('Design created:', designId);
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  const handleSaveDesignDiagram = async () => {
    if (!portfolioId || !designId) {
      console.error('Portfolio ID or Design ID is not set');
      return;
    }

    try {
      const designDiagramFormData = {
        image: '',
        diagram: '',
        description: '',
      };
      
      designGroups.forEach((group) => {
        group.areas.forEach((area) => {
          if (area.type === 'text') {
            designDiagramFormData[area.label] = area.text || '';
          } else if (area.type === 'file' && area.base64) {
            designDiagramFormData.image = area.base64;
          }
        });
      });

      console.log('Design Diagram FormData:', designDiagramFormData);

      const designDiagramResponse = await axios.post(
        `http://ec2-3-34-1-12.ap-northeast-2.compute.amazonaws.com:8080/portfolio-design/${designId}/diagram`,
        designDiagramFormData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Design diagram API Response:', designDiagramResponse);

      if (designDiagramResponse.status === 200) {
        setIsSaved(true);
      } else {
        console.error('Unexpected response status:', designDiagramResponse.status);
      }
    } catch (error) {
      console.error('Error saving design diagram:', error);
    }
  };

  return (
    <div className="form-body">
      <div className="fixed-bar">
        <div className="button-container">
          {!isSaved && (
            <>
              <button onClick={addDesignGroup}>설계 추가</button>
              <button onClick={handleSaveDesign} disabled={!portfolioId}>저장</button>
              <button onClick={handleSaveDesignDiagram} disabled={!portfolioId || !designId}>다음</button>
            </>
          )}
          {isSaved && (
            <>
              <button onClick={() => navigate('/code', { state: { portfolioId } })}>코드 추가</button>
              <button onClick={() => navigate('/design', { state: { portfolioId } })}>설계</button>
              <button onClick={() => navigate('/function', { state: { portfolioId } })}>기능명세</button>
              <button onClick={() => navigate('/database', { state: { portfolioId } })}>DB</button>
              <button onClick={() => navigate('/pfapi', { state: { portfolioId } })}>API</button>
              <button onClick={() => navigate('/', { state: { portfolioId } })}>등록</button>
            </>
          )}
        </div>
      </div>
      <div className="form-container">
        {designGroups.map((group) => (
          <div key={group.id} className="dynamic-textarea-group">
            {group.areas.map((area) => (
              <div key={area.id} className="dynamic-area">
                <label>{area.label}</label>
                {area.type === 'file' ? (
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
            <button
              className="remove-group-button"
              onClick={() => removeDesignGroup(group.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Design;
