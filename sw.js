const CACHE_NAME = 'zante-app-v1';

// Inserisci qui tutti i file locali e gli asset usati
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './palumbo-removebg-preview.png',
  './Soggetto.png',
  './made-in-italy.png',
  './banana-beach-1.jpg',
  './banana-beach-2.webp',
  './st-nicholas-1.jpeg',
  './st-nicholas-2.jpeg',
  './st-nicholas-chiesa.jpeg',
  './keri-lighthouse.jpg',
  './elegant-party.jpg',
  './cameo-island.jpg',
  './porto-zoro-1.jpeg',
  './porto-zoro-2.webp',
  './porto-zoro-3.jpg',
  './aura-club.jpg',
  './escursione-mizithres-1.png',
  './escursione-mizithres-2.webp',
  './escursione-mizithres-3.webp',
  './mizithres-tramonto.jpg',
  './zante-town-night.jpg',
  './navagio-viewpoint.webp',
  './porto-roxa-1.jpg',
  './porto-roxa-2.jpg',
  './porto-limionas.avif',
  './cena-souvlaki.jpeg',
  './makris-gialos.jpg',
  './xigia-pelegaki-1.jpg',
  './xigia-sulfur-1.jpg',
  './white-party.jpg'
];

// Sostituisci il blocco install in sw.js con questo:
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Prova a mettere in cache ogni asset singolarmente
      for (const asset of ASSETS_TO_CACHE) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`Impossibile memorizzare nella cache l'asset: ${asset}`, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// Attivazione: elimina vecchie cache se aggiorni la versione
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: risponde dalla cache, altrimenti tenta la rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Fallback in caso di assenza totale di rete
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});