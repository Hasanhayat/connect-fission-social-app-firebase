import React, { createContext, useReducer } from 'react'
import { reducer } from './Reducer';

export const GlobalContext = createContext("Initial Value");

let data = {
    user: {},
    isLogin: null,
}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)
    const logout = () => {
        localStorage.removeItem("userToken");
        dispatch({ type: "USER_LOGOUT" });
    };
    return (
        <GlobalContext.Provider value={{ state, dispatch, logout }}>
            {children}
        </GlobalContext.Provider>
    )
}