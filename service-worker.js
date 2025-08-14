const VERSION = 'v16'

self.addEventListener('install', event => {
    self.skipWaiting(); // пропускаем стадию "waiting"
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // новый SW сразу управляет всеми вкладками
});

self.addEventListener('message', event => {
    if (event.data?.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
