export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="ts-card relative w-full max-w-md">
        <button
          type="button"
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {title && (
          <h2 className="mb-4 pr-8 text-xl font-bold text-ts-text dark:text-white">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
