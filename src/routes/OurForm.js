import './Form.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createPortfolio, updatePortfolio } from '../api/Api';

function OurForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: '',
    startDate: null,
    endDate: null,
    teamNum: '',
    contribution: '',
    description: '',
    techStacks: '',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [portfolioId, setPortfolioId] = useState(null);
  const [showExtraOptions, setShowExtraOptions] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { portfolioId } = location.state;
      setPortfolioId(portfolioId);
    }
  }, [location.state]);

  useEffect(() => {
    setIsFormValid(validateForm(formData));
  }, [formData]);

  const validateForm = (formData) => {
    return (
      formData.title.length >= 5 &&
      formData.teamNum !== '' &&
      formData.contribution !== '' &&
      formData.description.length >= 5 &&
      formData.startDate !== null &&
      formData.endDate !== null
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    autoResizeTextArea(e);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const intValue = parseInt(value, 10);
    setFormData((prevState) => ({
      ...prevState,
      [name]: isNaN(intValue) ? '' : intValue,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prevState) => ({ ...prevState, [field]: date }));
  };

  const handleDocumentSave = async () => {
    if (isFormValid) {
      try {
        console.log('FormData:', formData);
        const token = localStorage.getItem('accessToken');
        console.log('AccessToken:', token);

        const response = await createPortfolio(formData);
        console.log('Portfolio Response:', response);
        setPortfolioId(response.id);
        console.log('Set Portfolio ID:', response.id);
        setIsSaved(true);
      } catch (error) {
        console.error('Error creating portfolio:', error);
        alert('포트폴리오 저장 중 오류가 발생했습니다');
      }
    }
  };

  const autoResizeTextArea = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    console.log('Portfolio ID:', portfolioId);
    navigate(path, { state: { portfolioId } });
  };

  const handleRegisterClick = () => {
    setShowExtraOptions(true);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <div className='form-body'>
      <div className="fixed-bar">
        <div className="button-container">
          {!isSaved && (
            <button onClick={handleDocumentSave} disabled={!isFormValid}>문서저장</button>
          )}
          {isSaved && (
            <>
              <button onClick={() => handleNavigation('/code')}>코드(설명)</button>
              <button onClick={() => handleNavigation('/design')}>설계</button>
              <button onClick={() => handleNavigation('/function')}>기능명세</button>
              <button onClick={() => handleNavigation('/database')}>DB</button>
              <button onClick={() => handleNavigation('/pfapi')}>API</button>
              <button onClick={handleRegisterClick}>등록</button>
            </>
          )}
        </div>
        {showExtraOptions && (
          <div className="extra-options">
            <label>
              <input type="checkbox" name="public" /> 공개
            </label>
            <label>
              <input type="checkbox" name="private" /> 비공개
            </label>
            <label>
              <button onClick={() => document.getElementById('cover-image-input').click()}>커버 이미지</button>
              <input
                id="cover-image-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverImageChange}
              />
            </label>
          </div>
        )}
      </div>

      <div className="form-container">
        <div className="input-group">
          <div className="label-container">
            <label htmlFor="title">*제목</label>
          </div>
          <textarea
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
            selected={formData.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            selectsStart
            startDate={formData.startDate}
            endDate={formData.endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="시작일"
            className="datepicker"
          />
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            selectsEnd
            startDate={formData.startDate}
            endDate={formData.endDate}
            dateFormat="yyyy-MM-dd"
            placeholderText="종료일"
            className="datepicker"
          />
        </div>
        <div className="input-row">
          <div className="label-container">
            <label htmlFor="teamNum">*인원수</label>
          </div>
          <input
            className="input-field"
            name="teamNum"
            type="number"
            onChange={handleNumberChange}
            value={formData.teamNum}
          />
        </div>
        <div className="input-group last-input-group">
          <div className="label-container">
            <label htmlFor="techStacks">*사용기술</label>
          </div>
          <textarea
            className="textarea-field"
            name="techStacks"
            onChange={handleChange}
            value={formData.techStacks}
          />
        </div>
        <div className="input-group">
          <div className="label-container">
            <label htmlFor="contribution">*나의 역할</label>
          </div>
          <textarea
            className="textarea-field"
            name="contribution"
            onChange={handleChange}
            value={formData.contribution}
          />
        </div>
        <div className="input-group last-input-group">
          <div className="label-container">
            <label htmlFor="description">*프로젝트 개요</label>
          </div>
          <textarea
            className="textarea-field"
            name="description"
            onChange={handleChange}
            value={formData.description}
          />
        </div>
      </div>
    </div>
  );
}

export default OurForm;
