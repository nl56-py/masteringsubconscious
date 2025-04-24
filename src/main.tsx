
import { createRoot } from 'react-dom/client'
import React from 'react' // Make sure React is imported
import App from './App.tsx'
import './index.css'

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
