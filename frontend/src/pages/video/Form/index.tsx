import {  Card, CardContent, Checkbox, FormControlLabel, Grid, makeStyles, TextField, Theme, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers'
import * as yup from '../../../util/vendor/yup';
import { useHistory, useParams } from 'react-router-dom';
import { ParamTypes } from '../PageForm';
import { useSnackbar } from 'notistack';
import { DefaultForm } from '../../../components/DefaultForm';
import { Video, VideoFileFieldsMap } from '../../../util/models';
import videoHttp from '../../../util/http/video-http';
import SubmitActions from '../../../components/SubmitActions';
import { RatingField } from './RatingField';
import UploadField from './UploadField';
import AsyncAutocomplete from '../../../components/AsyncAutocomplete';
import genreHttp from '../../../util/http/genre-http';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';


const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: theme.spacing(2,0)
  }
}));

const validationSchema = yup.object().shape({
  title: yup.string()
          .label('Título')
          .required()
          .max(255),
  description: yup.string()
          .label('Sinopse')
          .required(),
  year_launched: yup.number()
          .label('Ano de Lançamento')
          .required()
          .min(1),
  duration: yup.number()
          .label('Duração')
          .required().min(1),
  rating: yup.string()
          .label('Classificação')
          .required(),
});

const fileFields = Object.keys(VideoFileFieldsMap);

export const Form = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    errors,
    reset,
    watch,
    trigger
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {

    }
  });
  
  const classes = useStyles();
  const snackbar = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [video, setVideo] = React.useState<Video | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false);
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
 
  React.useEffect(() => {
    ['rating', 'opened',...fileFields].forEach(name => register({name}));
   }, [register])

  React.useEffect(() => {
    if (!id){
      return;
    }
    let isSubscribed = true;
    ( async () => {
      setLoading(true);
      try {
        const {data} = await videoHttp.get(id);
        if(isSubscribed){
          setVideo(data.data);
          reset(data.data);
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

  async function onSubmit(formData, event){
    setLoading(true);
    try {
      const http = !video
      ? videoHttp.create(formData)
      : videoHttp.update(video.id, formData);
      const {data} = await http;
      snackbar.enqueueSnackbar(
        'Vídeo salvo com sucesso.',
        {variant: "success"}
      );
      setTimeout(() => {
        event
            ? (
              id 
                ? history.replace(`/videos/${data.data.id}/edit`)
                : history.push(`/videos/${data.data.id}/edit`)
            )
            : history.push('/videos')
      }); 
    } catch (error) {
      console.log(error);
          snackbar.enqueueSnackbar(
            'Não foi possível salvar o vídeo.',
            {variant: "error"}
          );
    }finally {
      setLoading(false);
    }
   
  } 

  const fetchOptions = (searchText) => genreHttp.list({
    queryParams: {
      search: searchText, all: ""
    }
  }).then(({data}) => data.data)
  return (
    <DefaultForm GridItemProps={{xs: 12}} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <TextField
          name="title"
          label="Título"
          variant={"outlined"}
          fullWidth
          inputRef={register}
          disabled={loading}
          InputLabelProps={{shrink: true}}
          error={errors.title !== undefined}
          helperText={errors.title?.message} 
          />

          <TextField
          name="description"
          label="Sinopse"
          multiline
          rows="4"
          margin='normal'
          variant={"outlined"}
          fullWidth
          inputRef={register}
          disabled={loading}
          InputLabelProps={{shrink: true}}
          error={errors.description !== undefined}
          helperText={errors.description?.message} 
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                name="year_launched"
                label="Ano de lançamento"
                type="number"
                margin='normal'
                variant={"outlined"}
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{shrink: true}}
                error={errors.year_launched !== undefined}
                helperText={errors.year_launched?.message} 
              />  
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="duration"
                label="Duração"
                type="number"
                margin='normal'
                variant={"outlined"}
                fullWidth
                inputRef={register}
                disabled={loading}
                InputLabelProps={{shrink: true}}
                error={errors.duration !== undefined}
                helperText={errors.duration?.message} 
              />  
            </Grid>
          </Grid>
          Elenco
          <br/>
          <AsyncAutocomplete
            fetchOptions={fetchOptions}
            TextFieldProps={{
              label: "Gêneros"
            }}
            AutoCompleteProps={{
              freeSolo: true,
              getOptionLabel: option => option.name,
              options: []
            }}
          />
          <GridSelected>
            <GridSelectedItem onClick={() => console.log('foca')}>
              Gênero 1
            </GridSelectedItem>
          </GridSelected>
        </Grid>
        <Grid item xs={12} md={6}>
          <RatingField
            value={watch('rating')}
            setValue={(value) => setValue('rating', value)}
            error={errors.rating}
            disabled={loading}
            formControlProps= {{
              margin: isGreaterMd ? 'none' : 'normal'
            }}
          />
          <br/>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Imagens
              </Typography>
              <UploadField
                accept={'image/*'}
                label={'Thumb'}
                setValue={(value) => setValue('thumb_file', value)}
              />
              <UploadField
                accept={'image/*'}
                label={'Banner'}
                setValue={(value) => setValue('banner_file', value)}
              />
            </CardContent>
          </Card>
          <Card className={classes.cardUpload}>
            <CardContent>
              <Typography color="primary" variant="h6">
                Videos
              </Typography>
              <UploadField
                accept={'video/mp4'}
                label={'Trailer'}
                setValue={(value) => setValue('trailer_file', value)}
              />
              <UploadField
                accept={'video/mp4'}
                label={'Principal'}
                setValue={(value) => setValue('video_file', value)}
              />
            </CardContent>
          </Card>
         
          <br/>
          <FormControlLabel
            control={
              <Checkbox
                name="opened"
                color={'primary'}
                onChange={
                  () => setValue('opened', !getValues()['opened'])
                }
                checked={watch('opened')}
                disabled={loading}
              />
            }
            label={
              <Typography color="primary" variant={"subtitle2"}>
                Quero que este conteúdo apareça na sessão de lançamentos
              </Typography>
            }
            labelPlacement="end"
          />
        </Grid>
      </Grid>
      <SubmitActions 
            disabledButtons={loading}
            handleSave={() => trigger().then( isValid => {
                              isValid && onSubmit(getValues, null)
                            })
                        }
          />
    </DefaultForm>
  )
}

export default Form;