import { Box, Fab } from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Add as AddIcon } from "@material-ui/icons";
import Table from './Table';

const PageList = () => {
  return (
    <Page title='Listagem de gêneros'>
      <Box dir='rtl'>
        <Fab
          title="Adicionar Gênero"
          size="small"
          component={Link}
          to="/genres/create"
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