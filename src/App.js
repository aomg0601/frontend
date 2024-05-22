// import {Route, Routes, BrowserRouter, useNavigate} from "react-router-dom";
// import React, { useState, Component} from 'react';
// import './App.css';
// import PortBoard from './routes/PortBoard';
// import MyPort from './routes/MyPort';
// import BoardPage from "./routes/BoardPage";
// import Mentoring from "./routes/Mentoring";
// import OurForm from "./portfolio/OurForm";
// import FreeForm from "./portfolio/FreeForm";
// import Login from "./routes/Login";

// // import { PostButton } from "./portfolio/button/Post";

// function App() {
//   const navigate = useNavigate(); 
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Login navigate = { navigate }/>} />
//       {/* <Route path="/" element={<PortBoard/>}/> */}
//       <Route path="/portboard" element={<PortBoard/>}/>
//       <Route path="/myport" element={<MyPort/>}/>
//       <Route path="/boardpage" element={<BoardPage/>}/>
//       <Route path="/mentoring" element={<Mentoring/>}/>
//       <Route path="/ourform" element={<OurForm/>}/>
//       <Route path="/freeform" element={<FreeForm/>}/>
//       {/* <Route path="/post" element={<Post/>}/> */}
//   </Routes>
//   </BrowserRouter>
    
  
//   );
// }

// export default App;









import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import MyPort from './routes/MyPort';
import OurForm from "./routes/OurForm";
import Login from "./routes/Login";
import CreateQuestion from "./ai/CreateQuestion";
import CreatePPT from "./ai/CreatePPT";
import ViewCard from './components/ViewCard';

function App() {
  const [cards, setCards] = useState([]);

  const addCard = (newCard) => {
    setCards(prevCards => [...prevCards, newCard]);
  };

  const updateCard = (updatedCard) => {
    setCards(prevCards => prevCards.map(card => card.id === updatedCard.id ? updatedCard : card));
  };

  const deleteCard = (id) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/myport" element={<MyPort cards={cards} />} />
      <Route path="/ourform" element={<OurForm addCard={addCard} updateCard={updateCard} />} />
      <Route path="/createquestion" element={<CreateQuestion />} />
      <Route path="/createppt" element={<CreatePPT />} />
      <Route path="/viewcard" element={<ViewCard updateCard={updateCard} deleteCard={deleteCard} />} />
    </Routes>

  );
}

export default App;