import { yupResolver } from '@hookform/resolvers';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import LoadingContext from '../../components/Loading/LoadingContext';
import SubmitActions from '../../components/SubmitActions';
import useSnackbarFormError from '../../hooks/useSnackbarFormError';
import castMemberHttp from '../../util/http/cast-member-http';
import * as yup from "../../util/vendor/yup";
import { ParamTypes } from './PageForm';

const validationSchema = yup.object().shape({
  name: yup.string()
          .label('Nome')
          .required()
          .max(255),
  type: yup.number()
          .label('Tipo')
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
    trigger,
    formState
  } = useForm({
    resolver: yupResolver(validationSchema)
  });
  
  useSnackbarFormError(formState.submitCount, errors);
  
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [castMember, setCastMember] = React.useState<{id:string} | null>(null);
  const loading = React.useContext(LoadingContext);

  React.useEffect(() => {
    if(!id){ return; }

    async function getCastMember(){
      try {
        const {data} = await castMemberHttp.get(id);
        setCastMember(data.data);
        reset(data.data);
      } catch (error) {
        console.log(error);
        enqueueSnackbar(
          'Não foi possível carregar as informações.',
          {variant: 'error'}
        );
      }
    }
    getCastMember();
  }, [id, reset, enqueueSnackbar]);

  async function onSubmit(formData, event){
    try {
      const http = !castMember
      ? castMemberHttp.create(formData)
      : castMemberHttp.update(castMember.id, formData);
      const {data} = await http;
      enqueueSnackbar(
        'Membro salvo com sucesso.',
        {variant: "success"}
      );
      setTimeout(() => {
        event
            ? (
              id 
                ? history.replace(`/cast-members/${data.data.id}/edit`)
                : history.push(`/cast-members/${data.data.id}/edit`)
            )
            : history.push('/cast-members')
      }); 
    } catch (error) {
      console.log(error);
          enqueueSnackbar(
            'Não foi possível salvar o membro.',
            {variant: "error"}
          );
    }
  } 



React.useEffect(() => {
  register({name: "type"})
}, [register]);


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
    <FormControl 
      margin="normal"
      error={errors.name !== undefined}
      disabled={loading}
    >
      <FormLabel component="legend">Tipo</FormLabel>
      <RadioGroup
        name="type"
        onChange={(e) => {
          setValue('type', parseInt(e.target.value));
        }}
        value={watch('type')+ ""}
      >
        <FormControlLabel value="1" control={<Radio color="primary"/>} label="Diretor"/>
        <FormControlLabel value="2" control={<Radio color="primary"/>} label="Ator"/>
      </RadioGroup>
      {
        errors.type && <FormHelperText id="type-helper-text">{errors.type.message}</FormHelperText>
      }
    </FormControl>
    <SubmitActions 
            disabledButtons={loading}
            handleSave={() => trigger().then( isValid => {
                              isValid && onSubmit(getValues(), null)
                            })
                        }
          />
  </form>
)
}

export default Form;