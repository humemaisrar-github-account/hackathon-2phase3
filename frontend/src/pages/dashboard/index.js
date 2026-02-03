import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useAuth } from '../../services/auth';
import { todoAPI } from '../../services/api';

export default function Dashboard() {
  const { isAuthenticated: isAuth, currentUser: user, logout: signOut } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load todos when the component mounts
  useEffect(() => {
    if (isAuth) {
      loadTodos();
    }
  }, [isAuth]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await todoAPI.getAll();
      setTodos(response.data.todos);
    } catch (err) {
      setError('Failed to load todos: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const response = await todoAPI.create(newTodo);
      setTodos([response.data.todo, ...todos]);
      setNewTodo({ title: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to add todo: ' + (err.message || 'Unknown error'));
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const response = await todoAPI.toggleComplete(id);
      setTodos(todos.map(todo =>
        todo.id === id ? response.data.todo : todo
      ));
    } catch (err) {
      setError('Failed to update todo: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo: ' + (err.message || 'Unknown error'));
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Please sign in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - Todo Web Application</title>
      </Head>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Todo Dashboard</h1>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Todo</h2>
          <form onSubmit={handleAddTodo}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  rows="3"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
                  placeholder="Add details..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Todo
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Todos</h2>

          {loading ? (
            <p>Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="text-gray-500">No todos yet. Add one above!</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.is_completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
                    />
                    <div>
                      <h3 className={`text-lg ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`text-sm ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-500'}`}>
                          {todo.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}