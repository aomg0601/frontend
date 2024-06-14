import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import MyPort from './routes/MyPort';
import OurForm from "./routes/OurForm";
import Function from "./routes/Function";
import Pfapi  from "./routes/Pfapi";
import Design from "./routes/Design";
import Database from "./routes/Database";
import Code  from "./routes/Code";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import CreateQuestion from "./ai/CreateQuestion";
import CreatePPT from "./ai/CreatePPT";
import ViewCard from './components/ViewCard';
import Board from './routes/Board';
import ViewBoardCard from './components/ViewBoardCard';
import SwaggerComponent from './components/SwaggerUI';

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function App() {
  const [cards, setCards] = useState([]);
  const [publicCards, setPublicCards] = useState([]);

  const addCard = (newCard) => {
    const cardWithDefaults = {
      ...newCard,
      startDate: formatDate(newCard.startDate),
      endDate: formatDate(newCard.endDate),
      likes: newCard.likes || 0,
      comments: newCard.comments || [],
    };
    setCards(prevCards => {
      if (prevCards.some(card => card.id === cardWithDefaults.id)) {
        return prevCards;
      }
      return [...prevCards, cardWithDefaults];
    });
    if (cardWithDefaults.status) {
      setPublicCards(prevCards => {
        if (prevCards.some(card => card.id === cardWithDefaults.id)) {
          return prevCards;
        }
        return [...prevCards, cardWithDefaults];
      });
    }
  };

  const updateCard = (updatedCard) => {
    const cardWithDefaults = {
      ...updatedCard,
      startDate: formatDate(updatedCard.startDate),
      endDate: formatDate(updatedCard.endDate),
      likes: updatedCard.likes || 0,
      comments: updatedCard.comments || [],
    };
    setCards(prevCards => prevCards.map(card => card.id === cardWithDefaults.id ? cardWithDefaults : card));
    if (cardWithDefaults.status) {
      setPublicCards(prevCards => {
        const existingCardIndex = prevCards.findIndex(card => card.id === cardWithDefaults.id);
        if (existingCardIndex !== -1) {
          const updatedPublicCards = [...prevCards];
          updatedPublicCards[existingCardIndex] = cardWithDefaults;
          return updatedPublicCards;
        } else {
          return [...prevCards, cardWithDefaults];
        }
      });
    } else {
      setPublicCards(prevCards => prevCards.filter(card => card.id !== cardWithDefaults.id));
    }
  };

  const addSHAREDCard = (newCard) => {
    const cardWithDefaults = {
      ...newCard,
      startDate: formatDate(newCard.startDate),
      endDate: formatDate(newCard.endDate),
      likes: newCard.likes || 0,
      comments: newCard.comments || [],
    };
    setPublicCards(prevCards => {
      if (prevCards.some(card => card.id === cardWithDefaults.id)) {
        return prevCards;
      }
      return [...prevCards, cardWithDefaults];
    });
  };

  const updateSHAREDCard = (updatedCard) => {
    const cardWithDefaults = {
      ...updatedCard,
      startDate: formatDate(updatedCard.startDate),
      endDate: formatDate(updatedCard.endDate),
      likes: updatedCard.likes || 0,
      comments: updatedCard.comments || [],
    };
    setPublicCards(prevCards => prevCards.map(card => card.id === cardWithDefaults.id ? cardWithDefaults : card));
  };

  const removeSHAREDCard = (id) => {
    setPublicCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const deleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    setPublicCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const addComment = (cardId, newComment) => {
    setPublicCards(prevCards =>
      prevCards.map(card => 
        card.id === cardId ? { ...card, comments: [newComment, ...card.comments] } : card
      )
    );
    setCards(prevCards =>
      prevCards.map(card => 
        card.id === cardId ? { ...card, comments: [newComment, ...card.comments] } : card
      )
    );
  };

  const toggleLike = (cardId, commentId, liked) => {
    setPublicCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          if (commentId === null) {
            return { ...card, likes: card.likes + (liked ? 1 : -1) };
          } else {
            const updatedComments = card.comments.map(comment => 
              comment.id === commentId ? { ...comment, likes: comment.likes + (liked ? 1 : -1) } : comment
            );
            return { ...card, comments: updatedComments };
          }
        }
        return card;
      })
    );
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === cardId) {
          if (commentId === null) {
            return { ...card, likes: card.likes + (liked ? 1 : -1) };
          } else {
            const updatedComments = card.comments.map(comment => 
              comment.id === commentId ? { ...comment, likes: comment.likes + (liked ? 1 : -1) } : comment
            );
            return { ...card, comments: updatedComments };
          }
        }
        return card;
      })
    );
  };

  const deleteComment = (cardId, commentId) => {
    setPublicCards(prevCards =>
      prevCards.map(card => 
        card.id === cardId ? { ...card, comments: card.comments.filter(comment => comment.id !== commentId) } : card
      )
    );
    setCards(prevCards =>
      prevCards.map(card => 
        card.id === cardId ? { ...card, comments: card.comments.filter(comment => comment.id !== commentId) } : card
      )
    );
  };

  return (
    
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/myport" element={<MyPort cards={cards} />} />
        <Route path="/ourform" element={<OurForm addCard={addCard} updateCard={updateCard} addSHAREDCard={addSHAREDCard} updateSHAREDCard={updateSHAREDCard} removeSHAREDCard={removeSHAREDCard} />} />
        <Route path="/function" element={<Function />} />
        <Route path="/pfapi" element={<Pfapi />} />
        <Route path="/design" element={<Design />} />
        <Route path="/database" element={<Database />} />
        <Route path="/code" element={<Code />} />
        <Route path="/createquestion" element={<CreateQuestion />} />
        <Route path="/createppt" element={<CreatePPT />} />
        <Route path="/viewcard" element={<ViewCard updateCard={updateCard} deleteCard={deleteCard} />} />
        <Route path="/api-docs" element={<SwaggerComponent />} />
        <Route path="/board" element={<Board cards={publicCards} />} />
        <Route path="/viewboardcard" element={<ViewBoardCard addComment={addComment} toggleLike={toggleLike} formatDate={formatDate} deleteComment={deleteComment} />} />
      </Routes>
    
  );
}

export default App;







// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import React, { useState } from 'react';
// import './App.css';
// import MyPort from './routes/MyPort';
// import OurForm from "./routes/OurForm";
// import Login from "./routes/Login";
// import SignUp from "./routes/SignUp";
// import CreateQuestion from "./ai/CreateQuestion";
// import CreatePPT from "./ai/CreatePPT";
// import ViewCard from './components/ViewCard';
// import Board from './routes/Board';
// import ViewBoardCard from './components/ViewBoardCard';
// import SwaggerComponent from './components/SwaggerUI';

// const formatDate = (date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
// };

// function App() {
//   const [cards, setCards] = useState([]);
//   const [publicCards, setPublicCards] = useState([]);

//   const addCard = (newCard) => {
//     const cardWithDefaults = {
//       ...newCard,
//       startDate: formatDate(newCard.startDate),
//       endDate: formatDate(newCard.endDate),
//       likes: newCard.likes || 0,
//       comments: newCard.comments || [],
//     };
//     setCards(prevCards => {
//       if (prevCards.some(card => card.id === cardWithDefaults.id)) {
//         return prevCards;
//       }
//       return [...prevCards, cardWithDefaults];
//     });
//     if (cardWithDefaults.status) {
//       setPublicCards(prevCards => {
//         if (prevCards.some(card => card.id === cardWithDefaults.id)) {
//           return prevCards;
//         }
//         return [...prevCards, cardWithDefaults];
//       });
//     }
//   };

//   const updateCard = (updatedCard) => {
//     const cardWithDefaults = {
//       ...updatedCard,
//       startDate: formatDate(updatedCard.startDate),
//       endDate: formatDate(updatedCard.endDate),
//       likes: updatedCard.likes || 0,
//       comments: updatedCard.comments || [],
//     };
//     setCards(prevCards => prevCards.map(card => card.id === cardWithDefaults.id ? cardWithDefaults : card));
//     if (cardWithDefaults.status) {
//       setPublicCards(prevCards => {
//         const existingCardIndex = prevCards.findIndex(card => card.id === cardWithDefaults.id);
//         if (existingCardIndex !== -1) {
//           const updatedPublicCards = [...prevCards];
//           updatedPublicCards[existingCardIndex] = cardWithDefaults;
//           return updatedPublicCards;
//         } else {
//           return [...prevCards, cardWithDefaults];
//         }
//       });
//     } else {
//       setPublicCards(prevCards => prevCards.filter(card => card.id !== cardWithDefaults.id));
//     }
//   };

//   const addSHAREDCard = (newCard) => {
//     const cardWithDefaults = {
//       ...newCard,
//       startDate: formatDate(newCard.startDate),
//       endDate: formatDate(newCard.endDate),
//       likes: newCard.likes || 0,
//       comments: newCard.comments || [],
//     };
//     setPublicCards(prevCards => {
//       if (prevCards.some(card => card.id === cardWithDefaults.id)) {
//         return prevCards;
//       }
//       return [...prevCards, cardWithDefaults];
//     });
//   };

//   const updateSHAREDCard = (updatedCard) => {
//     const cardWithDefaults = {
//       ...updatedCard,
//       startDate: formatDate(updatedCard.startDate),
//       endDate: formatDate(updatedCard.endDate),
//       likes: updatedCard.likes || 0,
//       comments: updatedCard.comments || [],
//     };
//     setPublicCards(prevCards => prevCards.map(card => card.id === cardWithDefaults.id ? cardWithDefaults : card));
//   };

//   const removeSHAREDCard = (id) => {
//     setPublicCards(prevCards => prevCards.filter(card => card.id !== id));
//   };

//   const deleteCard = (id) => {
//     setCards((prevCards) => prevCards.filter((card) => card.id !== id));
//     setPublicCards((prevCards) => prevCards.filter((card) => card.id !== id));
//   };

//   const addComment = (cardId, newComment) => {
//     setPublicCards(prevCards =>
//       prevCards.map(card => 
//         card.id === cardId ? { ...card, comments: [newComment, ...card.comments] } : card
//       )
//     );
//   };

//   const toggleLike = (cardId, commentId, liked) => {
//     setPublicCards(prevCards =>
//       prevCards.map(card => {
//         if (card.id === cardId) {
//           if (commentId === null) {
//             return { ...card, likes: card.likes + (liked ? 1 : -1) };
//           } else {
//             const updatedComments = card.comments.map(comment => 
//               comment.id === commentId ? { ...comment, likes: comment.likes + (liked ? 1 : -1) } : comment
//             );
//             return { ...card, comments: updatedComments };
//           }
//         }
//         return card;
//       })
//     );
//   };

//   const deleteComment = (cardId, commentId) => {
//     setPublicCards(prevCards =>
//       prevCards.map(card => 
//         card.id === cardId ? { ...card, comments: card.comments.filter(comment => comment.id !== commentId) } : card
//       )
//     );
//   };

//   return (
    
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/myport" element={<MyPort cards={cards} />} />
//         <Route path="/ourform" element={<OurForm addCard={addCard} updateCard={updateCard} addSHAREDCard={addSHAREDCard} updateSHAREDCard={updateSHAREDCard} removeSHAREDCard={removeSHAREDCard} />} />
//         <Route path="/createquestion" element={<CreateQuestion />} />
//         <Route path="/createppt" element={<CreatePPT />} />
//         <Route path="/viewcard" element={<ViewCard updateCard={updateCard} deleteCard={deleteCard} />} />
//         <Route path="/api-docs" element={<SwaggerComponent />} />
//         <Route path="/board" element={<Board cards={publicCards} />} />
//         <Route path="/viewboardcard" element={<ViewBoardCard addComment={addComment} toggleLike={toggleLike} formatDate={formatDate} deleteComment={deleteComment} />} />
//       </Routes>
   
//   );
// }

// export default App;





