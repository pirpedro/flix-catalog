import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete, AutocompleteProps } from "@material-ui/lab";
import * as React from 'react';
import { useDebounce } from 'use-debounce/lib';

interface AsyncAutocompleteProps extends React.RefAttributes<AsyncAutocompleteProps>{
  fetchOptions: (searchText) => Promise<any>
  debounceTime?: number;
  TextFieldProps?: TextFieldProps;
  AutoCompleteProps?: Omit<AutocompleteProps<any, any, any, any>, 'renderInput'| 'options'>;
};

export interface AsyncAutoCompleteComponent {
  clear: () => void
}


const AsyncAutocomplete = React.forwardRef<AsyncAutoCompleteComponent, AsyncAutocompleteProps>( (props, ref) => {
  
  const {AutoCompleteProps, debounceTime = 300, fetchOptions} = props;
  const {freeSolo = false, onOpen, onClose, onInputChange } = AutoCompleteProps as any;
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const [debouncedSearchText] = useDebounce(searchText, debounceTime);
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
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
    inputValue: searchText,
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
  }, [open, freeSolo])

  React.useEffect(() => {
    if(!open){
      return;
    }
    if(debouncedSearchText === "" && freeSolo){
      return;
    }
    let isSubscribed = true;
    (
    async() =>{
      setLoading(true);
      try{
        const data = await fetchOptions(debouncedSearchText);
        if(isSubscribed) {
          setOptions(data);
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      isSubscribed = false;
    }
  },[freeSolo,debouncedSearchText,open, fetchOptions]);

  React.useImperativeHandle(ref, () => ({
    clear: () => {
      setSearchText("");
      setOptions([]);
    }
  }));
  return (
    <Autocomplete {...autoCompleteProps}/>
  );
});

export default AsyncAutocomplete;