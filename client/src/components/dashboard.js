import React, { Fragment, useEffect, useState } from "react";
import { toast } from 'react-toastify';

const Dashboard = (props) => {
  const [names, setNames] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, SetName] = useState("");
  const [role, setRole] = useState("");
  const [values, Setvalues] = useState("");
  const [show,Setshow]= useState("");
  const [rec,Setrec]= useState(false);

  async function getName() {
    try {
      const response = await fetch("http://localhost:5000/dashboard", {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parse = await response.json();
      console.log(parse);
      setNames(parse.id);
      Setvalues(parse.ownerid);
    } catch (error) {
      console.error(error);
    }
  }
  const viewEmployee = async () => {
    try {
      const response = await fetch(`http://localhost:5000/dashboard/view/${names}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });
      const parse = await response.json();
      console.log(parse);
      Setshow(parse)
      Setrec(true)
      // Do something with the parsed data, such as displaying it in the UI
    } catch (error) {
      console.error(error);
    }
  };
  const renderRecords = () => {
    return show.map((record, index) => {
      return (
        <tr key={index} style={{border:'1px solid black'}}>
          <td style={{ borderRight: '1px solid black' }}>{record.name}</td>
          <td style={{ borderRight: '1px solid black' }}>{record.username}</td>
        </tr>
      );
    });
  };
  const Logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    props.SetAuth(false);
    toast.success("LogOut SuccessFully");
  };

  useEffect(() => {
    getName();
  }, []);

  const handleAddEmployee = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cid = names; // Replace this with the actual company ID
    const role = document.querySelector('select[name="role"]').value;
    try {
      const responses = await fetch(`http://localhost:5000/dashboard/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
          cid,
          role,
        }),
      });
      if (!responses.ok) {
        const error = await responses.json();
        throw new Error(error.error);
      }
      const parse = await responses.json();
      console.log(parse);
      toast.success("Employee added successfully");
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error("Error adding employee");
    }
  };
  return (
    <Fragment>
      <h1>Dashboard {values}</h1>
      <button className="btn btn-primary" onClick={(e) => Logout(e)}>
        LogOut
      </button>
      <button className="btn btn-secondary" onClick={viewEmployee} style={{marginLeft:'5px'}} >
      View Employee
      </button>
      {rec && (
        <div>
          <h2>Employee Records</h2>
          <table style={{border:'1px solid black', marginTop:'5px', marginBottom:'9px'}}>
            <thead style={{border:'1px solid black'}}>
              <tr>
                <th style={{ borderRight: '1px solid black' }}>Name</th>
                <th style={{ borderRight: '1px solid black' }}>Username</th>
                
              </tr>
            </thead>
            <tbody style={{border:'1px solid black'}}>{renderRecords()}
            
            </tbody>
          </table>
        </div>
      )}
      <button className="btn btn-secondary" style={{marginLeft:'5px'}} onClick={handleAddEmployee} onDoubleClick={()=>{setShowForm(false)}}>
        Add Employee
      </button>
      {showForm && (
        <div>
          <h2>Add Employee Form</h2>
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => SetName(e.target.value)} />
            <br />
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <label>Role:</label>
            <select name="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select a role</option>
              <option value="Uploader">Uploader</option>
              <option value="Quality Evaluator">Quality Evaluator</option>
            </select>
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

    </Fragment>
  );
};

export default Dashboard;