import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker-test/service-worker.js')
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
                            newWorker.postMessage({ action: 'skipWaiting' });
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
