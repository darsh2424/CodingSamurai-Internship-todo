import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    setTodos(savedTodos);
  }, []);

  const addTodo = (todo, dueDate) => {
    const newTodo = {
      text: todo,
      dueDate: dueDate,
      critical: false,
      status: 'p',
      index: todos.length > 0 ? todos[todos.length - 1].index + 1 : 1
    };
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const completeTodo = (index) => {
    const newTodos = todos.map((todo) =>
      todo.index === index ? { ...todo, status: 'c' } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((todo) => todo.index !== index);
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const updateTodo = (index) => {
    const todoToUpdate = todos.find(todo => todo.index === index);
    const updatedText = prompt('Update the task:', todoToUpdate.text);
    const updatedDueDate = prompt('Update the due date (YYYY-MM-DD):', todoToUpdate.dueDate);
    
    if (updatedText !== null && updatedText.trim() !== '') {
      const newTodos = todos.map((todo) =>
        todo.index === index ? { ...todo, text: updatedText, dueDate: updatedDueDate || todo.dueDate } : todo
      );
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  };

  const toggleCritical = (index) => {
    const newTodos = todos.map((todo) =>
      todo.index === index ? { ...todo, critical: !todo.critical } : todo
    );
    setTodos(newTodos);
    localStorage.setItem('todos', JSON.stringify(newTodos));
  };

  const moveTask = (index, direction) => {
    const currentIndex = todos.findIndex(todo => todo.index === index);
    const newTodos = [...todos];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < newTodos.length) {
      [newTodos[currentIndex], newTodos[targetIndex]] = [newTodos[targetIndex], newTodos[currentIndex]];
      setTodos(newTodos);
      localStorage.setItem('todos', JSON.stringify(newTodos));
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.style.background = !isDarkMode ? 'black' : 'white';
    document.body.style.color = !isDarkMode ? 'white' : 'black';
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (filter === 'pending') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
  });

  const filteredTodos = sortedTodos.filter(todo => todo.status === (filter === 'pending' ? 'p' : 'c'));

  return (
    <div className={`form-modal`}>
      <div className={`form-modal-content  ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
        <div className='container mt-2'>
          <div className='row'>
            <div className='w-75'>
              <h2>To-Do List</h2>
            </div>
              <div className="w-25 d-flex justify-content-end">
                <button onClick={toggleDarkMode} className='btn btn-outline-secondary'>
                  {isDarkMode ? <i className="fa-solid fa-sun fs-5 mx-5"></i> : <i className="fa-solid fa-moon fs-5 mx-5"></i>}
                </button>
              </div>
          </div>
          <hr />
          <TodoForm addTodo={addTodo} />
          <div className="btn-group d-flex justify-content-between mt-3 mb-3">
            <button className={`btn btn-${filter === 'pending' ? 'primary' : 'outline-primary'}`} onClick={() => setFilter('pending')}>Pending</button>
            <button className={`btn btn-${filter === 'completed' ? 'primary' : 'outline-primary'}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
          <TodoList
            todos={filteredTodos}
            completeTodo={completeTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            toggleCritical={toggleCritical}
            moveTask={moveTask}
            filter={filter}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

const TodoForm = ({ addTodo }) => {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(input, dueDate);
    setInput('');
    setDueDate('');
  };

  return (
    <form className='container' onSubmit={handleSubmit}>
      <div className='row'>

        <div className='col-md-5 mt-1'>
          <label className='form-label'>Add New Task: </label>
          <input
            type="text"
            value={input}
            className='form-control'
            onChange={(e) => setInput(e.target.value)}
            required
          />
        </div>
        <div className='col-md-5 mt-1'>
          <label className='form-label'>Task Due Date: </label>
          <input
            type="date"
            value={dueDate}
            className='form-control'
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className='col-md-2 mt-2 d-flex justify-content-end'>
          <button type="submit" className='btn btn-outline-success mt-2'>Add</button>
        </div>
      </div>
    </form>
  );
};

const TodoList = ({ todos, completeTodo, deleteTodo, updateTodo, toggleCritical, moveTask, filter, isDarkMode }) => (
  <div className="table-responsive mt-4">
    <table className={`table ${isDarkMode ? 'table-dark' : 'table-light'}`}>
      <thead>
        <tr>
          <th className='w-50'><h4>Task List</h4></th>
          <th></th>
        </tr>
      </thead>
      <tbody className="table-group-divider">
        {todos.map((todo, index) => (
          <tr key={todo.index} className={todo.critical ? 'table-danger' : ''} style={{ backgroundColor: `rgba(255, 0, 0, ${1 - (index / todos.length)})` }}>
            <td><p className='p-3'>{todo.text}</p><small>Due: {todo.dueDate}</small></td>
            <td>
              {filter === 'pending' && (
                <>
                  <button className='btn btn-success mx-2 mt-2' onClick={() => completeTodo(todo.index)}>Complete</button>
                  <button className='btn btn-info mx-2 mt-2' onClick={() => updateTodo(todo.index)}>Update</button>
                  <button className='btn btn-warning mx-2 mt-2' onClick={() => moveTask(todo.index, 'up')}><i className='fas fa-arrow-up'></i></button>
                  <button className='btn btn-warning mx-2 mt-2' onClick={() => moveTask(todo.index, 'down')}><i className='fas fa-arrow-down'></i></button>
                  <div className="form-check mt-2 mx-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={todo.critical}
                      onChange={() => toggleCritical(todo.index)}
                      id={`flexCheckCritical${index}`}
                    />
                    <label className="form-check-label" htmlFor={`flexCheckCritical${index}`}>
                      Mark Critical
                    </label>
                  </div>
                </>
              )}
              <button className='btn btn-danger mx-2 mt-2' onClick={() => deleteTodo(todo.index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Index;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);
