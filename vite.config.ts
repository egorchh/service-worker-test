import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';

const gitHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            // регистрируем SW автоматически, но обновление — по кнопке
            registerType: 'prompt',               // ключевое: «ждёт» вашего подтверждения
            injectRegister: 'auto',
            includeAssets: ['favicon.svg', 'robots.txt'],
            manifest: {
                name: 'Your App',
                short_name: 'App',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#000000',
                icons: [
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
                ]
            },
            workbox: {
                cleanupOutdatedCaches: true,
                // Главное: HTML из сети, ассеты с хэшем — из кеша
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/api\//],
                runtimeCaching: [
                    // HTML — NetworkFirst, чтобы ловить новый билд оболочки
                    {
                        urlPattern: ({ request }) => request.mode === 'navigate',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'html',
                            networkTimeoutSeconds: 3
                        }
                    },
                    // JS/CSS (у Vite имена уже с хэшем) — CacheFirst
                    {
                        urlPattern: ({ request }) =>
                            request.destination === 'script' || request.destination === 'style',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'assets',
                            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 }
                        }
                    },
                    // Шрифты/картинки — CacheFirst
                    {
                        urlPattern: ({ request }) =>
                            request.destination === 'font' || request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'media',
                            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 }
                        }
                    },
                    // API — подберите стратегию под себя; часто SWR
                    {
                        urlPattern: /\/api\//,
                        handler: 'StaleWhileRevalidate',
                        options: { cacheName: 'api' }
                    },
                    // /version.json — всегда из сети
                    {
                        urlPattern: /\/version\.json$/,
                        handler: 'NetworkOnly'
                    }
                ]
            }
        })
    ],
    define: {
        __APP_VERSION__: JSON.stringify(process.env.APP_VERSION || gitHash)
    },
    build: {
        // у Vite по умолчанию файлы с content-hash — это ок
        sourcemap: false
    },
    base: '/service-worker-test/' // если приложение не в корне — укажите правильный base
});
