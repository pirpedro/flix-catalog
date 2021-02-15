import React,{useState, useEffect, useRef, useReducer} from 'react';
import { format, parseISO } from "date-fns";
import categoryHttp from '../../util/http/category-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';
import { Category, ListResponse } from '../../util/models';
import DefaultTable, { makeActionStyles, TableColumn, MuiDataTableRefComponent } from '../../components/Table'
import { useSnackbar } from 'notistack';
import { IconButton, MuiThemeProvider} from '@material-ui/core';
import {Link} from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import reducer, { INITIAL_STATE, Creators } from '../../store/filter';
import useFilter from '../../hooks/useFilter';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
      filter: false
    }
  },
  {
    name: "name",
    label: "Nome",
    width: "43%",
    options: {
      filter: false
    }
  },
  {
    name: "is_active",
    label: "Ativo?",
    width: "4%",
    options: {
      filterOptions: {
        names: ['Sim', 'Não']
      },
      customBodyRender(value, tableMeta, updateValue){
        return value ? <BadgeYes/>: <BadgeNo/>
      }
    },
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
            to={`/categories/${tableMeta.rowData[0]}/edit`}
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
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef() as React.MutableRefObject<MuiDataTableRefComponent>;
  const {
    columns,
    filterManager,
    filterState,
    debouncedFilterState,
    dispatch,
    totalRecords,
    setTotalRecords
  } = useFilter({
    columns: columnsDefinition,
    debounceTime: debounceTime,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: rowsPerPageOptions,
    tableRef,
  });

  useEffect(() => {
    subscribed.current = true;
    filterManager.pushHistory();
    getData();
    return () => {
      subscribed.current = false;
    }
  }, [
    filterManager.cleanSearchText(debouncedFilterState.search),
    debouncedFilterState.pagination.page,
    debouncedFilterState.pagination.per_page,
    debouncedFilterState.order
  ]);

  async function getData(){
      setLoading(true);
      try {
        const {data} = await categoryHttp.list<ListResponse<Category>>({
          queryParams: {
            search: filterManager.cleanSearchText(filterState.search),
            page: filterState.pagination.page,
            per_page: filterState.pagination.per_page,
            sort: filterState.order.sort,
            dir: filterState.order.dir
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
        if(categoryHttp.isCancelledRequest(error)){
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
        title="Listagem de categorias"
        columns={columns}
        data={data}
        loading={loading}
        debouncedSearchTime={debounceSearchTime}
        ref={tableRef}
        options={{
            serverSide: true,
            responsive: "standard",
            searchText: filterState.search as any,
            page: filterState.pagination.page - 1,
            rowsPerPage: filterState.pagination.per_page,
            rowsPerPageOptions,
            count: totalRecords,
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