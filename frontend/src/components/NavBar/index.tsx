import { AppBar, Button, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core';
import * as React from 'react';
import logo from "../../static/img/logo.png";
import LoginButton from './LoginButton';
import {Menu} from './Menu'
import UserAccountMenu from './UserAccountMenu';

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    backgroundColor: '#000'
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  }, 
  logo: {
    width: 100,
    [theme.breakpoints.up('sm')]: {
      width: 170
    }
  }
}));

export const NavBar: React.FC = () => {
  const classes = useStyles();  
  return (
    <AppBar>
      <Toolbar className={classes.toolbar}>
        <Menu/>
        <Typography className={classes.title}>
          <img src={logo} alt="CodeFlix" className={classes.logo}/>
        </Typography>
        <LoginButton/>
        <UserAccountMenu/>
      </Toolbar>
    </AppBar>
  );
};