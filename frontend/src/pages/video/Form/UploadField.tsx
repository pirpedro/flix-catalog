// @flow 
import { Button, FormControl, FormControlProps } from '@material-ui/core';
import * as React from 'react';
import InputFile, { InputFileComponent } from '../../../components/InputFile';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

interface UploadFieldProps {
  accept: string;
  label: string;
  setValue: (value) => void;
  error?: any;
  disabled?: boolean;
  formControlProps? : FormControlProps;
};

export interface UploadFieldComponent extends React.RefAttributes<InputFileComponent> {
  clear: () => void
}

const UploadField = React.forwardRef<UploadFieldComponent, UploadFieldProps>((props, ref) => {
  const fileRef = React.useRef() as React.MutableRefObject<InputFileComponent>;
  const { accept, label, setValue, disabled, error} = props;

  React.useImperativeHandle(ref, () => ({
    clear: () => fileRef.current.clear()
  }));
  return (
    <FormControl 
      error={error !== undefined}
      disabled={disabled === true}
      fullWidth
      margin={"normal"}
      {...props.formControlProps}
    >
     <InputFile
        ref={fileRef}
        TextFieldProps={{
          label: label,
          InputLabelProps: {
            shrink:true
          },
          style: {backgroundColor: '#ffffff'}
        }}
        InputFileProps={{
          accept,
          onChange(event){
            event.target.files?.length &&
              setValue(event.target.files[0])
          }
        }} 
        ButtonFile={
          <Button
                  endIcon={<CloudUploadIcon/>}
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => fileRef.current.openWindow()}
                >
                  Adicionar
          </Button>
        }
    />
    </FormControl>
  );
});

export default UploadField;