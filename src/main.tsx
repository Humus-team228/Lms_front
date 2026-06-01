// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './app/providers/AuthProvider'
import { BrowserRouter } from 'react-router-dom' // <--- Добавляем сюда
import './app/styles/index.css'
import {AppQueryClientProvider} from "./app/providers/QueryClientProvider";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* 1. Сначала Роутер */}
        <BrowserRouter>
            <AppQueryClientProvider>
            {/* 2. Потом Провайдер авторизации (теперь useNavigate внутри него будет работать) */}
            <AuthProvider>
                <App />
            </AuthProvider>
            </AppQueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
)