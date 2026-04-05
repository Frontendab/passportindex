import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FlagIcon from "../components/flag_icon";
import { useEffect, useState } from 'react';
import SearchInput from './search';
import { useDispatch } from 'react-redux';
import { saveIdCountry } from '../redux/reducer_data_map';


export default function CountiesTable({data}) {
    const dispatch = useDispatch();
    const [from, _] = useState(0);
    const [to, setTo] = useState(5);

    const data_copy = data.visa_requirements.slice(from, to);
    const [rows, setRows] = useState(data_copy);

    const [inputValue, setInputValue] = useState("")

    const onChangeInputSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setInputValue(e)
        const data_filter = data_copy.filter((item) => (
            item.name.toLowerCase().includes(value) || item.visa_type.toLowerCase().includes(value)
        ));
        setRows(data_filter);
    };

    const LoadingMore = () => {
        setTo(to + to);
    };

    useEffect(() => {
        setRows(
            data.visa_requirements.slice(from, to)
        );
        if (inputValue) {
            onChangeInputSearch(inputValue);
        }
    }, [to, from, data, inputValue]);

    return (
        <TableContainer component={Paper}>
        <SearchInput data={rows} onChangeInputSearch={onChangeInputSearch}/>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Country</TableCell>
                <TableCell align="right">Visa type</TableCell>
                <TableCell align="right">Color</TableCell>
                <TableCell align="right">Days</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => {
                return (
                    <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                            dispatch(
                                saveIdCountry(row.id)
                            )
                        }}
                    >
                    <TableCell component="th" scope="row" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}>
                        <FlagIcon countryCode={row.icon}/>
                        <span>{row.name}</span>
                    </TableCell>
                    <TableCell align="right">{row.visa_type}</TableCell>
                    <TableCell align="right" style={{
                        display: "flex"
                    }}>
                        <div className="w-[20px] h-[20px] rounded-full" style={{
                            backgroundColor: row.color
                        }}></div>
                    </TableCell>

                    <TableCell align="right">
                        <span>{row.days ? row.days : 0}</span>
                    </TableCell>

                    </TableRow>
                )
            })}
            </TableBody>
        </Table>
        <div className='px-3 py-5 w-full text-center'>
            <button className="text-green-700 hover:text-green-600 capitalize cursor-pointer w-fit font-medium"
                onClick={LoadingMore}
            >
                loading more...
            </button>
        </div>
        </TableContainer>
        );
}