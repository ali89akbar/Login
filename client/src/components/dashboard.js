import React, { Fragment, useEffect, useState } from "react";

const Dashboard = (props) => {

    const [name,Setname]= useState("")

   async function getName(){
        try {
            const response = await fetch("http://localhost:5000/dashboard",{
                method:"GET",
                headers:{token: localStorage.token}

            })
            const parse = await response.json()
            console.log(parse)
            Setname(parse.name)
        } catch (error) {
            console.error(error)
        }
    }
    const Logout= e =>{
        e.preventDefault();
        localStorage.removeItem('token');
        SetAuth(false)
    }
    useEffect(() => {
        getName();
      }, []);
  const { SetAuth } = props;
  return (
    <Fragment>
      <h1>Dashboard {name}</h1>
      <button className="btn btn-primary" onClick={(e) => Logout(e)}>LogOut</button>
    </Fragment>
  );
};

export default Dashboard;