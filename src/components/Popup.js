import React from 'react';
import './Popup.css';

const Popup = ({ selectedOption, handleOptionChange, handleClosePopup, handleNext }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <h3>종류를 선택</h3>
        <div className="option-container">
          <button
            className={`option-button ${selectedOption === 'AI' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('AI')}
          >
            질문
          </button>
          <button
            className={`option-button ${selectedOption === 'PPT' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('PPT')}
          >
            PPT
          </button>
        </div>
        <div className="popup-buttons">
          <button className="popup-button" onClick={handleClosePopup}>닫기</button>
          <button className="popup-button" disabled={!selectedOption} onClick={handleNext}>다음</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;





// import React from 'react';
// import './Popup.css';

// const Popup = ({ selectedOption, handleOptionChange, handleClosePopup, handleNext }) => {
//   return (
//     <div className="popup">
//       <div className="popup-content">
//         <h3>종류를 선택</h3>
//         <div className="option-container">
//           <button
//             className={`option-button ${selectedOption === 'AI' ? 'selected' : ''}`}
//             onClick={() => handleOptionChange('AI')}
//           >
//             질문
//           </button>
//           <button
//             className={`option-button ${selectedOption === 'PPT' ? 'selected' : ''}`}
//             onClick={() => handleOptionChange('PPT')}
//           >
//             PPT
//           </button>
//         </div>
//         <div className="popup-buttons">
//           <button className="popup-button" onClick={handleClosePopup}>뒤로</button>
//           <button className="popup-button" disabled={!selectedOption} onClick={handleNext}>다음</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Popup;
