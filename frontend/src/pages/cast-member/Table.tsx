import React,{useState, useEffect} from 'react';
import { format, parseISO } from "date-fns";
import castMemberHttp from '../../util/http/cast-member-http';
import { IconButton, MuiThemeProvider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import EditIcon from "@material-ui/icons/Edit";
import DefaultTable, { makeActionStyles, TableColumn } from '../../components/Table';
import { useSnackbar } from 'notistack';

const CastMemberTypeMap = {
  1: 'Director',
  2: 'Ator'
};

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
    width: "40%",
  },
  {
    name: "type",
    label: "Tipo",
    width: "7%",
    options: {
      customBodyRender: (value) => {
        return CastMemberTypeMap[value];
      }
    }
   
  },
  {
    name: "created_at",
    label: "Criado em",
    width: "13%",
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
            to={`/cast-members/${tableMeta.rowData[0]}/edit`}
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      setLoading(true);
      try{
        const {data} = await castMemberHttp.list();
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
        title="Listagem de membros"
        columns={columnsDefinition}
        data={data}
        loading={loading}
        options={{responsive: "standard"}}   
      />
     </MuiThemeProvider>
  );
};

export default Table;