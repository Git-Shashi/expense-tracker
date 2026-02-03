export default function Card({ children, className = '', title, headerActions }) {
  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {(title || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            )}
            {headerActions && (
              <div className="flex items-center gap-3">{headerActions}</div>
            )}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}
