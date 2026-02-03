export default function ToggleCompletion({ todo, onToggle }) {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
        todo.is_completed
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {todo.is_completed ? (
        <>
          <span className="mr-1">✓</span> Completed
        </>
      ) : (
        <>
          <span className="mr-1">○</span> Mark Complete
        </>
      )}
    </button>
  );
}