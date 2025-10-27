import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import cannon from 'cannon';
import './index.scss'

window.CANNON = cannon;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
