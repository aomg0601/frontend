import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPort.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

const MyPort = ({ cards, updateCard, deleteCard }) => {
  const navigate = useNavigate();

  const handleInviteUser = () => {
    navigate('/ourform');
  };

  const handleCardClick = (card) => {
    navigate('/viewcard', { state: { formData: card, textAreas: card.textAreas || [] } });
  };

  return (
    <div className="myport_body">
      <div className="myport_title">나의 포트폴리오</div>
      <div className="card-container">
        <button className="add_button" onClick={handleInviteUser}>+</button>
        {/* 카드 표시 */}
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
                    }}
                  >
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.savedDate}
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

export default MyPort;






