import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';

const root = ReactDOM.createRoot(document.getElementById('root'));

// AppWithNavigation 
const AppWithNavigation = () => {
  return (
    <BrowserRouter>
      <NavigationWrapper />
    </BrowserRouter>
  );
}

// NavigationWrapper 정의
const NavigationWrapper = () => {
  const location = useLocation();  // 현재 url

  return (
    <>
      {/*login페이지 빼고 Navigation 표시 */}
      {location.pathname !== "/" && location.pathname !== "/signup"&&<Navigation />}
      <App />
    </>
  );
}
// ReactDOM.createRoot 로 AppWithNavigation 렌더링
root.render(
  <React.StrictMode>
    <AppWithNavigation />
  </React.StrictMode>
);