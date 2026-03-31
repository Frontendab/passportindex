import { useState } from "react";
import Select from "../components/select";
import ReCAPTCHA from 'react-google-recaptcha';
import { FaArrowRightLong } from "react-icons/fa6";


const SITE_KEY = "6LdHS6AsAAAAANBvPehpO7ujN4GtRJjc-VFiaDXZ"


const Home = () => {
    const [formData, setFormData] = useState({ captcha: '' });
    
    const onCaptchaChange = (value) => {
        setFormData({ ...formData, captcha: value });
    };

    return (
        <div className="relative">
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
                    <form className="form rounded shadow-sm w-130 p-5 grid gap-2" onSubmit={(e) => {
                        console.log("Submit!");
                    }}>
                        <label htmlFor="nationality" className="font-normal">Select your nationality:</label>
                        <Select input_id={"nationality"}/>
                        <div className="my-2">
                            <ReCAPTCHA
                                sitekey={SITE_KEY}
                                onChange={onCaptchaChange}
                                className=""
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
