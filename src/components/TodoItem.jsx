import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

export function TodoItem({ completed, id, title, toggleTodo, deleteTodo, editorMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    // Retrieve the auth token from cookies when the component mounts
    const token = Cookies.get('authToken');
    setAuthToken(token);
  }, []);

  const handleToggle = async () => {
    try {
      // Retrieve the authentication token from cookies
      const authToken = Cookies.get('authToken');
  
      // Send a PUT request to toggle the item status
      const response = await axios.put(`http://127.0.0.1:8005/items/${id}/toggle`, null, {
        headers: {
          Authorization: `Bearer ${authToken}` // Attach the token to the request headers
        }
      });
  
      // If the request is successful, update the todo item
      toggleTodo(id, !completed);
    } catch (error) {
      console.error('Error toggling todo status:', error.message);
    }
  };
  

  const handleEdit = async () => {
    try {
      // Make a PUT request to edit the todo item
      await axios.put(`http://localhost:8005/items/${id}`, { title: editedTitle }, {
        headers: {
          Authorization: `Bearer ${authToken}` // Attach the token to the request headers
        }
      });
      // Update the UI by calling the editTodo function
      editTodo(id, editedTitle);
      setIsEditing(false);
    } catch (error) {
      console.error('Error editing todo:', error.message);
    }
  };

  let todoContent;

  if (isEditing) {
    todoContent = (
      <>
        <input
          className="grow"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <button className="btn btn-edt" onClick={handleEdit} disabled={editedTitle.length === 0}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {title}
        {editorMode && ( 
          <button className="btn btn-edit flex-none" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
      </>
    );
  }


  return (
    <div className="mb-3 flex">
      <li>
        <label className="w-full">
          <input
            type="checkbox"
            checked={completed}
            onChange={handleToggle} // Call handleToggle when checkbox is clicked
          />
          <div className="w-full">
          <span className="ml-2">{todoContent}</span>
          </div>
        </label>
      </li>
      {editorMode && (
        <div>
          <button className="btn btn-danger flex-none" onClick={() => deleteTodo(id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
