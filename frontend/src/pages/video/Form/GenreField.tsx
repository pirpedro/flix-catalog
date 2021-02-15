// @flow 
import { FormControl, FormControlProps, FormHelperText, Typography } from '@material-ui/core';
import * as React from 'react';
import AsyncAutocomplete, { AsyncAutoCompleteComponent } from '../../../components/AsyncAutocomplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import genreHttp from '../../../util/http/genre-http';
import { getGenresFromCategory } from '../../../util/model-filters';

interface GenreFieldProps extends React.RefAttributes<GenreFieldProps>{
  genres: any[];
  setGenres: (genres) => void
  categories: any[];
  setCategories: (categories) => void
  error: any,
  disabled?: boolean
  FormControlProps? : FormControlProps;

};

export interface GenreFieldComponent {
  clear: () => void
}
const GenreField = React.forwardRef<GenreFieldComponent, GenreFieldProps> ((props, ref) => {
  const {
    disabled,
    error,
    genres,
    setGenres,
    categories,
    setCategories
  } = props;
  const autocompleteHttp = useHttpHandled();
  const {addItem, removeItem} = useCollectionManager(genres, setGenres);
  const {removeItem: removeCategory} = useCollectionManager(categories, setCategories);
  const autocompleteRef = React.useRef() as React.MutableRefObject<AsyncAutoCompleteComponent>
  
  function fetchOptions(searchText){
    return autocompleteHttp( 
      genreHttp.list({
        queryParams: {
          search: searchText, all: ""
        }
      })
    ).then(data => data.data);
  }
  
  React.useImperativeHandle(ref, () => ({
    clear: () => autocompleteRef.current.clear()
  }));

  return (
    <>
      <AsyncAutocomplete
        ref={autocompleteRef}
        fetchOptions={fetchOptions}
        TextFieldProps={{
          label: "Gêneros",
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
        error={error!== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        <GridSelected>
          {
            genres.map((genre, key) => (
              <GridSelectedItem 
                key={key} 
                onDelete={() => {
                  const categoriesWithOneGenre = categories
                                      .filter(category => {
                                        const genresFromCategory = getGenresFromCategory(genres, category);
                                        return genresFromCategory.length === 1 && genres[0].id == genre.id
                                      });
                  categoriesWithOneGenre.forEach(cat => removeCategory(cat));
                  removeItem(genre)
                }} 
                xs={12}
              >
                <Typography>
                  {genre.name}
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

export default GenreField;