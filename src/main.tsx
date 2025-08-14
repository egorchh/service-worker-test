import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swUrl = new URL('service-worker.js', import.meta.env.BASE_URL).toString()
        navigator.serviceWorker
            .register(swUrl)
            .then(registration => {
                console.log('SW зарегистрирован', registration);

                // Логика обработки апдейтов
                registration.onupdatefound = () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.onstatechange = () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            // Тут можно показать баннер «Доступно обновление»
                            console.log('Новая версия доступна!');
                        }
                    };
                };
            })
            .catch(err => console.error('Ошибка регистрации SW:', err));
    });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
