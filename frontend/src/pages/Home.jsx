import { useState } from "react";
import Select from "../components/select";
import ReCAPTCHA from 'react-google-recaptcha';
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { API_URL, SITE_KEY } from "../global/variables";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveData, saveIdCountry } from "../redux/reducer_data_map";
import ImageSearch from "../assets/search.png";


const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ select: {
        id: "",
        label: "",
    }, captcha: '' });
    
    const onCaptchaChange = (value) => {
        setFormData({ ...formData, captcha: value });
    };

    const onchangeSelect = (value) => {
        setFormData({ ...formData, select: value });
        dispatch(
            saveIdCountry(value.id)
        );
    };

    const submit_form = async(e) => {
        e.preventDefault();
        if (!formData.select.id) {
            toast.error("Please select your nationality.")
            return;
        }else if (!formData.captcha) {
            toast.error("Please complete the CAPTCHA.")
            return;    
        }
        const options = {
            captcha: formData.captcha,
        };
        try {
            const response = await axios.post(
                `${API_URL}/nationalities/${formData.select.id}`, options
            );
            if (response.status == 200){
                    await navigate("/analysis");

                    const data_map = response.data.data;
                    dispatch(saveData(
                        data_map
                    ));
            };
        } catch (error) {
            if (error?.response?.data.status == "error") {
                const msg = error.response.data.message;
                toast.error(msg)
            }
        }
    };

    return (
        <div className="relative">
            <div className="z-[-1] w-80 h-100 bg-green-400 rounded-md blur-xl opacity-10 absolute top-30 -left-5"></div> 
            <div className="z-[-1] w-120 h-140 bg-green-400 rounded-full blur-xl opacity-10 absolute -bottom-35 -right-10"></div> 

            <div className="content mt-12">
                <div className="information text-center pt-10 max-md:pt-0 grid gap-5">
                    <div className="parent-span">
                        <small className="bg-green-50 text-green-800 rounded-lg p-[5px] font-medium">Global Access Index 2026</small>
                    </div>
                    <div>
                        <h1 className="text-[4rem] max-md:text-[2.5rem] font-bold leading-[1.14]">
                            Check Your<br />
                            <span className="text-green-800">
                                Passport Power
                            </span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-normal tracking-wide">
                        Instantly visualize your global mobility. Compare visa requirements and<br />
                        discover new horizons with our digital concierge.
                    </p>
                </div>
                <div className="flex justify-center pt-10">
                    <div className="absolute">
                        <img src={ImageSearch} alt="Image's search" />
                    </div>
                    <form className="form rounded shadow-sm w-130 p-5 grid gap-2" onSubmit={submit_form}>
                        <label htmlFor="nationality" className="font-normal">Select your nationality:</label>
                        <Select input_id={"nationality"} onchangeSelect={onchangeSelect}/>
                        <div className="my-2">
                            <ReCAPTCHA
                                sitekey={SITE_KEY}
                                onChange={onCaptchaChange}
                            />
                        </div>
                        <button type="submit" className="bg-linear-to-r from-[#006E0A] to-[#32CD32] p-3 hover:opacity-80 transition rounded cursor-pointer text-white font-medium flex justify-center items-center gap-3">
                            <span>Analyze Power</span>
                            <span><FaArrowRightLong /></span>
                        </button>
                    </form>
                </div>
            </div>

        </div>
    )
};

export default Home;
