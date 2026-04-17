// Add global polyfill at the very top
if (typeof global === 'undefined') {
    window.global = window;
}
if (typeof process === 'undefined') {
    window.process = { env: {} };
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);