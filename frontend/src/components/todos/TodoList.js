import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete, onEdit }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No todos yet</p>
        <p className="text-gray-400 mt-2">Add your first todo using the form above</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Your Todos ({todos.length})</h3>
      </div>

      <div className="space-y-3">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}