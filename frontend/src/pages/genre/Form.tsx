import { Box, Button, ButtonProps, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import genreHttp from '../../util/http/genre-http';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    }
  }
})
const Form = () => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: "contained"
  }

  const [categories, setCategories] = React.useState<any[]>([])
  const {register, handleSubmit, getValues, setValue, watch} = useForm({
    defaultValues: {categories_id: []}
  });

  const category = getValues()['categories_id'];

  React.useEffect(() => {
    register({name: "categories_id"});
  }, [register]);

  React.useEffect(() => {
    categoryHttp
      .list()
      .then(({data}) => setCategories(data.data))
  }, [register]);

  function onSubmit(formData, event){
    genreHttp
      .create(formData)
      .then((response) => console.log(response));
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
        select
        name="categories_id"
        value={watch('categories_id')}
        label="Categorias"
        margin="normal"
        variant="outlined"
        fullWidth
        onChange={(e) => {
          setValue('categories_id', e.target.value, {shouldValidate: true})
        }}
        SelectProps={{
          multiple: true
        }}
      >
        <MenuItem value="" disabled>
          <em>Selecione categorias</em>
        </MenuItem>
        {
          categories.map(
            (category, key) =>{
              return <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
            }
          )
        }
      </TextField>

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
  )
}

export default Form;