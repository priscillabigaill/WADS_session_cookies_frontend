import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Get the authentication state from the cookie
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true';

    // Set the authentication state to the cookie
    const setLoggedInCookie = (value) => {
        Cookies.set('isLoggedIn', value ? 'true' : 'false', { expires: 7 }); // Expires in 7 days
    };

    // Set the session ID to the cookie
    const setSessionIdCookie = (sessionId) => {
      Cookies.set('session_id', sessionId, { expires: 7 }); // Expires in 7 days
    };

    // Set the language preference to the cookie
    const setLanguagePreferenceCookie = (language) => {
        Cookies.set('languagePreference', language, { expires: 7 }); // Expires in 7 days
    };

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8005/login', {
                email,
                password,
            });

            console.log(response.data); // Check response data

            // Check if login is successful
            if (response.data.success) {
                // Set authToken cookie
                Cookies.set('authToken', response.data.userId);
                setLoggedInCookie(true);

                // Set session ID cookie
                setSessionIdCookie(response.data.sessionId);

                // Check for language preference cookie
                const preferredLanguage = Cookies.get('languagePreference');

                // Redirect to Landing page
                navigate('/');

                // Optionally set language preference cookie if it doesn't exist
                if (!preferredLanguage) {
                    setLanguagePreferenceCookie('en'); // Set default language to 'en' (English)
                }
            } else {
                setError('Login failed - Invalid email or password');
            }
        } catch (err) {
            setError('Login failed - ' + err.message);
        }

        setLoading(false);
    }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
      <form onSubmit={handleLogin} className='flex flex-col items-center justify-center'>
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-8">Login</h1>
        </div>
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }}  />
        </div>
        <div className="mb-6">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div>
          <button type="submit" className="bg-blue-300 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 border-b-4 border-blue-500 hover:border-blue-500 rounded mt-3 mb-3">Login</button>
        </div>
        </form>
        {error && <p className="text-red-500 bg-red-100 py-2 px-4 rounded mt-2">{error}</p>} {/* Style error message */}
        <div className="mt-4">
          <p className="text-gray-600">Don't have an account? <Link to="/signup" className="text-purple-900 font-semibold">Sign up</Link></p>
        </div>
        <div className="mt-4">
          <Link to="/" className="text-purple-900 font-semibold">Back to Home</Link>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 p-4 text-sky-900 font-bold">
          <h3>Priscilla Abigail Munthe - 2602109883</h3>
      </div>
    </div>
  );
}

