import { Box, Button, ButtonProps, Checkbox, FormControlLabel, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { useForm } from "react-hook-form";
import * as React from 'react';
import categoryHttp from '../../util/http/category-http';
import { yupResolver } from '@hookform/resolvers'
import * as yup from '../../util/vendor/yup';
import { useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from './PageForm';
import { useSnackbar } from 'notistack';
import { Category } from '../../util/models';
import SubmitActions from '../../components/SubmitActions';
import { DefaultForm } from '../../components/DefaultForm';

const validationSchema = yup.object().shape({
  name: yup.string()
          .label('Nome')
          .required()
          .max(255)
})

export const Form = () => {

  const {
    register,
    handleSubmit,
    getValues, 
    errors, 
    reset, 
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_active: true
    }
  });

  const snackbar = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [category, setCategory] = React.useState<Category | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    register({name: 'is_active'});
  }, [register]);

  React.useEffect(() => {
    if(!id){ return; }

    async function getCategory(){
      setLoading(true);
      try {
        const {data} = await categoryHttp.get(id);
        setCategory(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações.',
          {variant: 'error'}
        );
      } finally {
        setLoading(false);
      }
    }
    getCategory();
  }, []);

  async function onSubmit(formData, event){
    setLoading(true);
    try {
      const http = !category
      ? categoryHttp.create(formData)
      : categoryHttp.update(category.id, formData);
      const {data} = await http;
      snackbar.enqueueSnackbar(
        'Categoria salva com sucesso.',
        {variant: "success"}
      );
      setTimeout(() => {
        event
            ? (
              id 
                ? history.replace(`/categories/${data.data.id}/edit`)
                : history.push(`/categories/${data.data.id}/edit`)
            )
            : history.push('/categories')
      }); 
    } catch (error) {
      console.log(error);
          snackbar.enqueueSnackbar(
            'Não foi possível salvar a categoria.',
            {variant: "error"}
          );
    }finally {
      setLoading(false);
    }
   
  } 
  
  return (
        <DefaultForm GridItemProps={{xs:12, md:6}} onSubmit={handleSubmit(onSubmit)}>
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
          <SubmitActions 
            disabledButtons={loading}
            handleSave={() => trigger().then( isValid => {
                              isValid && onSubmit(getValues, null)
                            })
                        }
          />
        </DefaultForm>
  );
};

export default Form;