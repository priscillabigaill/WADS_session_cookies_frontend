import { useState } from "react";
import axios from "axios"; 
import Cookies from 'js-cookie'; // Import js-cookie

export function TodoForm({ addTodo }) {
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
  
    if (newItem === "") return;
  
    try {
      // Retrieve the authentication token from cookies
      const authToken = Cookies.get('authToken');
  
      // Ensure owner_id is included in the request payload
      const payload = {
        title: newItem,
        owner_id: authToken  // Assuming authToken is the owner_id
      };
  
      // Send POST request to backend endpoint with the correct data format
      const response = await axios.post("http://localhost:8005/items/", payload, {
        headers: {
          Authorization: `Bearer ${authToken}` // Attach the token to the request headers
        }
      });
      console.log('Received response:', response.data);
  
      // If the request is successful, call the addTodo function to update state
      addTodo(response.data);
      // Reset newItem state variable to clear the input field
      setNewItem("");

      // window.location.reload();
    } catch (error) {
      // Log any errors that occur during the request
      console.error('Error adding todo:', error.message);
      setError('Error adding todo:', error.message); // Set error state
    }
  }

  return (
    <div>
      <form className="new-item-form">
        <div className="form-row">
          <div className="text-violet-900 text-2xl font-semibold mb-3 mt-4">
          <label htmlFor="item">Add new:</label>
          </div>
          <input 
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            style={{
              backgroundColor: '#ddd6fe',
              border: '1px solid #a78bfa',
              color: '#2e1065'
          }}
          />
        </div>
        <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3" onClick={handleSubmit}>
          Add
        </button>
      </form>
    </div>
  );
}
