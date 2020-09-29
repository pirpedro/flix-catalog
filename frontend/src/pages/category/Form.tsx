import { Box, Button, ButtonProps, Checkbox, makeStyles, TextField, Theme } from '@material-ui/core';
import { useForm } from "react-hook-form";
import * as React from 'react';
import categoryHttp from '../../util/http/category-http';
type Props = {
  
};

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const Form = (props: Props) => {

  const classes = useStyles();
  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: "contained",
  }

  const {register, handleSubmit, getValues} = useForm({
    defaultValues: {
      is_active: true
    }
  });

  function onSubmit(formData, event){
    categoryHttp
        .create(formData)
        .then(response => console.log(response));
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
      />
      <TextField
        name="description"
        label="Descrição"
        multiline
        rows="4"
        fullWidth
        variant="outlined"
        margin="normal"
        inputRef={register}
      />
      <Checkbox
        name="is_active"
        color="primary"
        defaultChecked
        inputRef={register}
      />
      Ativo?
      <Box dir={"rtl"}>
        <Button
          color="primary" 
          {...buttonProps} 
          onClick={() => onSubmit(getValues(), null)}
        >
          Salvar
        </Button>
        <Button {...buttonProps} type="submit">Salvar e continuar editando</Button>
      </Box>
    </form>
  );
};

export default Form;