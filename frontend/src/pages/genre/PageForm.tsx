import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import Form from './Form';

interface ParamTypes{
  id: string;
}

const PageForm = () => {
  const {id} = useParams<ParamTypes>();
  return (
    <Page title={!id ? 'Criar Gênero': 'Editar Gênero'}>
      <Form/>
    </Page>
  );
};

export default PageForm;