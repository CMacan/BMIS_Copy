export default function GhostButton({ className = '', disabled, children, ...props }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-700 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 ${
        disabled && 'opacity-50 cursor-not-allowed'
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}