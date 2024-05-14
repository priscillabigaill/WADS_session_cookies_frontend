import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignUp(e) {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            
            // Make a POST request to your backend API endpoint for creating a new user
            const response = await axios.post('http://localhost:8005/users', {
                email,
                password
            });

            // Handle the response
            console.log(response.data); // Assuming the response contains user data

            alert('Account successfully created!');
            navigate("/login");
        } catch (err) {
            setError("Account failed to be created - " + err.message);
        }
      
        setLoading(false);
    }
    
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-11 bg-white rounded-lg">
        <div>
          <h1 className="text-purple-900 text-2xl font-semibold mb-3">Sign Up</h1>
        </div>
        <div className="mb-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div className="mb-6">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-200 border border-gray-400 rounded py-2 px-4 w-full focus:outline-none focus:bg-white focus:border-purple-500" style={{ color: 'black' }} />
        </div>
        <div>
          <button onClick={handleSignUp} className="bg-green-300 hover:bg-green-200 text-green-800 font-bold py-2 px-4 border-b-4 border-green-500 hover:border-green-500 rounded">Sign Up</button>
        </div>
        {/* {successMessage && <p className="text-green-500 bg-green-100 py-2 px-4 rounded mt-4">{successMessage}</p>} Display success message */}
        {error && <p className="text-red-500 bg-red-100 py-2 px-4 rounded mt-4">{error}</p>} {/* Style error message */}
        <div className="mt-4">
          <p className="text-gray-600">Already have an account? <Link to="/login" className="text-purple-900 font-semibold">Login</Link></p>
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
