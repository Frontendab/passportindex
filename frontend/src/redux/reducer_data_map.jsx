import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    map: [],
    id: localStorage.getItem("id") ? localStorage.getItem("id") : "",
    countries: "",
    passport: []
};

const dataMapSlice = createSlice({
    name: "data_map",
    initialState,
    reducers: {
        saveData(state, action) {
            state.map = action.payload;
        },
        saveIdCountry(state, action){
            state.id = action.payload
            localStorage.setItem("id", action.payload)
        },
        saveCountries(state, action){
            state.countries = action.payload;
        },
        save_passport(state, action){
            state.passport = action.payload;
        }
    },
});

export const { saveData, saveIdCountry, saveCountries, save_passport } = dataMapSlice.actions;
export default dataMapSlice.reducer;