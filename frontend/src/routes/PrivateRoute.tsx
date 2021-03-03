// @flow 
import { useKeycloak } from '@react-keycloak/web';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';

interface PrivateProps extends RouteProps {
  component: 
   | React.ComponentType<RouteComponentProps<any>>
   | React.ComponentType<any>;
};

const PrivateRoute = (props: PrivateProps) => {
  const {component: Component, ...rest} = props;
  const {keycloak} = useKeycloak();
  const render = React.useCallback((props) => {
    if(keycloak.authenticated){
      return <Component {...props} />;
    }
  
    return (
      <Redirect 
        to={{
          pathname: "/login",
          state: {from: props.location}
        }}
      />
    );
  }, []);
  return <Route {...rest} render={render}/>
};

export default PrivateRoute;


