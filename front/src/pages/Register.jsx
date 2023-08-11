import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/Context';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useContext(Context);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTER_START" });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { email, password });
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      navigate("/login"); // Rediriger vers la page de connexion après l'inscription réussie
    } catch(err) {
      dispatch({ type: "REGISTER_FAILURE" });
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Adresse e-mail</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-sm hover:bg-gray-800 focus:outline-none"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register;