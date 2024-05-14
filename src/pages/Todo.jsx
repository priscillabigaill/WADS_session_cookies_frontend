import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { Link } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editorMode, setEditorMode] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const authToken = Cookies.get('authToken'); // Get authToken cookie
        if (authToken) {
          const response = await axios.get(`http://localhost:8005/users/${authToken}/items`);
          console.log('Received response:', response.data);
          setTodos(response.data);
        }
      } catch (error) {
        console.error('Error fetching todos:', error.message);
      }
    };

    fetchTodos();
  }, []);

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };

  async function addTodo(title) {
    try {
      console.log('Sending request to add todo:', title);
      const response = await axios.post(`http://127.0.0.1:8005/items/`, { title });
      console.log('Received response:', response.data);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error.message);
    }
  }

  async function editTodo(id, title) {
    try {
      await axios.put(`http://127.0.0.1:8005/${id}`, { title });
      const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, title } : todo);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error.message);
    }
  }

  async function toggleTodo(id, completed) {
    try {
      await axios.put(`http://127.0.0.1:8005/${id}`, { completed });
      const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, completed } : todo);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling todo status:', error.message);
    }
  }

  async function deleteTodo(id) {
    try {
      await axios.delete(`http://127.0.0.1:8005/${id}`);
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error.message);
    }
  }

  function FilterButton(props) {
    return (
      <button
        type="button"
        className={`btn toggle-btn ${props.isPressed ? 'bg-violet-900 text-white' : 'bg-violet-200 text-black'} mx-2 my-1 mt-3`}
        aria-pressed={props.isPressed}
        onClick={() => props.setFilter(props.name)}>
        <span className="visually-hidden">Show </span>
        <span>{props.name}</span>
        <span className="visually-hidden"> tasks</span>
      </button>
    );
  }

  return (
    <>
      <div className="bg-white p-5 rounded-lg w-full mt-3">
        <TodoForm addTodo={addTodo} />
      </div>
      <div className="bg-white p-5 rounded-lg w-full mt-7">
        {Object.keys(FILTER_MAP).map((name) => (
          <FilterButton
            key={name}
            name={name}
            isPressed={name === filter}
            setFilter={setFilter}
          />
        ))}
        <div className="bg-white border border-violet-900 p-5 rounded-lg mt-7">
          <TodoList
            todos={todos.filter(FILTER_MAP[filter])}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            editorMode={editorMode}
          />
        </div>
      </div>
      <button
        className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3 mb-3 mr-3"
        onClick={() => setEditorMode(!editorMode)}
      >
        {editorMode ? "Exit Editor" : "Editor"}
      </button>
      <Link to="/">
        <button className="bg-yellow-300 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 border-b-4 border-yellow-500 hover:border-yellow-500 rounded mt-3">
          Back
        </button>
      </Link>
    </>
  );
}

export default Todo;
