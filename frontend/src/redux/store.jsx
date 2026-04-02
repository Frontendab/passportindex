import { configureStore } from "@reduxjs/toolkit";
import dataMapReducer from "./reducer_data_map";

const store = configureStore({
    reducer: {
        data_map: dataMapReducer
    }
});

export default store;