import { applyMiddleware, createStore, combineReducers } from "redux";
import createSagaMiddleWare from "redux-saga";
import rootSaga from "./root-saga";
import upload from "./upload";

const sagaMiddleware = createSagaMiddleWare();
const store = createStore(
  combineReducers({
    upload
  }),
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
export default store;