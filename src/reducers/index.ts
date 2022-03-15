import appReducer from "./appReducer";
import {combineReducers} from 'redux-immer';
import {produce} from 'immer';

const reducers = combineReducers(produce, {
    app: appReducer,
})
export default reducers;
export type RootReducer = ReturnType<typeof reducers>;