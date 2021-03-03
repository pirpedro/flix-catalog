import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { ReactKeycloakProvider } from '@react-keycloak/web';
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
import { keycloak, keycloakConfig } from './util/auth';

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakConfig}>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackBarProvider>
            <CssBaseline/>
            <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
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
    </ReactKeycloakProvider>
    
  );
}

export default App;
