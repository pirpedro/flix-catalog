import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import Form from './Form';

export interface ParamTypes{
  id: string;
}

const PageForm = () => {
  const {id} = useParams<ParamTypes>();
  return (
    <Page title={!id ? 'Criar categoria': 'Editar Categoria'}>
      <Form/>
    </Page>
  );
};

export default PageForm;