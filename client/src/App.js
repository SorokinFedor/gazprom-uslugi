import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from '../src/components/AppRouter';
import NavBar from '../src/components/NavBar';
const App = () => {
  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;