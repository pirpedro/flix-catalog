import { Box, Container } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';
import { NavBar } from './components/NavBar';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <NavBar/>
        <Box paddingTop={'70px'}>
          <Breadcrumbs/>
          <AppRouter/>
        </Box>
      </BrowserRouter>
    </React.Fragment>
    
  );
}

export default App;
