import * as React from "react"
import {ChakraProvider, theme,} from "@chakra-ui/react"
import {applyMiddleware, createStore} from 'redux';
import reducers from './reducers/index'
import {Provider} from 'react-redux';
import thunk from "redux-thunk";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {composeWithDevTools} from "redux-devtools-extension";
import Todos from "./pages/Todos";

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))
export const App = () => (
    <Provider store={store}>
        <ToastContainer/>
        <ChakraProvider theme={theme}>
            <Todos/>
        </ChakraProvider>
    </Provider>
)
