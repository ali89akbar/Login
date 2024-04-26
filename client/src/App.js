import React,{Fragment, useEffect, useState} from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Register from "./components/register";
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';
import { ToastContainer } from 'react-toastify';


function App() {

  const [Isauthenticated,setAuthenticated] = useState(false);
const SetAuth = (boolean) =>{
  setAuthenticated(boolean);
}

async function isAuth(){
  try {
    const response = await fetch("http://localhost:5000/auth/verify",{
      method:'GET',
      headers:{token: localStorage.token}
    })

    const parse = await response.json();
    console.log(parse);
    parse === true ? setAuthenticated(true) : setAuthenticated(false);
  } catch (error) {
    console.error(error)
  }
}
useEffect(()=>{
isAuth();
},[])
  return (
    <Fragment>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/login" element={!Isauthenticated ? <Login SetAuth={SetAuth}/> : (<Navigate to={'/dashboard'}/>)} />
            <Route path="/register" element={!Isauthenticated ? <Register SetAuth={SetAuth} />:(<Navigate to={'/login'}/>)} />
            <Route path="/dashboard" element={Isauthenticated ? <Dashboard SetAuth={SetAuth} /> : (<Navigate to={'/login'}/>)} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer/>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;