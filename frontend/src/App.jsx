import './App.css';
import { lazy, Suspense } from 'react';
import { Routes, Route } from "react-router-dom";
import Loader from './components/loader';
import ToasterNotify from './components/toaster';

const Navbar = lazy(() => import("./components/navbar"));
const Home = lazy(() => import("./pages/Home"));
const Analysis = lazy(() => import("./pages/analysis"));


function App() {

  return (
    <Suspense fallback={<Loader />}>
      <ToasterNotify />
      <Navbar />
      <Routes>
        <Route path="/" index element={<Home />}/>
        <Route path="/Analysis" index element={<Analysis />}/>
      </Routes>
    </Suspense>
  )

}

export default App
