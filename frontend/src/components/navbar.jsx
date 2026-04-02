import { Link } from "react-router-dom";


const Navbar = () => {

    return (
        <div className="flex justify-center">
            <div className="shadow-sm bg-taupe-50/45 w-[100%] max-md:w-[100%] px-8 py-5">
                <Link to="/" className="text-black font-medium text-lg tracking-normal">Passport Pro</Link>
            </div>
        </div>
    )

};

export default Navbar;