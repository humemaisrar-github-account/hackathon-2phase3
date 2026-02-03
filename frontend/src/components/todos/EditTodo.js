import TodoForm from './TodoForm';

export default function EditTodo({ todo, onSave, onCancel }) {
  const handleSubmit = (formData) => {
    onSave(todo.id, formData);
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Editing: {todo.title}</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
      <div className="mt-4">
        <TodoForm
          initialData={todo}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}