import React,{useState, useEffect, useRef} from 'react';
import { format, parseISO } from "date-fns";
import castMemberHttp from '../../util/http/cast-member-http';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import DefaultTable, { makeActionStyles, MuiDataTableRefComponent, TableColumn } from '../../components/Table';
import { useSnackbar } from 'notistack';
import useFilter from '../../hooks/useFilter';
import * as yup from '../../util/vendor/yup';
import { CastMember, CastMemberTypeMap, ListResponse } from '../../util/models';
import { FilterResetButton } from '../../components/Table/FilterResetButton';
import { invert } from 'lodash';

const castMemberNames = Object.values(CastMemberTypeMap);
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
    name: "type",
    label: "Tipo",
    width: "4%",
    options: {
      filterOptions: {
        names: castMemberNames
      },
      customBodyRender: (value) => {
        return CastMemberTypeMap[value];
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
      filter:false,
      sort: false,
      customBodyRender: (value, tableMeta) => {
        return (
          <IconButton
            color={'secondary'}
            component={Link}
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
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
  const [data, setData] = useState<CastMember[]>([]);
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
    extraFilter: {
      createValidationSchema: () => {
        return yup.object().shape({
          type: yup.string()
                  .nullable()
                  .transform( value => {
                    return !value || !castMemberNames.includes(value)? undefined: value;
                  })
                  .default(null)
        })
      },
      formatSearchParams: (debouncedState) => {
        return debouncedState.extraFilter? {
          ...(
            debouncedState.extraFilter.type &&
            {type: debouncedState.extraFilter.type}
          )
        } : undefined
      },
      getStateFromURL: (queryParams) => {
        return {
          type: queryParams.get('type')
        }
      }
    }
  });

  const indexColumnType = columns.findIndex(c => c.name === 'type');
  const columnType = columns[indexColumnType];
  const typeFilterValue = filterState.extraFilter && filterState.extraFilter.type as never;
  (columnType.options as any).filterList = typeFilterValue ? [typeFilterValue]: []
  
  const serverSideFilterList = columns.map(columns => []);
  if (typeFilterValue) {
    serverSideFilterList[indexColumnType] = [typeFilterValue];
  }
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
    debouncedFilterState.order,
    JSON.stringify(debouncedFilterState.extraFilter)
  ]);

  async function getData(){
    setLoading(true);
    try {
      const {data} = await castMemberHttp.list<ListResponse<CastMember>>({
        queryParams: {
          search: filterManager.cleanSearchText(filterState.search),
          page: filterState.pagination.page,
          per_page: filterState.pagination.per_page,
          sort: filterState.order.sort,
          dir: filterState.order.dir,
          ...(
            debouncedFilterState.extraFilter &&
            debouncedFilterState.extraFilter.type &&
            {type: invert(CastMemberTypeMap)[debouncedFilterState.extraFilter.type]}
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
      if(castMemberHttp.isCancelledRequest(error)){
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
        title="Listagem de membros"
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
          onFilterChange: (column, filterList) => {
            const columnIndex = columns.findIndex(c => c.name === column)
            filterManager.changeExtraFilter({
              [column as any]: filterList[columnIndex].length ? filterList[columnIndex][0]: null
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
                              filterManager.changeColumnSort(changedColumn, direction)}}   
      />
     </MuiThemeProvider>
  );
};

export default Table;