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
import GenreField, {GenreFieldComponent} from './GenreField';
import CategoryField, {CategoryFieldComponent} from './CategoryField';
import CastMemberField, { CastMemberFieldComponent } from './CastMemberField';
import { omit, zipObject } from 'lodash';
import { InputFileComponent } from '../../../components/InputFile';
import useSnackbarFormError from '../../../hooks/useSnackbarFormError';
import { useDispatch } from "react-redux";
import { FileInfo } from '../../../store/upload/types';
import { Creators } from '../../../store/upload';
import SnackbarUpload from '../../../components/SnackbarUpload';
import LoadingContext from '../../../components/Loading/LoadingContext';


const useStyles = makeStyles((theme: Theme) => ({
  cardUpload: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: theme.spacing(2,0)
  },
  cardOpened: {
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
  },
  cardContentOpened: {
   paddingBottom: theme.spacing(2) + 'px !important'
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
  cast_members: yup.array()
          .label("Elenco")
          .required(),
  genres: yup.array()
          .label("Gêneros")
          .required()
          .test({
            message: 'Cada gênero escolhido precisa ter pelo menos uma categoria selecionada',
            test(value) {
              return (value as any[]).every(
                v => v.categories.filter(
                  cat => this.parent.categories.map(c => c.id).includes(cat.id)
                ).length !==0
              );
            }  
            
          }),
  categories: yup.array()
          .label("Categorias")
          .required(),
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
    trigger,
    formState
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      rating: null,
      genres: [],
      categories: [],
      cast_members: [],
      opened: false,
    }
  });

  useSnackbarFormError(formState.submitCount, errors);
  
  const classes = useStyles();
  const {enqueueSnackbar} = useSnackbar();
  const history = useHistory();
  const {id} = useParams<ParamTypes>();
  const [video, setVideo] = React.useState<Video | null>(null)
  const loading = React.useContext(LoadingContext);
  const theme = useTheme();
  const isGreaterMd = useMediaQuery(theme.breakpoints.up('md'));
  const castMemberRef = React.useRef() as React.MutableRefObject<CastMemberFieldComponent>;
  const genreRef = React.useRef() as React.MutableRefObject<GenreFieldComponent>;
  const categoryRef = React.useRef() as React.MutableRefObject<CategoryFieldComponent>;
  const uploadsRef = React.useRef(
    zipObject(fileFields, fileFields.map(()=> React.createRef()))
  ) as React.MutableRefObject<{ [key: string]: React.MutableRefObject<InputFileComponent>}>;

 const dispatch = useDispatch();

 const resetForm = React.useCallback((data) => {
    Object.keys(uploadsRef.current).forEach(
      field => uploadsRef.current[field].current.clear()
    );
    castMemberRef.current.clear();
    genreRef.current.clear();
    categoryRef.current.clear();
    reset(data);
}, [castMemberRef,categoryRef,genreRef, reset, uploadsRef  ]);

 React.useEffect(() => {
    [
      'rating',
      'opened',
      'genres',
      'categories',
      'cast_members',
      ...fileFields
    ].forEach(name => register({name}));
   }, [register])

  React.useEffect(() => {
    if (!id){
      return;
    }
    let isSubscribed = true;
    ( async () => {
      try {
        const {data} = await videoHttp.get(id);
        if(isSubscribed){
          setVideo(data.data);
          resetForm(data.data);
        }
        
      } catch (error) {
        console.log(error);
        enqueueSnackbar(
          'Não foi possível carregar as informações',
          {variant: "error"}
        );
      }

    })();
    return () => {
      isSubscribed = false;
    }
  
  }, [id, resetForm, enqueueSnackbar]);

  async function onSubmit(formData, event){
    const sendData = omit(
      formData, [...fileFields, 'cast_members', 'genres', 'categories']
      );
    sendData['cast_members_id'] = formData['cast_members'].map(cast_member => cast_member.id);
    sendData['categories_id'] = formData['categories'].map(category => category.id);
    sendData['genres_id'] = formData['genres'].map(genre => genre.id);
    try {
      const http = !video
      ? videoHttp.create(sendData)
      : videoHttp.update(video.id, sendData);
      const {data} = await http;
      enqueueSnackbar(
        'Vídeo salvo com sucesso.',
        {variant: "success"}
      );
      uploadFiles(data.data);
      id && resetForm(data.data);
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
      console.error(error);
          enqueueSnackbar(
            'Não foi possível salvar o vídeo.',
            {variant: "error"}
          );
    }
   
  } 

  function uploadFiles(video){
    const files: FileInfo[] = fileFields
          .filter(fileField => getValues()[fileField])
          .map(fileField => ({fileField, file: getValues()[fileField] as File}))

    if(!files.length){
      return;
    }
    dispatch(Creators.addUpload({video, files}));
    enqueueSnackbar('', {
      key: 'snackbar-upload',
      persist: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      content: (key) => {
        const id = key as any;
        return <SnackbarUpload id={id}/>
      }
    });
  }

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
          <CastMemberField
            ref={castMemberRef}
            castMembers={watch('cast_members')}
            setCastMembers={(value) => setValue('cast_members', value, {shouldValidate: true})}
            error={errors.cast_members}
            disabled={loading}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <GenreField
                ref={genreRef}
                genres={watch('genres')}
                setGenres={(value) => setValue('genres', value, {shouldValidate: true } )}
                categories={watch('categories')}
                setCategories={(value) => setValue('categories', value, {shouldValidate: true } )}
                error={errors.genres}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CategoryField
                ref={categoryRef}
                categories={watch('categories')}
                setCategories={(value) => setValue('categories', value, {shouldValidate: true } )}
                genres={watch('genres')}
                error={errors.categories}
                disabled={loading}
              />
            </Grid>
          </Grid>

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
                ref={uploadsRef.current['thumb_file']}
                accept={'image/*'}
                label={'Thumb'}
                setValue={(value) => setValue('thumb_file', value)}
              />
              <UploadField
              ref={uploadsRef.current['banner_file']}
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
                ref={uploadsRef.current['trailer_file']}
                accept={'video/mp4'}
                label={'Trailer'}
                setValue={(value) => setValue('trailer_file', value)}
              />
              <UploadField
                ref={uploadsRef.current['video_file']}
                accept={'video/mp4'}
                label={'Principal'}
                setValue={(value) => setValue('video_file', value)}
              />
            </CardContent>
          </Card>
         
          <br/>
          <Card className={classes.cardOpened}>
            <CardContent className={classes.cardContentOpened}>
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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