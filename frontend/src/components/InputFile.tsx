// @flow 
import * as React from 'react';
import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';

export interface InputFileProps {
  ButtonFile: React.ReactNode
  InputFileProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
  TextFieldProps?: TextFieldProps;
};

export interface InputFileComponent extends React.RefAttributes<InputFileComponent> {
  openWindow: () => void
  clear: () => void
}

const InputFile = React.forwardRef<InputFileComponent, InputFileProps>((props, ref) => {
  const fileRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  const [fileName, setFileName] = React.useState("");
  const textFieldProps: TextFieldProps = {
    variant:'outlined',
    ...props.TextFieldProps,
    InputProps:{
            ...props.TextFieldProps?.InputProps, //pode dar merda
            readOnly: true, 
            endAdornment: (
              <InputAdornment position={"end"}>
                {props.ButtonFile}
              </InputAdornment>
            )
    },
    value: fileName
  }
  
  const inputFileProps = {
    ...props.InputFileProps,
    hidden: true,
    ref: fileRef,
    onChange(event){
      const files = event.target.files;
      if(files.length){
        setFileName(Array.from(files).map((file: any) => file.name).join(","));
      }
      if(props.InputFileProps?.onChange){
        props.InputFileProps.onChange(event);
      }
    }
  };
  React.useImperativeHandle(ref, () => ({
    openWindow: () => fileRef.current.click(),
    clear: () => setFileName("")
  }))

  return (
    <>
      <input type="file" {...inputFileProps}/>
      <TextField {...textFieldProps}/>
    </>
  );
});

export default InputFile;