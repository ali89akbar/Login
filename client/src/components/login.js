import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import {toast} from 'react-toastify';

const Login = (props) => {
    const { SetAuth } = props;

  const [inputs, setInput] = useState({ email: "", password: "" });

  const { email, password } = inputs;

  const onChange = (e) => {
    setInput({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email, password };
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
      throw new Error("Login Failed. Please try again.");
    }
      const parse = await response.json();
      if(parse.token)
      {
      localStorage.setItem('token',parse.token)
      props.SetAuth(true);
      toast.success("Login SuccessFull");
      }
      else{
        SetAuth(false)
        toast.error(parse.message);
      }
    } catch (error) {
     console.error(error.message);
      toast.error(error.message);

    }
  };

  return (
    <Fragment className="container" >
            <div className="welcome">
                <h1>Welcome Back</h1>
            </div>
      <form onSubmit={onSubmit}>
        <div className="header">
            <h2>Login</h2>
            
        </div>
        <div className="input-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          ///className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          //className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        />
         <button className="btn btn-login" type="submit">
          Log In
        </button>
        </div>
      </form>
      <br />
      <Link to={"/register"}><p>Don't have Account? Register</p></Link>

    </Fragment>
  );
};

export default Login;