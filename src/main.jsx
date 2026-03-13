import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

function getStoredTheme() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function getInitialDarkMode(theme) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return theme === 'dark';
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return theme === 'dark' || ((theme === 'system' || !theme) && prefersDark);
}

const storedTheme = getStoredTheme();
const initialDark =
  getInitialDarkMode(storedTheme);

document.documentElement.classList.toggle('dark', initialDark);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
