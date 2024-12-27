import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { handleGoogleCallback } from './components/loader';


const clientId = '303729315971-09bic4sesir7a73i3013cj0tbvk98kl0.apps.googleusercontent.com';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/google/callback',
    loader: handleGoogleCallback,
    element: <div>Loading...</div>,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>  {/* Wrap the App with GoogleOAuthProvider */}
      
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>

);