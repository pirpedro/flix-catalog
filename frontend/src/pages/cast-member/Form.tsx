import { Box, Button, ButtonProps, FormControl, FormControlLabel, makeStyles, Radio, RadioGroup, TextField, Theme } from '@material-ui/core';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import castMemberHttp from '../../util/http/cast-member-http';

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

const {register, handleSubmit, getValues, setValue} = useForm();

React.useEffect(() => {
  register({name: "type"})
}, [register]);

function onSubmit(formData, event){
  castMemberHttp
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
    <FormControl margin="normal">
      <RadioGroup
        name="type"
        onChange={(e) => {
          setValue('type', parseInt(e.target.value));
        }}
      >
        <FormControlLabel value="1" control={<Radio color="primary"/>} label="Diretor"/>
        <FormControlLabel value="2" control={<Radio color="primary"/>} label="Ator"/>
      </RadioGroup>
    </FormControl>
    <Box dir={"rtl"}>
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
    </Box>
  </form>
)
}

export default Form;