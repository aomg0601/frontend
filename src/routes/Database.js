import './Form.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createDatabase, registerDatabaseSchema, getUserPortfolios } from '../api/Api';

const Database = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dbGroups, setDbGroups] = useState([
    {
      id: Date.now(),
      schema: '',
      description: '',
      isDatabaseCreated: false,
      isSchemaRegistered: false,
      databaseId: null,
    },
  ]);

  const [portfolioId, setPortfolioId] = useState(location.state?.portfolioId || null);
  const [isDatabaseCreated, setIsDatabaseCreated] = useState(false);
  const [databaseId, setDatabaseId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const data = await getUserPortfolios();
        setPortfolios(data);
        if (data.length > 0) {
          setSelectedPortfolioId(data[0].id); 
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    }
    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (!portfolioId) {
      console.error('Portfolio ID is not set');
    }
  }, [portfolioId]);

  const addDbGroup = () => {
    const now = Date.now();
    const newGroup = {
      id: now,
      schema: '',
      description: '',
      isSchemaRegistered: false,
    };
    setDbGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  const handleInputChange = (e, groupId, field) => {
    const { value } = e.target;
    if (value === null) return;
    setDbGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group
      )
    );
  };

  const removeDbGroup = (groupId) => {
    setDbGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
  };

  const handleDatabaseRegister = async () => {
    if (!portfolioId) {
      console.error('Portfolio ID is not set');
      return;
    }

    const dbData = { name: "New Database" };
    try {
      const response = await createDatabase(portfolioId, dbData);
      console.log('Database created:', response);
      setIsDatabaseCreated(true);
      setDatabaseId(response.id);
      setDbGroups((prevGroups) =>
        prevGroups.map((group) => ({ ...group, isDatabaseCreated: true, databaseId: response.id }))
      );
    } catch (error) {
      console.error('Error creating database:', error);
    }
  };

  const handleSchemaRegister = async () => {
    if (!isDatabaseCreated) {
      console.error('No database created');
      return;
    }

    try {
      for (const group of dbGroups) {
        const schemaData = {
          schema: group.schema,
          description: group.description,
        };
        const response = await registerDatabaseSchema(portfolioId, databaseId, schemaData);
        console.log('Schema registered:', response);
        setDbGroups((prevGroups) =>
          prevGroups.map((g) =>
            g.id === group.id ? { ...g, isSchemaRegistered: true } : g
          )
        );
      }
      setIsSaved(true);
    } catch (error) {
      console.error('Error registering schema:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  return (
    <div className="form-body">
      <div className="fixed-bar">
        <div className="button-container">
          {!isSaved && (
            <>
              <button onClick={addDbGroup}>DB 추가</button>
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
              <button onClick={() => navigate('/', { state: { portfolioId } })}>등록</button>
            </>
          )}
        </div>
      </div>
      <div className="form-container">
        {dbGroups.map((group) => (
          <div key={group.id} className="dynamic-textarea-group">
            <div className="dynamic-area">
              <label>Schema</label>
              <textarea
                className="textarea-field"
                value={group.schema}
                onChange={(e) => handleInputChange(e, group.id, 'schema')}
                disabled={group.isSchemaRegistered}
              />
            </div>
            <div className="dynamic-area">
              <label>Description</label>
              <textarea
                className="textarea-field"
                value={group.description}
                onChange={(e) => handleInputChange(e, group.id, 'description')}
                disabled={group.isSchemaRegistered}
              />
            </div>
            
            <div className="button-group">
            {!group.isDatabaseCreated && (
                <button
                  className="schema-register-button"
                  onClick={handleDatabaseRegister}
                >
                  등록
                </button>
              )}
              <button
                className="remove-group-button"
                onClick={() => removeDbGroup(group.id)}
                disabled={group.isSchemaRegistered}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Database;
