import { useState } from 'react';
import TodoForm from './TodoForm';

export default function AddTodo({ onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await onAdd(formData);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + Add New Todo
        </button>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Todo</h3>
          <TodoForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}