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
    SET_TODO_ITEM
} from "../types";

export enum States {
    loading = 'loading',
    success = 'success',
    failure = 'failure'
}

export type GetTodosData = {
    id: string,
    title: string
}
type InitialState = {
    getTodos: {
        state: States | null,
        isLoading: boolean | null,
        data: GetTodosData[] | null,
        hasListener: boolean | null,
        itemEdit: {
            state: States | null,
            isLoading: boolean | null,
            data: GetTodosData | null
        }
        create: {
            state: States | null,
            isLoading: boolean | null,
        },
        edit: {
            state: States | null,
            isLoading: boolean | null,
        }
    }
}
export type ActionType =
    { type: typeof GET_TODOS_INIT }
    | { type: typeof GET_TODOS_EXITO, payload: GetTodosData[] }
    | { type: typeof GET_TODOS_ITEM_MODIFIED, payload: GetTodosData }
    | { type: typeof GET_TODOS_NEW_ITEM, payload: GetTodosData }
    | { type: typeof GET_TODOS_ERROR }
    | { type: typeof GET_TODOS_DELETE_ITEM, payload: string }
    | { type: typeof SET_TODO_ITEM, payload: string }
    | { type: typeof CREATE_NEW_TODO_INIT }
    | { type: typeof CREATE_NEW_TODO_EXITO }
    | { type: typeof CREATE_NEW_TODO_ERROR }
    | { type: typeof EDIT_TODO_ITEM_INIT }
    | { type: typeof EDIT_TODO_ITEM_EXITO }
    | { type: typeof EDIT_TODO_ITEM_ERROR }
const initialState: InitialState = {
    getTodos: {
        state: null,
        isLoading: null,
        data: null,
        hasListener: null,
        itemEdit: {
            state: null,
            isLoading: null,
            data: null,
        },
        create: {
            state: null,
            isLoading: null,
        },
        edit: {
            state: null,
            isLoading: null,
        }
    }
}

export default function appReducer(state = initialState, action: ActionType): InitialState {
    switch (action.type) {
        case GET_TODOS_INIT :
            state.getTodos.state = States.loading;
            state.getTodos.isLoading = true;
            return state;
        case GET_TODOS_EXITO:
            state.getTodos.state = States.success;
            state.getTodos.isLoading = false;
            state.getTodos.data = action.payload;
            state.getTodos.hasListener = true;
            return state;
        case GET_TODOS_ITEM_MODIFIED:
            state.getTodos.data = Array.isArray(state.getTodos.data) ? state.getTodos.data.map(x => x.id === action.payload.id ? action.payload : x) : state.getTodos.data;
            return state;
        case GET_TODOS_NEW_ITEM:
            state.getTodos.data = Array.isArray(state.getTodos.data) ? [...state.getTodos.data, action.payload] : [];
            return state;
        case GET_TODOS_ERROR:
            state.getTodos.state = States.failure;
            state.getTodos.isLoading = false;
            state.getTodos.data = null;
            state.getTodos.hasListener = false;
            return state;
        case GET_TODOS_DELETE_ITEM:
            state.getTodos.data = Array.isArray(state.getTodos.data) ? state.getTodos.data.filter(x => x.id !== action.payload) : [];
            return state;
        case SET_TODO_ITEM:
            let setItem;
            if (Array.isArray(state.getTodos.data)) {
                setItem = state.getTodos.data.find(x => x.id === action.payload)
                if (setItem !== undefined) {
                    state.getTodos.itemEdit.data = setItem;
                }
            } else {
                setItem = null;
            }
            return state;
        case CREATE_NEW_TODO_INIT:
            state.getTodos.create.state = States.loading;
            state.getTodos.create.isLoading = true;
            return state;
        case CREATE_NEW_TODO_EXITO:
            state.getTodos.create.state = States.success;
            state.getTodos.create.isLoading = false;
            return state;
        case CREATE_NEW_TODO_ERROR:
            state.getTodos.create.state = States.failure;
            state.getTodos.create.isLoading = false;
            return state;
        case EDIT_TODO_ITEM_INIT:
            state.getTodos.edit.state = States.loading;
            state.getTodos.edit.isLoading = true;
            return state;
        case EDIT_TODO_ITEM_EXITO:
            state.getTodos.edit.state = States.success;
            state.getTodos.edit.isLoading = false;
            return state;
        case EDIT_TODO_ITEM_ERROR:
            state.getTodos.edit.state = States.failure;
            state.getTodos.edit.isLoading = false;
            return state;
        default:
            return state;
    }
}