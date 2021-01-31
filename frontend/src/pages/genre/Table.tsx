import React,{useState, useEffect} from 'react';
import { format, parseISO } from "date-fns";
import genreHttp from '../../util/http/genre-http';
import DefaultTable, { makeActionStyles, TableColumn } from '../../components/Table';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import {Link} from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from 'notistack';

const columnsDefinition: TableColumn[] = [
  {
    name: "id",
    label: "ID",
    width: "30%",
    options: {
      sort: false,
    }
  },
  {
    name: "name",
    label: "Nome",
    width: "23%",
  },
  {
    name: "categories",
    label: "Categorias",
    width: "20%",
    options: {
      // customBodyRenderLite(dataIndex){
      //   let value = data[dataIndex].categories ?? {};
      //   return value.map((category: any) => category.name).join(', ');
      // }
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


const Table = () => {
  
  const snackbar = useSnackbar();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setLoading(true);
      try {
        const {data} = await genreHttp.list();
        if(isSubscribed){
          setData(data.data);
        }
      } catch(error){
        console.error(error);
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações',
          {variant: 'error'}
        )
      } finally {
        setLoading(false)
      }
      
    })();

    return () => {
      isSubscribed = false;
    }
   
  }, []);
  return (
    <MuiThemeProvider theme={makeActionStyles(columnsDefinition.length-1)}>
      <DefaultTable
        title="Listagem de gêneros"
        columns={columnsDefinition}
        data={data}  
        loading={loading}
        options={{responsive: "standard"}}  
      />
    </MuiThemeProvider>
  );
};

export default Table;