import React,{useState, useEffect} from 'react';
import MUIDataTable,{ MUIDataTableColumn} from "mui-datatables";
import { httpVideo } from '../../util/http';
import { format, parseISO } from "date-fns";

const CastMemberTypeMap = {
  1: 'Director',
  2: 'Ator'
};

const columnDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "type",
    label: "Tipo",
    options: {
      customBodyRender: (value) => {
        console.log(value);
        return CastMemberTypeMap[value];
      }
    }
   
  },
  {
    name: "created_at",
    label: "Criado em",
    options: {
      customBodyRender(value, tableMeta, updateValue){
      return <span>{format(parseISO(value), 'dd/MM/yyyy')}</span>
      }
    }
  }
];

type Props = {
  
};
const Table = (props: Props) => {

  const [data, setData] = useState([]);
  
  useEffect(() => {
    httpVideo.get('cast_members').then(
      response => setData(response.data.data)
    );
  }, []);
  return (
    <MUIDataTable 
      title="Listagem de categorias"
      columns={columnDefinition}
      data={data}  
    />
  );
};

export default Table;