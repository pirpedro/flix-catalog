import React,{useState, useEffect} from 'react';
import MUIDataTable,{ MUIDataTableColumn} from "mui-datatables";
import { format, parseISO } from "date-fns";
import categoryHttp from '../../util/http/category-http';
import { BadgeNo, BadgeYes } from '../../components/Badge';


const columnDefinition: MUIDataTableColumn[] = [
  {
    name: "name",
    label: "Nome"
  },
  {
    name: "is_active",
    label: "Ativo?",
    options: {
      customBodyRender(value, tableMeta, updateValue){
        return value ? <BadgeYes/>: <BadgeNo/>
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

interface Category {
  id: string,
  name: string
}

type Props = {};
const Table = (props: Props) => {

  const [data, setData] = useState<Category[]>([]);
  
  useEffect(() => {
    categoryHttp
      .list<{data: Category[]}>()
      .then(({data}) => setData(data.data));
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