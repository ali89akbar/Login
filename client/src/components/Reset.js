import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ match }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/reset-password/${match.params.token}`, { newPassword });
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="newPassword">New Password</label>
      <input
        type="password"
        name="newPassword"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;