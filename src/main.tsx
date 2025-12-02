// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Debug kecil supaya terlihat di console bahwa bundle tereksekusi
console.log('App starting', process.env.NODE_ENV);

const rootEl = document.getElementById('root');
if (!rootEl) {
  console.error('Root element not found: #root');
} else {
  const root = createRoot(rootEl);
  root.render(<App />);
}
