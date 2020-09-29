import { Box, Fab } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Add as AddIcon } from "@material-ui/icons";
import Table from './Table';

const PageList = () => {
  return (
    <Page title='Listar membros de elenco'>
      <Box dir='rtl' paddingBottom={2}>
        <Fab
          title="Adicionar membro de elenco"
          color='secondary'
          size="small"
          component={Link}
          to="/cast-members/create"
        >
          <AddIcon/>
        </Fab>
      </Box>
      <Box>
        <Table/>
      </Box>
    </Page>
  );
};

export default PageList;