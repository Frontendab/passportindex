import './App.css';
import { lazy, Suspense } from 'react';
// import MapChart from "./components/map";
import { Routes, Route } from "react-router-dom";
import Loader from './components/loader';

const Home = lazy(() => import("./pages/Home"));
const Navbar = lazy(() => import("./components/navbar"));


function App() {

  return (
    <Suspense fallback={<Loader />}>
      <Navbar />
      <div className="w-80 h-100 bg-green-400 rounded-md blur-xl opacity-10 absolute top-30 -left-5"></div> 
      <div className="w-120 h-140 bg-green-400 rounded-full blur-xl opacity-10 absolute -bottom-35 -right-10"></div> 

      <Routes>
        <Route path="/" index element={<Home />}/>
      </Routes>
    </Suspense>
  )

}

export default App
