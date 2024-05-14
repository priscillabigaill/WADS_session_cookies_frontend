import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from "axios"; 

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(Cookies.get('isLoggedIn') === 'true');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
        // Get session ID from cookie or wherever it's stored
        const session_id = Cookies.get('session_id');
        console.log('Logging out with session ID:', session_id);

        // Make a request to your backend to delete session
        await axios.delete(`http://127.0.0.1:8005/session/${session_id}`);

        // Handle logout logic here
        Cookies.remove('isLoggedIn');
        Cookies.remove('authToken');
        Cookies.remove('colorPreference');
        Cookies.remove('languagePreference');
        Cookies.remove('session_id');
        navigate('/login'); // Redirect to login page after logout
    } catch (error) {
        console.error('Logout failed:', error.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-3">Welcome ⸜(｡˃ ᵕ ˂ )⸝♡</h1>
        </div>
        <div className="flex justify-center">
          <Link to="/todo">
            <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3 mr-3">To-do</button>
          </Link>
          {isLoggedIn && (
            <button onClick={handleLogout} className="bg-red-300 hover:bg-red-200 text-red-800 font-bold py-2 px-4 border-b-4 border-red-500 hover:border-red-500 rounded mt-3 mr-3">Log out</button>
          )}
        </div>
        {!isLoggedIn && (
          <p className="mt-4 text-gray-600">
            Guest mode.<Link to="/login" className="text-yellow-800 hover:underline ml-1 font-bold">Login</Link> to save tasks!
          </p>
        )}
      </div>
      <div className="fixed bottom-0 left-0 p-4 text-sky-900 font-bold">
        <h3>Priscilla Abigail Munthe - 2602109883</h3>
      </div>
    </div>
  );
}