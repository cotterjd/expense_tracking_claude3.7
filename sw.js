const CACHE_NAME = 'budget-tracker-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('Service worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache:', CACHE_NAME);
                console.log('Caching files:', urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('All files cached successfully');
                // Force the waiting service worker to become active
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache files:', error);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    console.log('Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // Try to fetch from network
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache non-successful responses
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response for caching
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch(() => {
                        console.log('Network failed, no cache available for:', event.request.url);
                        // Return a fallback response for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        // For other requests, just fail
                        throw new Error('No cache available');
                    });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service worker activated');
            // Claim all clients immediately
            return self.clients.claim();
        })
    );
});
