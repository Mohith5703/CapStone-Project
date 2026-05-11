// store.ts

import { configureStore } from "@reduxjs/toolkit";
import  aboutReducer from "./AboutSlice";



export const store=configureStore({
    reducer:{
        about:aboutReducer
        
        //more reducers here
    }
})

export type RootSate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;