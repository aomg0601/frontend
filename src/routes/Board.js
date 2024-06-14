import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import './Board.css'; 

const Board = ({ cards, updateCardLikes }) => {
  const navigate = useNavigate();

  const handleCardClick = (card) => {
    navigate('/viewboardcard', { state: { formData: card, textAreas: card.textAreas || [] } });
  };

  const toggleDocumentLike = (cardId, liked) => {
    updateCardLikes(cardId, liked);
  };

  return (
    <div className="board_body">
      <div className="board_title">전체 포트폴리오</div>
      <div className="card-container">
        <Grid container spacing={2}>
          {cards.slice().reverse().map((card, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card className="portfolio-card" onClick={() => handleCardClick(card)}>
                {card.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={card.image}
                    alt="Cover"
                    style={{ cursor: 'pointer' }}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {card.title}
                  </Typography>
                 
                  
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: card.image ? 3 : 'none',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}
                  >
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.savedDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    좋아요: {card.likes}  댓글: {card.comments.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Board;







// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
// import './Board.css'; // CSSファイルのインポートを確認

// const Board = ({ cards }) => {
//   const navigate = useNavigate();

//   // 카드 클릭 핸들러
//   const handleCardClick = (card) => {
//     navigate('/viewboardcard', { state: { formData: card, textAreas: card.textAreas || [] } });
//   };

//   return (
//     <div className="board_body">
//       <div className="board_title">전체 포트폴리오</div>
//       <div className="card-container">
//         <Grid container spacing={2}>
//           {cards.slice().reverse().map((card, index) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//               <Card className="portfolio-card" onClick={() => handleCardClick(card)}>
//                 {card.image && (
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={card.image}
//                     alt="Cover"
//                     style={{ cursor: 'pointer' }}
//                   />
//                 )}
//                 <CardContent>
//                   <Typography gutterBottom variant="h5" component="div">
//                     {card.title}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {card.savedDate}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     좋아요: {card.likes}  댓글: {card.comments.length}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     style={{
//                       display: '-webkit-box',
//                       WebkitLineClamp: card.image ? 3 : 'none',
//                       WebkitBoxOrient: 'vertical',
//                       overflow: 'hidden',
//                       cursor: 'pointer'
//                     }}
//                   >
//                     {card.description}
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </div>
//     </div>
//   );
// };

// export default Board;





