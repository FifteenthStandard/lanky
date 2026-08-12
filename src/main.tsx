import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js', { scope: import.meta.env.BASE_URL });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
