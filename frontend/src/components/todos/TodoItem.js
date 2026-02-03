import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || '',
    is_completed: todo.is_completed
  });

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveEdit = () => {
    onEdit(todo.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: todo.title,
      description: todo.description || '',
      is_completed: todo.is_completed
    });
    setIsEditing(false);
  };

  return (
    <div className={`p-4 border rounded-lg shadow-sm mb-3 ${todo.is_completed ? 'bg-gray-50' : 'bg-white'}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows="2"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_completed"
              checked={editData.is_completed}
              onChange={handleEditChange}
              className="mr-2"
            />
            <span>Mark as completed</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={todo.is_completed}
                onChange={() => onToggle(todo.id)}
                className="mt-1 mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div>
                <h3 className={`text-lg ${todo.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-600'} mt-1`}>
                    {todo.description}
                  </p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Created: {new Date(todo.created_at).toLocaleString()} |
                  Updated: {new Date(todo.updated_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}