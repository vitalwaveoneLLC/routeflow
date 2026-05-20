import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import OrderPortal from './OrderPortal.jsx'

const isOrder = window.location.pathname.startsWith('/order')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isOrder ? <OrderPortal /> : <App />}
  </React.StrictMode>
)

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.warn('[SW] Registration failed:', err));
  });
}