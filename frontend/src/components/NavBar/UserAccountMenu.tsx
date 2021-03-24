import { Divider, IconButton, Link, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import * as React from 'react';
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { useKeycloak } from '@react-keycloak/web';
import { useHasClient, useHasRealmRole } from '../../hooks/useHasRole';
import { keycloakLinks } from '../../util/auth';

const UserAccountMenu = () => {
  const hasCatalogAdmin = useHasRealmRole('catalog-admin');
  const hasAdminRealm = useHasClient('realm-management');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  if(!hasCatalogAdmin){
    return null;
  }

  return (
    <React.Fragment>
      <IconButton
        edge='end'
        color='inherit'
        aria-label='open drawer'
        aria-controls='menu-user-account'
        aria-haspopup="true"
        onClick={handleOpen}   
      >
        <AccountBoxIcon/>
      </IconButton>
      <MuiMenu
        id="menu-user-account"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        getContentAnchorEl={null}
      >
       <MenuItem disabled={true}>
        Meu ovo esquerdo
       </MenuItem>
       <Divider/>
       {
          hasAdminRealm && (
          <MenuItem 
              component={Link}
              href={keycloakLinks.adminConsole} 
              target="_blank"
              rel="noopener"
              onClick={handleClose}
              color="textPrimary">
          Auth. Admin
          </MenuItem>
        )}
       <MenuItem 
          component={Link}
          href={keycloakLinks.accountConsole} 
          target="_blank"
          rel="noopener"
          onClick={handleClose}
          color="textPrimary">
        Minha conta
       </MenuItem>
       <MenuItem>
        Logout
       </MenuItem>
      </MuiMenu>
    </React.Fragment>
  );
};

export default UserAccountMenu;