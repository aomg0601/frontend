import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'react-datepicker/dist/react-datepicker.css';
import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/worker-javascript';
import { Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment'; 
import DeleteIcon from '@mui/icons-material/Delete';
import './ViewBoardCard.css';

const ViewBoardCard = ({ addComment, toggleLike, formatDate, deleteComment }) => {
  const location = useLocation();
  const { formData, textAreas = [] } = location.state || { formData: {}, textAreas: [] };
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(formData.comments || []);
  const [likedComments, setLikedComments] = useState([]);
  const [likedDocuments, setLikedDocuments] = useState([]);
  const [open, setOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      const newComment = { text: comment, time: new Date(), id: Date.now(), likes: 0 };
      addComment(formData.id, newComment);
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  const handleToggleLike = (id) => {
    const alreadyLiked = likedComments.includes(id);
    setComments(comments.map(comment => 
      comment.id === id ? { ...comment, likes: comment.likes + (alreadyLiked ? -1 : 1) } : comment
    ));
    setLikedComments(alreadyLiked ? likedComments.filter(commentId => commentId !== id) : [...likedComments, id]);
    toggleLike(formData.id, id, !alreadyLiked);
  };

  const handleToggleDocumentLike = () => {
    const alreadyLiked = likedDocuments.includes(formData.id);
    setLikedDocuments(alreadyLiked ? likedDocuments.filter(docId => docId !== formData.id) : [...likedDocuments, formData.id]);
    formData.likes = formData.likes + (alreadyLiked ? -1 : 1);
    toggleLike(formData.id, formData.id, !alreadyLiked);
  };

  const handleDeleteComment = () => {
    setComments(comments.filter(comment => comment.id !== deleteTarget));
    deleteComment(formData.id, deleteTarget);
    setOpen(false);
  };

  const handleOpenDialog = (id) => {
    setDeleteTarget(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const formatTimeAgo = (time) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(time)) / 60000);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분전`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}시간전`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays}일전`;
    }
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
    <div className="view-board-card">
      <div className="left-section">
        <div className="bfixed-bar">
          <IconButton onClick={handleToggleDocumentLike} color={likedDocuments.includes(formData.id) ? "primary" : "default"}>
            <ThumbUpIcon /> {formData.likes}
          </IconButton>
          <Typography variant="h6">
            <IconButton color="default">
              <CommentIcon />
            </IconButton>
            {comments.length}
          </Typography>
        </div>
        <div className="bform-container">
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
        </div>
      </div>
      <div className="right-section">
        <div className="comment-section">
          <TextField
            label="댓글 작성"
            multiline
            value={comment}
            onChange={handleCommentChange}
            variant="outlined"
            fullWidth
            rows={4}
            margin="normal"
          />
          <Button onClick={handleAddComment} variant="contained" color="primary" className="comment-button">
            등록
          </Button>
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <Typography variant="body2">{comment.text}</Typography>
              <Typography variant="caption" color="textSecondary">
                {formatTimeAgo(comment.time)}
              </Typography>
              <div className="comment-actions">
                <IconButton
                  onClick={() => handleToggleLike(comment.id)}
                  color={likedComments.includes(comment.id) ? "primary" : "default"}
                >
                  <ThumbUpIcon /> {comment.likes}
                </IconButton>
                {comment.id && (
                  <IconButton onClick={() => handleOpenDialog(comment.id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"댓글을 삭제하시겠습니까?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            닫기
          </Button>
          <Button onClick={handleDeleteComment} color="primary" autoFocus>
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewBoardCard;












// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import AceEditor from 'react-ace';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'ace-builds/src-noconflict/ace';
// import 'ace-builds/src-noconflict/theme-monokai';
// import 'ace-builds/src-noconflict/mode-javascript';
// import 'ace-builds/src-noconflict/worker-javascript';
// import { Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import DeleteIcon from '@mui/icons-material/Delete';
// import './ViewBoardCard.css';

// const ViewBoardCard = ({ addComment, toggleLike, formatDate, deleteComment }) => {
//   const location = useLocation();
//   const { formData, textAreas = [] } = location.state || { formData: {}, textAreas: [] };
//   const [comment, setComment] = useState("");
//   const [comments, setComments] = useState(formData.comments || []);
//   const [likedComments, setLikedComments] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const handleCommentChange = (e) => {
//     setComment(e.target.value);
//   };

//   const handleAddComment = () => {
//     if (comment.trim() !== "") {
//       const newComment = { text: comment, time: new Date(), id: Date.now(), likes: 0 };
//       addComment(formData.id, newComment);
//       setComments([newComment, ...comments]);
//       setComment("");
//     }
//   };

//   const handleToggleLike = (id) => {
//     const alreadyLiked = likedComments.includes(id);
//     setComments(comments.map(comment => 
//       comment.id === id ? { ...comment, likes: comment.likes + (alreadyLiked ? -1 : 1) } : comment
//     ));
//     setLikedComments(alreadyLiked ? likedComments.filter(commentId => commentId !== id) : [...likedComments, id]);
//     toggleLike(formData.id, id, !alreadyLiked);
//   };

//   const handleDeleteComment = () => {
//     setComments(comments.filter(comment => comment.id !== deleteTarget));
//     deleteComment(formData.id, deleteTarget);
//     setOpen(false);
//   };

//   const handleOpenDialog = (id) => {
//     setDeleteTarget(id);
//     setOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setOpen(false);
//   };

//   const formatTimeAgo = (time) => {
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - new Date(time)) / 60000);
//     if (diffInMinutes < 60) {
//       return `${diffInMinutes}분전`;
//     } else if (diffInMinutes < 1440) {
//       const diffInHours = Math.floor(diffInMinutes / 60);
//       return `${diffInHours}시간전`;
//     } else {
//       const diffInDays = Math.floor(diffInMinutes / 1440);
//       return `${diffInDays}일전`;
//     }
//   };

//   return (
//     <div className="view-board-card">
//       <div className="left-section">
//         <div className="bfixed-bar">
//           <Typography variant="h6">좋아요: {formData.likes}</Typography>
//           <Typography variant="h6">댓글: {comments.length}</Typography>
//         </div>
//         <div className="form-container">
//           <div className="input-group">
//             <div className="label-container">
//               <label>제목</label>
//             </div>
//             <textarea
//               className="textarea-field"
//               value={formData.title}
//               readOnly
//             />
//           </div>
//           <div className="input-row">
//             <div className="label-container">
//               <label>기간</label>
//             </div>
//             <textarea
//               className="textarea-field"
//               value={`${formatDate(formData.durationStart)} ~ ${formatDate(formData.durationEnd)}`}
//               readOnly
//             />
//             <div className="label-container" style={{ marginLeft: '20px' }}>
//               <label>이름</label>
//             </div>
//             <textarea
//               className="textarea-field"
//               value={formData.name}
//               readOnly
//             />
//           </div>
//           <div className="input-group">
//             <div className="label-container">
//               <label>사용기술 / 언어</label>
//             </div>
//             <textarea
//               className="textarea-field"
//               value={formData.technology}
//               readOnly
//             />
//           </div>
//           <div className="input-group last-input-group">
//             <div className="label-container">
//               <label>프로젝트 개요</label>
//             </div>
//             <textarea
//               className="textarea-field"
//               value={formData.summary}
//               readOnly
//             />
//           </div>
//           {textAreas.length > 0 && textAreas.map((group) => (
//             <div key={group.id} className="dynamic-textarea-group">
//               {group.areas.map((area) => (
//                 <div key={area.id}>
//                   <label>{area.label}</label>
//                   {area.type === 'code' ? (
//                     <AceEditor
//                       mode="javascript"
//                       theme="monokai"
//                       value={area.text}
//                       name={`code_editor_${area.id}`}
//                       readOnly
//                       setOptions={{
//                         showLineNumbers: true,
//                         tabSize: 2,
//                       }}
//                       style={{ width: '100%', height: area.height }}
//                     />
//                   ) : area.type === 'image' ? (
//                     <div>
//                       {area.preview && (
//                         <img
//                           src={area.preview}
//                           alt="Preview"
//                           style={{ width: '100%', height: 'auto', marginTop: '10px' }}
//                         />
//                       )}
//                     </div>
//                   ) : (
//                     <textarea
//                       className="textarea-field"
//                       value={area.text}
//                       readOnly
//                       style={{ height: area.height, overflowY: 'hidden' }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="right-section">
//         <div className="comment-section">
//           <TextField
//             label="댓글 작성"
//             multiline
//             value={comment}
//             onChange={handleCommentChange}
//             variant="outlined"
//             fullWidth
//             rows={4}
//             margin="normal"
//           />
//           <Button onClick={handleAddComment} variant="contained" color="primary">
//             등록
//           </Button>
//           {comments.map((comment, index) => (
//             <div key={index} className="comment">
//               <Typography variant="body2">{comment.text}</Typography>
//               <Typography variant="caption" color="textSecondary">
//                 {formatTimeAgo(comment.time)}
//               </Typography>
//               <div className="comment-actions">
//                 <IconButton
//                   onClick={() => handleToggleLike(comment.id)}
//                   color={likedComments.includes(comment.id) ? "primary" : "default"}
//                 >
//                   <ThumbUpIcon /> {comment.likes}
//                 </IconButton>
//                 {comment.id && (
//                   <IconButton onClick={() => handleOpenDialog(comment.id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Dialog
//         open={open}
//         onClose={handleCloseDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"댓글을 삭제하시겠습니까?"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             댓글을 삭제하시겠습니까?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             닫기
//           </Button>
//           <Button onClick={handleDeleteComment} color="primary" autoFocus>
//             삭제
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default ViewBoardCard;





