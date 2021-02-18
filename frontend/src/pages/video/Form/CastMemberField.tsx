// @flow 
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import * as React from 'react';
import AsyncAutocomplete, {AsyncAutoCompleteComponent} from '../../../components/AsyncAutocomplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import castMemberHttp from '../../../util/http/cast-member-http';

interface CastMemberFieldProps extends React.RefAttributes<CastMemberFieldProps> {
  castMembers: any[];
  setCastMembers: (castMembers) => void
  error: any,
  disabled?: boolean
  FormControlProps? : FormControlProps;
};

export interface CastMemberFieldComponent {
  clear: () => void
}

const CastMemberField = React.forwardRef<CastMemberFieldComponent, CastMemberFieldProps> ((props, ref) => {
  const {
    castMembers,
    setCastMembers,
    disabled,
    error
  } = props;
  const autocompleteHttp = useHttpHandled();
  const {addItem, removeItem} = useCollectionManager(castMembers, setCastMembers);
  const autocompleteRef = React.useRef() as React.MutableRefObject<AsyncAutoCompleteComponent>
  
  const fetchOptions = React.useCallback((searchText) => {
    return autocompleteHttp( 
      castMemberHttp.list({
        queryParams: {
          search: searchText, all: ""
        }
      })
    ).then(data => data.data);
  }, [autocompleteHttp]);

  React.useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));
  
  return (
    <>
      <AsyncAutocomplete
        ref={autocompleteRef}
        fetchOptions={fetchOptions}
        TextFieldProps={{
          label: "Elenco",
          error: error !== undefined
        }}
        AutoCompleteProps={{
          // autoSelect: true,
          clearOnEscape: true,
          freeSolo: true,
          getOptionSelected: (option, value) => option.id === value.id,
          getOptionLabel: option => option.name,
          onChange: (event, value) => addItem(value),
          disabled,
        }}
      />
      <FormControl
        margin={"normal"}
        fullWidth
        error={error !== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        <GridSelected>
          {
            castMembers.map((castMember, key) => (
              <GridSelectedItem 
                key={key} 
                onDelete={() => {
                  removeItem(castMember)
                }} 
                xs={6}
              >
                <Typography noWrap={true}>
                  {castMember.name}
                </Typography>
              </GridSelectedItem>
            ))
          }
        
        </GridSelected>
        {
          error && <FormHelperText>{error.message}</FormHelperText>
        }
      </FormControl>
    </>
  );
});

export default CastMemberField;