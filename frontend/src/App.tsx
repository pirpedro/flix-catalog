import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingProvider from './components/Loading/LoadingProvider';
import { NavBar } from './components/NavBar';
import { SnackBarProvider } from './components/SnackBarProvider';
import Spinner from './components/Spinner';
import AppRouter from './routes/AppRouter';
import theme from './theme';

function App() {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackBarProvider>
            <CssBaseline/>
            <BrowserRouter basename="/admin">
              <Spinner/>
              <NavBar/>
              <Box paddingTop={'70px'}>
                <Breadcrumbs/>
                <AppRouter/>
              </Box>
            </BrowserRouter>
          </SnackBarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
    
  );
}

export default App;
