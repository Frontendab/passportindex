import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {API_URL} from "../global/variables";
import axios from "axios";
import Loader from "../components/loader";
import { save_passport, saveIdCountry } from "../redux/reducer_data_map";

const Head = lazy(() => import("../components/head"));
const SideBarPassport = lazy(() => import("../components/side_bar_passport"));
const MapChart = lazy(() => import("../components/map"));
const CountiesTable = lazy(() => import("../components/table"));


const Analysis = () => {

    const { passport, id } = useSelector((state) => state.data_map);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const fetchPassportInfo = async() => {
        try {
            setLoading(false);
            const response = await axios.get(
                `${API_URL}/passports/${id}`
            );
            if (response.data?.data){
                dispatch(
                    save_passport(response.data?.data)
                )
                dispatch(
                    saveIdCountry(
                        response.data?.data.id
                    )
                )
                setLoading(true);
            }
        } catch (error) {
            console.log("Catch error when yo fetching passport info.");
        }
    };

    useEffect(() => {
        fetchPassportInfo();
    }, [id]);

    return (
        loading ? (
            <div className="w-[100%] p-8 max-md:p-4">
                <div className="grid grid-cols-3 gap-4 max-md:flex max-md:flex-col">
                    <div className="">
                        <Head />
                        {passport ? <SideBarPassport data={passport}/> : ""}
                    </div>
                    <div className="col-span-2 bg-gray-100 rounded p-5 max-md:p-0">
                        <MapChart data={passport} id={id}/>
                        <div className="table-">
                            {passport ? <CountiesTable data={passport} />: ""}
                        </div>
                    </div>
                </div>
            </div>
        ) : <Loader />
    )
};

export default Analysis;