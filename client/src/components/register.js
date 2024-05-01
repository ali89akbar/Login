import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = (props) => {
  const { SetAuth } = props;

  const [input, SetInput] = useState({
    email: "",
    password: "",
    companyName: "",
    owner: "",
    streetAddress: "",
    state: "",
    city: "",
    zipCode: "",
    country: "",
    phone_no: "",
    company_description: "",
  });

  const {
    email,
    password,
    companyName,
    owner,
    streetAddress,
    state,
    city,
    zipCode,
    country,
    phone_no,
    company_description,
  } = input;

  const onChange = (e) => {
    SetInput({ ...input, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();

    try {
      const body = {
        email,
        password,
        companyName,
        owner,
        streetAddress,
        state,
        city,
        zipCode,
        country,
        phone_no,
        company_description,
      };
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const parse = await response.json();
      if (parse.token) {
        localStorage.setItem("token", parse.token);
        SetAuth(true);
        console.log(parse);
        toast.success("Register Successfully");
      } else {
        SetAuth(false);
        toast.error(parse.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <Fragment>
      <div className="header">
        <h2>Register</h2>
      </div>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          className="form-control my-3"
          value={companyName}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="owner"
          placeholder="Owner"
          className="form-control my-3"
          value={owner}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="streetAddress"
          placeholder="Street Address"
          className="form-control my-3"
          value={streetAddress}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="form-control my-3"
          value={state}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="form-control my-3"
          value={city}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          className="form-control my-3"
          value={zipCode}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          className="form-control my-3"
          value={country}
          onChange={(e) => onChange(e)}
        />
        <input
          type="text"
          name="phone_no"
          placeholder="Phone No"
          className="form-control my-3"
          value={phone_no}
          onChange={(e) => onChange(e)}
        />
        <textarea
          type="text"
          name="company_description"
          placeholder="Company Description"
          className="form-control my-3"
          value={company_description}
          onChange={(e) => onChange(e)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control my-3"
          value={email}
          onChange={(e) => onChange(e)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control my-3"
          value={password}
          onChange={(e) => onChange(e)}
        />
        <button className="btn-login">Submit</button>
      </form>
      <br />
      <Link to={"/login"}>
        <p>Already User? Login</p>
      </Link>
    </Fragment>
  );
};

export default Register;