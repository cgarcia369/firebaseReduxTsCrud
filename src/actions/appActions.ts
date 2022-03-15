import {collection, doc, getFirestore, onSnapshot, query, setDoc, updateDoc} from "firebase/firestore";
import {app} from "../firebase";
import {
    CREATE_NEW_TODO_ERROR,
    CREATE_NEW_TODO_EXITO,
    CREATE_NEW_TODO_INIT,
    EDIT_TODO_ITEM_ERROR,
    EDIT_TODO_ITEM_EXITO,
    EDIT_TODO_ITEM_INIT,
    GET_TODOS_DELETE_ITEM,
    GET_TODOS_ERROR,
    GET_TODOS_EXITO,
    GET_TODOS_INIT,
    GET_TODOS_ITEM_MODIFIED,
    GET_TODOS_NEW_ITEM,
    SET_TODO_ITEM,
} from "../types";
import {toast} from 'react-toastify'
import {ActionType, GetTodosData} from "../reducers/appReducer";
import {v4 as uuidv4} from 'uuid';

const db = getFirestore(app)

export const getTodos = () => {
    return async (dispatch: any) => {
        try {
            dispatch(getTodosFn())
            let isFirstLoading = false;
            const q = query(collection(db, "todos"),);
            onSnapshot(q, (querySnapshot) => {
                if (!isFirstLoading) {
                    const todos: GetTodosData[] = [];
                    querySnapshot.forEach((doc) => {
                        todos.push({...doc.data(), id: doc.id} as GetTodosData);
                    });
                    dispatch(getTodosFnExito(todos))
                }
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        if (isFirstLoading) {
                            toast.success("Se ha agregado un todo")
                            dispatch(getTodosFnNewItem({...change.doc.data(), id: change.doc.id} as GetTodosData))
                        }
                    }
                    if (change.type === "modified") {
                        toast.success("Se ha modificado un todo")
                        dispatch(getTodosFnItemModified({...change.doc.data(), id: change.doc.id} as GetTodosData))
                    }
                    if (change.type === "removed") {
                        toast.info("Se ha eliminado un todo")
                        dispatch(getTodosFnDeleleItem(change.doc.id))
                    }
                });
                isFirstLoading = true;
            });

        } catch (e) {
            console.log(e);
            dispatch(getTodosFnError())
        }
    }
}
const getTodosFn = () => ({
    type: GET_TODOS_INIT
})
const getTodosFnExito = (payload: GetTodosData[]): ActionType => ({
    type: GET_TODOS_EXITO,
    payload
})
const getTodosFnError = () => ({
    type: GET_TODOS_ERROR
})
const getTodosFnItemModified = (payload: GetTodosData): ActionType => ({
    type: GET_TODOS_ITEM_MODIFIED,
    payload
})
const getTodosFnNewItem = (payload: GetTodosData): ActionType => ({
    type: GET_TODOS_NEW_ITEM,
    payload
})
const getTodosFnDeleleItem = (payload: string): ActionType => ({
    type: GET_TODOS_DELETE_ITEM,
    payload
})
export const createNewTodo = (payload: string) => {
    return async (dispatch: any) => {
        try {
            dispatch(createNewTodoFn())
            await setDoc(doc(db, "todos", uuidv4()), {
                title: payload
            });
            dispatch(createNewTodoFnExito())
        } catch (e) {
            dispatch(createNewTodoFnError())
        }
    }
}
const createNewTodoFn = (): ActionType => ({
    type: CREATE_NEW_TODO_INIT
})
const createNewTodoFnExito = (): ActionType => ({
    type: CREATE_NEW_TODO_EXITO
})
const createNewTodoFnError = (): ActionType => ({
    type: CREATE_NEW_TODO_ERROR
})
export const setEditTodoItem = (payload: string) => {
    return async (dispatch: any) => {
        dispatch(setEditTodoItemFnExito(payload))
    }
}
const setEditTodoItemFnExito = (payload: string): ActionType => ({
    type: SET_TODO_ITEM,
    payload
})
export const editTodoItem = (payload: any) => {
    return async (dispatch: any) => {
        try {
            dispatch(editTodoItemFn())
            await updateDoc(doc(db, "todos", payload.id), {
                title: payload.title
            });
            dispatch(editTodoItemFnExito())
        } catch (e) {
            dispatch(editTodoItemFnError())
        }
    }
}
const editTodoItemFn = () => ({
    type: EDIT_TODO_ITEM_INIT
})
const editTodoItemFnExito = () => ({
    type: EDIT_TODO_ITEM_EXITO
})
const editTodoItemFnError = () => ({
    type: EDIT_TODO_ITEM_ERROR
})