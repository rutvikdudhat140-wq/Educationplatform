import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const TOKEN_KEY = 'adminToken'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const PUBLIC_PATHS = ['/api/admin/login', '/api/admin/signup']

axios.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401 && !PUBLIC_PATHS.includes(error.config?.url)) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
