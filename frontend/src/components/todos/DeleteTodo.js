export default function DeleteTodo({ todo, onConfirmDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onConfirmDelete(todo.id);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Delete
    </button>
  );
}