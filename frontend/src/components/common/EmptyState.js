export default function EmptyState({ title, subtitle, icon, actionButton }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
        {icon || (
          <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title || 'No items found'}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {subtitle || 'Get started by creating a new item.'}
      </p>
      {actionButton && (
        <div className="mt-6">
          {actionButton}
        </div>
      )}
    </div>
  );
}