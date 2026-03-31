import AsyncSelect from 'react-select/async';
import axios from "axios";
import { API_URL } from "../global/variables"
import { useEffect } from 'react';

// TODO I have to fetch data from /nationalities as

let data = []

const filterColors = (inputValue) => {
    return data.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

const loadOptions = (
    inputValue,
    callback,
) => {
    setTimeout(() => {
        callback(filterColors(inputValue));
    }, 1000);
};

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? '#32cd32' : '#ccc',
        boxShadow: state.isFocused ? '0 0 0 1px #32cd32' : 'none',
        '&:hover': {
            borderColor: '#32cd32'
        }
    }),

    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#32cd32' : 'white',
        color: state.isFocused ? 'white' : 'black',
        cursor: 'pointer'
    }),

    singleValue: (provided) => ({
        ...provided,
        color: '#333'
    }),

    menu: (provided) => ({
        ...provided,
        borderRadius: '10px'
    })
};

const Select = ({ input_id }) => {

    const fetchData = async() => {
        try {
            const response = await axios.get(
                `${API_URL}/nationalities`
            );
            const res = response.data?.data;
            const result = res.map(item => ({
                _id: item._id,
                label: item.name_passport
            }));
            data = result;
        } catch (error) {
            console.log(`Fetch nationalities is failed.`, error);
        }
    };

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <AsyncSelect styles={customStyles} cacheOptions loadOptions={loadOptions} defaultOptions inputId={input_id}/>
    )
}

export default Select;