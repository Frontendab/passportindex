import ImageWorld from "../assets/world.png";
import ImageQr from "../assets/qr.png";
import { useEffect, useState } from "react";


const SideBarPassport = ({data}) => {

    const linkImage = data?.cover;

    const test_img = `https://images.weserv.nl/?url=${linkImage}`;

    const [evisaCount, setEvisaCount] = useState(0);
    const [freeVisaCount, setFreeVisaCount] = useState(0);

    const analysisData = () => {
        const evisa_count = data.visa_requirements.filter((item) => (
            item.visa_type.toLowerCase().includes("evisa")
        )).length;
        const freevisa_count = data.visa_requirements.filter((item) => (
            item.visa_type.toLowerCase().includes("visa-free")
        )).length;
        setEvisaCount(evisa_count);
        setFreeVisaCount(freevisa_count);
    };

    useEffect(() => {
        analysisData();
    }, []);

    return (
        <div className="bg-mist-50 border-1 border-green-700 rounded mt-5 p-5 flex max-lg:flex max-lg:flex-wrap">
            <div className="first">
                <h1 className="pb-3 text-[1.6rem] max-lg:text-[1.5rem] font-bold text-center text-green-800">
                    {data.name_passport}
                </h1>
                <img src={test_img} alt=""/>
            </div>
            <div className="mt-3 ml-5 max-md:w-full max-md:grid max-md:grid-cols-2 max-md:gap-4 max-lg:ml-0 ">
                <div className="border-1 border-gray-200 box h-fit grid gap-3 md:w-40 text-center bg-neutral-100 rounded p-5">
                    <div className="flex justify-center h-fit">
                        <img src={ImageWorld} width="20" height="20" className="w-[20px] h-[20px]" alt="" />
                    </div>
                    <h1 className="font-bold text-2xl h-fit">{freeVisaCount}</h1>
                    <span className="font-normal text-gray-700 text-sm h-fit">VISA-FREE</span>
                </div>
                <div className="border-1 mt-5 max-lg:mt-0 border-gray-200 box h-fit grid gap-3 md:w-40 text-center bg-neutral-100 rounded p-5">
                    <div className="flex justify-center h-fit">
                        <img src={ImageQr} width="20" height="20" className="w-[20px] h-[20px]" alt="" />
                    </div>
                    <h1 className="font-bold text-2xl h-fit">{evisaCount}</h1>
                    <span className="font-normal text-gray-700 text-sm h-fit">EVISA</span>
                </div>
            </div>
        </div>
    );
};

export default SideBarPassport;