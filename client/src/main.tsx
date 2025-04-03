import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

function fallbackRender({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-gray-900">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded border border-red-100 overflow-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {error.message}
          </pre>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallbackRender={fallbackRender}>
    <App />
  </ErrorBoundary>
);
