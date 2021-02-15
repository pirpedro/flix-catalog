import { Box, Button, ButtonProps, makeStyles, MenuItem, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import categoryHttp from '../../util/http/category-http';
import genreHttp from '../../util/http/genre-http';
import { yupResolver } from '@hookform/resolvers'
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from './PageForm';
import { useSnackbar } from 'notistack';
import { DefaultForm } from '../../components/DefaultForm';
import SubmitActions from '../../components/SubmitActions';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    }
  }
});

const validationSchema = yup.object().shape({
  name: yup.string()
          .label('Nome')
          .required()
          .max(255),
  categories_id: yup.array()
          .label('Categorias')
          .required(),
});

export const Form = () => {
  const {
    register,
    handleSubmit,
    getValues,
    errors,
    setValue,
    reset,
    watch,
    trigger
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {categories_id: []}
  });
  
  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [categories, setCategories] = React.useState<any[]>([])
  const [genre, setGenre] = React.useState<{id:string} | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const category = getValues()['categories_id'];

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: "contained",
    disabled: loading
  }

  React.useEffect(() => {
    let isSubscribed = true;
    ( async () => {
      setLoading(true);
      const promises = [categoryHttp.list({queryParams:{all: ''}})];
      if (id) {
        promises.push(genreHttp.get(id));
      }
      try {
        const [categoriesResponse, genreResponse] = await Promise.all(promises);
        if(isSubscribed){
          setCategories(categoriesResponse.data.data);
          if(id){
            setGenre(genreResponse.data.data);
            reset({
              ...genreResponse.data.data,
              categories_id: genreResponse.data.data.categories.map(category => category.id) 
            });
          }
        }
        
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações',
          {variant: "error"}
        );
      } finally {
        setLoading(false);
      }

    })();
    return () => {
      isSubscribed = false;
    }
  
  }, []);
  
  React.useEffect(() => {
    register({name: "categories_id"});
  }, [register]);

  // React.useEffect(() => {
  //   categoryHttp
  //     .list()
  //     .then(({data}) => setCategories(data.data))
  // }, [register]);

  async function onSubmit(formData, event){
    setLoading(true);
    try {
      const http = !genre
      ? genreHttp.create(formData)
      : genreHttp.update(genre.id, formData);
      const {data} = await http;
      snackbar.enqueueSnackbar(
        'Gênero salvo com sucesso.',
        {variant: "success"}
      );
      setTimeout(() => {
        event
            ? (
              id 
                ? history.replace(`/genres/${data.data.id}/edit`)
                : history.push(`/genres/${data.data.id}/edit`)
            )
            : history.push('/genres')
      }); 
    } catch (error) {
      console.log(error);
          snackbar.enqueueSnackbar(
            'Não foi possível salvar o gênero.',
            {variant: "error"}
          );
    }finally {
      setLoading(false);
    }
   
  } 

  return (
    <DefaultForm GridItemProps={{xs: 12, md:6 }} onSubmit={handleSubmit(onSubmit)}>
      <TextField
        name="name"
        label="Nome"
        fullWidth
        variant={"outlined"}
        inputRef={register}
        disabled={loading}
        error={errors.name !== undefined}
        helperText={errors.name?.message}
        InputLabelProps={{shrink: true}}
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
        disabled={loading}
        error={errors.categories_id !== undefined}
        helperText={errors.categories_id?.message}
        InputLabelProps={{shrink: true}}

      >
        <MenuItem value="" disabled>
          <em>Selecione categorias</em>
        </MenuItem>
        {
          categories.map(
            (category, key) =>(
              <MenuItem key={key} value={category.id}>{category.name}</MenuItem>
            )
          )
        }
      </TextField>

      <SubmitActions 
            disabledButtons={loading}
            handleSave={() => trigger().then( isValid => {
                              isValid && onSubmit(getValues(), null)
                            })
                        }
          />
    </DefaultForm>
  )
}

export default Form;