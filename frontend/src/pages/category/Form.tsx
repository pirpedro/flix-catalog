import { Box, Button, ButtonProps, Checkbox, FormControlLabel, makeStyles, TextField, Theme } from '@material-ui/core';
import { useForm } from "react-hook-form";
import * as React from 'react';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers'
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from './PageForm';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1)
    }
  }
});

const validationSchema = yup.object().shape({
  name: yup.string()
          .label('Nome')
          .required()
          .max(255)
})

const Form = () => {

  const classes = useStyles();
  const {
    register,
    handleSubmit,
    getValues, 
    errors, 
    reset, 
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_active: true
    }
  });

  const snackbar = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [category, setCategory] = React.useState<{id: string} | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  
  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: "contained",
    disabled: loading
  }

  React.useEffect(() => {
    register({name: 'is_active'});
  }, [register]);

  React.useEffect(() => {
    if(!id){ return; }
    setLoading(true);
    categoryHttp
      .get(id)
      .then(({data}) => {
        setCategory(data.data);
        reset(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  function onSubmit(formData, event){
    setLoading(true);
    const http = !category
      ? categoryHttp.create(formData)
      : categoryHttp.update(category.id, formData);
    http.then((response: AxiosResponse) => {
      snackbar.enqueueSnackbar(
        'Categoria salva com sucesso.',
        {variant: "success"}
      );
      setTimeout(() => {
        event
            ? (
              id 
                ? history.replace(`/categories/${response.data.data.id}/edit`)
                : history.push(`/categories/${response.data.data.id}/edit`)
            )
            : history.push('/categories')
      })       
    })
        .catch((error) => {
          console.log(error);
          snackbar.enqueueSnackbar(
            'Não foi possível salvar a categoria.',
            {variant: "error"}
          );
        })
        .finally(() => setLoading(false));
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant="outlined"
        inputRef={register}
        disabled={loading}
        error={errors.name !== undefined}
        helperText={errors.name?.message}
        InputLabelProps={{shrink: true}}
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
        disabled={loading}
        InputLabelProps={{shrink: true}}
      />
      <FormControlLabel 
        label="Ativo?"
        labelPlacement="end"
        disabled={loading}
        control={
          <Checkbox
            name="is_active"
            color="primary"
            onChange={
              () => {setValue('is_active', !getValues()['is_active'])}
            }
            checked={watch('is_active')}

          />
        }
      />
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