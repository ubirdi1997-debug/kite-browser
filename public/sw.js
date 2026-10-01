// Kite Browser Service Worker for PWA & Android WebAPK Installation
const CACHE_NAME = 'kite-browser-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle dynamic requests
});
