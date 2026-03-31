import { OrbitProgress } from "react-loading-indicators"


const Loader = () => {
    
    return (
        <div className="w-[100%] h-[100vh] content-center text-center">
            <OrbitProgress color="#32cd32" size="medium" text="" textColor="" />
        </div>
    )

}

export default Loader;