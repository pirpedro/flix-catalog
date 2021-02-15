import axios from "axios";
import { useSnackbar } from "notistack";

const useHttpHandled = () => {
  const snackbar = useSnackbar();
  return async (request: Promise<any>) => {
    try{
      const {data} = await request;
      return data;
    }catch(e){
      console.log(e);
      if(!axios.isCancel(e)){
        snackbar.enqueueSnackbar(
          'Não foi possível carregar as informações',
          {variant: 'error'}
        );
      }
      throw e;
    }
  }
}

export default useHttpHandled;