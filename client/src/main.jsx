import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import customFetch from './utils/customFetch.js'

import { ToastContainer } from 'react-toastify'

// top level async
// const data = await customFetch.get('/test')
// console.log(data)

// fetch('/api/v1/test')
//   .then((res) => res.json())
//   .then((data) => console.log(data))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-center" />
  </StrictMode>
)
