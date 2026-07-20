// 音声メモ → マトリクス / Service Worker
// 役割：オフラインでも画面が開くようにシェルをキャッシュするだけ。
// リマインドの発火はページ側（index.html）が担当する。アプリを閉じている間の
// 予約通知はiOSで信頼できないため、Service Worker では扱わない。
const CACHE = 'vmm-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ネット優先・失敗したらキャッシュ（更新が反映されない事故を防ぐ）
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
