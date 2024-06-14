// import React from 'react';
// import './Popup.css';

// const SavePopup = ({ handleCloseSavePopup, handleConfirmSave }) => {
//   return (
//     <div className="popup">
//       <div className="popup-content">
//         <h3>저장하시겠습니까?</h3>
//         <div className="popup-buttons">
//           <button className="popup-button" onClick={handleCloseSavePopup}>닫기</button>
//           <button className="popup-button" onClick={handleConfirmSave}>예</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// SavePopup.jsの例
import React from 'react';

const SavePopup = ({ handleCloseSavePopup, handleConfirmSave }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>저장 확인</h2>
        <p>저장하시겠습니까?</p>
        <button onClick={handleConfirmSave}>저장</button>
        <button onClick={handleCloseSavePopup}>닫기</button>
      </div>
    </div>
  );
};

export default SavePopup;

