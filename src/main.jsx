import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import './translations/i18n.js';
import './styles/global.scss';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Suspense fallback={<div className="app-loader">EarthLens</div>}>
          <App />
          <ToastContainer position="bottom-right" theme="colored" newestOnTop />
        </Suspense>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
