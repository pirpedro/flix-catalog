import React,{useState, useEffect} from 'react';
import MUIDataTable,{ MUIDataTableColumn} from "mui-datatables";
import { httpVideo } from '../../util/http';
import { format, parseISO } from "date-fns";

const columnDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "categories",
    label: "Categorias",
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
  
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    httpVideo.get('genres').then(
      response => setData(response.data.data)
    );
  }, []);
  return (
    <MUIDataTable 
      title="Listagem de gêneros"
      columns={columnDefinition}
      data={data}  
    />
  );
};

export default Table;