import React,{useState, useEffect, useRef} from 'react';
import { format, parseISO } from "date-fns";
import genreHttp from '../../util/http/genre-http';
import DefaultTable, { makeActionStyles, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import {Link} from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from 'notistack';
import useFilter from '../../hooks/useFilter';
import categoryHttp from '../../util/http/category-http';
import * as yup from '../../util/vendor/yup';
import { Category, Genre, ListResponse } from '../../util/models';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { FilterResetButton } from '../../components/Table/FilterResetButton';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
      filter: false,
    }
  },
  {
    name: "name",
    label: "Nome",
    width: "23%",
    options: {
      filter: false
    }
  },
  {
    name: "is_active",
    label: "Ativo?",
    width:  '4%',
    options: {
      customBodyRender(value, tableMeta, updateValue){
        return value? <BadgeYes/> : <BadgeNo/>; 
      }
    }
  },
  {
    name: "categories",
    label: "Categorias",
    width: "20%",
    options: {
      filterType: 'multiselect',
      filterOptions: {
        names: []
      },
      customBodyRender(value, tableMeta, updateValue){
          return (value as any).map((category: any) => category.name).join(', ');
      }
    }
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "10%",
    options: {
      filter: false,
      customBodyRender(value, tableMeta, updateValue){
      return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
      }
    }
  },
  {
    name: "actions",
    label: "Ações",
    width: "13%",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <IconButton
            color={'secondary'}
            component={Link}
            to={`/genres/${tableMeta.rowData[0]}/edit`}
          >
            <EditIcon/>
          </IconButton>
    
        )
      }
    }
  }
];

const debounceTime = 300;
const debounceSearchTime = 300;
const rowsPerPage = 15;
const rowsPerPageOptions = [15,25,50];

const Table = () => {
  
  const snackbar = useSnackbar();
  const subscribed = useRef(true);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>();
  const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
  const {
    columns,
    filterManager,
    cleanSearchText,
    filterState,
    debouncedFilterState,
    totalRecords,
    setTotalRecords
  } = useFilter({
    columns: columnsDefinition,
    debounceTime: debounceTime,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: rowsPerPageOptions,
    tableRef,
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          categories: yup.mixed()
                  .nullable()
                  .transform( value => {
                    return !value || value === '' ? undefined: value.split(',');
                  })
                  .default(null)
        })
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter? {
          ...(
            debouncedState.extraFilter.categories &&
            {categories: debouncedState.extraFilter.categories.join(',')}
          )
        } : undefined
      },
      getStateFromURL: (queryParams) => {
        return {
          type: queryParams.get('categories')
        }
      }
    }
  });

  const indexColumnCategories = columns.findIndex(c => c.name === 'categories');
  const columnCategories = columns[indexColumnCategories];
  const categoriesFilterValue = filterState.extraFilter && filterState.extraFilter.categories;
  (columnCategories.options as any).filterList = categoriesFilterValue
    ? categoriesFilterValue
    : [];
  const serverSideFilterList = columns.map(column => []);
  if (categoriesFilterValue) {
    serverSideFilterList[indexColumnCategories] = categoriesFilterValue;
  }
  

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      try {
        const {data} = await categoryHttp.list({queryParams: {all: ''}});
        if(isSubscribed){
          setCategories(data.data);
          (columnCategories.options as any).filterOptions.names = data.data.map(category => category.name)

          // setData(data.data);
        }
      } catch(error){
        console.error(error);
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações',
          {variant: 'error'}
        )
      }
      
    })();

    return () => {
      isSubscribed = false;
    }
   
  }, []);

  useEffect(() => {
    subscribed.current = true;
    getData();
    return () => {
      subscribed.current = false;
    }
  },[
    cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order
  ]);

  async function getData(){
    setLoading(true);
    try {
      const {data} = await genreHttp.list<ListResponse<Genre>>({
        queryParams: {
          search: cleanSearchText(debouncedFilterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(
            debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.categories &&
            {categories: debouncedFilterState.extraFilter.categories.join(',')}
          )
        }
      });
      if(subscribed.current){
        setData(data.data);
        setTotalRecords(data.meta.total);
        // setSearchState(( prevState => ({
        //   ...prevState,
        //   pagination: {
        //     ...prevState.pagination,
        //     total: data.meta.total
        //   }
        // })));
      }
    } catch(error){
      console.error(error);
      if(genreHttp.isCancelledRequest(error)){
        return;
      }
      snackbar.enqueueSnackbar(
        'Não foi possível carregar as informações',
        {variant: 'error'}
      )
    } finally {
      setLoading(false)
    }
}
  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
      <DefaultTable
        title="Listagem de gêneros"
        columns={columns}
        data={data}  
        loading={loading}
        debouncedSearchTime={debounceSearchTime}
        ref={tableRef}
        options={{
          serverSide:true,
          responsive: "standard",
          searchText: filterState.search as any,
          page: filterState.pagination.page - 1,
          rowsPerPage: filterState.pagination.per_page,
          rowsPerPageOptions,
          count: totalRecords,
          onFilterChange: (column, filterList, type) => {
            const columnIndex = columns.findIndex(c => c.name === column);
            filterManager.changeExtraFilter({
              [column as string] : filterList[columnIndex].length ? filterList[columnIndex]: null
            })
          },
          customToolbar: () => (
            <FilterResetButton 
              handleClick={()=> {
                filterManager.resetFilter()
              }}
            />
          ),
          onSearchChange: (value: any) => filterManager.changeSearch(value),
          onChangePage: (page) => filterManager.changePage(page),
          onChangeRowsPerPage: (perPage) => filterManager.changeRowsPerPage(perPage),
          onColumnSortChange: (changedColumn, direction) => 
                              filterManager.changeColumnSort(changedColumn, direction)
        }}  
      />
    </MuiThemeProvider>
  );
};

export default Table;