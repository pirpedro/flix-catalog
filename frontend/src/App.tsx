import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';
import { NavBar } from './components/NavBar';
import { SnackBarProvider } from './components/SnackBarProvider';
import AppRouter from './routes/AppRouter';
import theme from './theme';

function App() {
  return (
    <React.Fragment>
      <MuiThemeProvider theme={theme}>
        <SnackBarProvider>
          <CssBaseline/>
          <BrowserRouter>
            <NavBar/>
            <Box paddingTop={'70px'}>
              <Breadcrumbs/>
              <AppRouter/>
            </Box>
          </BrowserRouter>
        </SnackBarProvider>
      </MuiThemeProvider>
    </React.Fragment>
    
  );
}

export default App;
