// @flow 
import { FormControl, FormControlProps, FormHelperText, makeStyles, Theme, Typography, useTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import * as React from 'react';
import AsyncAutocomplete, { AsyncAutoCompleteComponent } from '../../../components/AsyncAutocomplete';
import { GridSelected } from '../../../components/GridSelected';
import GridSelectedItem from '../../../components/GridSelectedItem';
import useCollectionManager from '../../../hooks/useCollectionManager';
import useHttpHandled from '../../../hooks/useHttpHandled';
import categoryHttp from '../../../util/http/category-http';
import { getGenresFromCategory } from '../../../util/model-filters';
import { Genre } from '../../../util/models';

const useStyles = makeStyles((theme: Theme) => ({
  genresSubtitle: {
    fontSize: '0.8em',
    color: grey["800"]
  }
}));

interface CategoryFieldProps extends React.RefAttributes<CategoryFieldProps> {
  categories: any[];
  setCategories: (categories) => void;
  genres: Genre[];
  error: any,
  disabled?: boolean
  FormControlProps? : FormControlProps;
};

export interface CategoryFieldComponent {
  clear: () => void
}

const CategoryField = React.forwardRef<CategoryFieldComponent, CategoryFieldProps> ((props, ref) => {
  const {error, disabled, categories, setCategories, genres} = props;
  const classes = useStyles();
  const autocompleteHttp = useHttpHandled();
  const {addItem, removeItem} = useCollectionManager(categories, setCategories);
  const autocompleteRef = React.useRef() as React.MutableRefObject<AsyncAutoCompleteComponent>
  const theme = useTheme();
  
  const fetchOptions = React.useCallback((searchText) => {
    return autocompleteHttp( 
      categoryHttp.list({
        queryParams: {
          genres: genres.map(genre => genre.id).join(','),
          all: ""
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
          label: "Categorias",
          error: error !== undefined
        }}
        AutoCompleteProps={{
          // autoSelect: true,
          clearOnEscape: true,
          getOptionSelected: (option, value) => option.id === value.id,
          getOptionLabel: option => option.name,
          onChange: (event, value) =>addItem(value),
          disabled: disabled ===true || !genres.length,
        }}
      />
        <FormHelperText style={{height: theme.spacing(3)}}>
        Escolha pelo menos uma categoria de cada gênero
        </FormHelperText>
       <FormControl
        margin={"normal"}
        fullWidth
        error={error!== undefined}
        disabled={disabled === true}
        {...props.FormControlProps}
      >
        <GridSelected>
          {
              categories.map((category, key) => {
                const genresFromCategory = getGenresFromCategory(genres, category)
                                  .map(genre => genre.name).join(',');
                return (
                  <GridSelectedItem 
                    key={key} 
                    onDelete={() => removeItem(category)} 
                    xs={12}>
                    <Typography noWrap={true}>
                      {category.name}
                    </Typography>
                    <Typography noWrap={true} className={classes.genresSubtitle}>
                      Gêneros: {genresFromCategory}
                    </Typography>
                  </GridSelectedItem>
                )
              })
            }
        </GridSelected>
        {
          error && <FormHelperText>{error.message}</FormHelperText>
        }
      </FormControl>
    </>
  );
});

export default CategoryField;