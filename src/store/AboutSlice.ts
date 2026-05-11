//  aboutSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState={
    username:'',
    password:''
}

const aboutSlice =createSlice({
    name:'about',
    initialState,
    reducers:{
        saveData:(state,action)=>{
            state.username=action.payload.username,
            state.password=action.payload.password

        }
    }
})

export const {saveData}=aboutSlice.actions;

export default aboutSlice.reducer;