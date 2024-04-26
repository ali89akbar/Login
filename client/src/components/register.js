import React,{Fragment, useState} from "react";
import { Link } from "react-router-dom";
import {toast} from 'react-toastify';

const Register =(props)=>{
    const { SetAuth } = props;

    const [input,Setinput] = useState({
        email:"",
        password:"",
        name:""
    })

    const {email,password,name}= input;

    const onChange = (e) =>{
        Setinput({...input,[e.target.name]:e.target.value})
    }

    const onSubmitForm = async (e) =>{
        e.preventDefault();

        try {
            const body = {email,password,name}
            const response = await fetch("http://localhost:5000/auth/register",{
                method:'POST',
                headers:{"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            const parse = await response.json()
            if(parse.token)
            {
            localStorage.setItem('token',parse.token);
            SetAuth(true);
            console.log(parse);
            toast.success("Register Successfully");
            }
            else{
                SetAuth(false)
                toast.error(parse.message);
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message);
        }
    }
    return(
            <Fragment>
            <div className="header">
            <h2>Register</h2>
            
            </div> 
            <form onSubmit={onSubmitForm}>
                    <input type="email" name="email" placeholder="Email" className="form-control my-3" value={email} onChange={e=> onChange(e)}/>
                    <input type="password" name="password" placeholder="Password" className="form-control my-3" value={password} onChange={e=> onChange(e)}/>
                    <input type="text" name="name" placeholder="Name" className="form-control my-3" value={name} onChange={e=> onChange(e)}/>
              <button className="btn-login"> Submit

              </button>
                </form>
                <br />
                <Link to={"/login"} ><p>Already User? Login</p></Link>
            </Fragment>
    )
}
export default Register;