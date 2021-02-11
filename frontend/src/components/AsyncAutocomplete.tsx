import { Button, CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps, UseAutocompleteProps } from "@material-ui/lab";
import { useSnackbar } from 'notistack';
import * as React from 'react';

interface AsyncAutocompleteProps {
  fetchOptions: (searchText) => Promise<any>
  TextFieldProps?: TextFieldProps;
  AutoCompleteProps?: Omit<AutocompleteProps<any, any, any, any>, 'renderInput'>;

};
const AsyncAutocomplete = (props: AsyncAutocompleteProps) => {
  
  const {AutoCompleteProps} = props;
  const {freeSolo, onOpen, onClose, onInputChange } = AutoCompleteProps as any;
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const snackbar = useSnackbar();
  const TextFieldProps: TextFieldProps = {
    margin:'normal',
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: {shrink: true},
    ...(props.TextFieldProps && {...props.TextFieldProps})
  }
  
  const autoCompleteProps: AutocompleteProps<any, any, any, any> = {
    loadingText: "Carregando...",
    noOptionsText: "Nenhum item encontrado.",  
    ...(AutoCompleteProps && {...AutoCompleteProps}),
    open,
    options,
    loading: loading,
    onOpen(event){
      setOpen(true);
      onOpen && onOpen(event)
    },
    onClose(event, reason){
      setOpen(false);
      onClose && onClose(event, reason);
    },
    onInputChange(event, value, reason){
      setSearchText(value);
      onInputChange && onInputChange(event, value, reason);
    },
    renderInput:  params => (
      <TextField 
        {...params}
        {...TextFieldProps}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress color={"inherit"} size={20}/>}
              {params.InputProps.endAdornment}
            </>
          )
        }}
      />
    )
  };

  React.useEffect(()=> {
    if (!open && !freeSolo){
      setOptions([]);
    }
  }, [open])

  React.useEffect(() => {
    if(!open || searchText === "" && freeSolo){
      return;
    }
    let isSubscribed = true;
    (
    async() =>{
      setLoading(true);
      try{
        const {data} = await props.fetchOptions(searchText);
        if(isSubscribed) {
          setOptions(data);
        }
      } catch(error){
        console.error(error);
        snackbar.enqueueSnackbar(
          "Não foi possível carregar as informações.",
          {variant: 'error'}
        );
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isSubscribed = false;
    }
  },[freeSolo? searchText: open])
  return (
    <Autocomplete {...autoCompleteProps}/>
  );
};

export default AsyncAutocomplete;