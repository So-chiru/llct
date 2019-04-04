const cachingOffline = {
  version: 'deathwar_a0014',
  urls: [
    '/',
    '/index.html',
    '/yosoro.min.css',
    '/data/lists.json',
    '/js/lib/reverb.min.js',
    '/lib/jquery.min.js',
    '/lib/ps/photoswipe.min.js',
    '/lib/ps/photoswipe-ui-default.js',
    '/js/lib/hammer.min.js',
    '/js/global.min.js',
    '/js/playlists.min.js',
    '/js/index.min.js',
    '/js/karaoke.min.js',
    '/live_assets/crying_15.mp3',
    '/live_assets/key-press-2.mp3',
    '/live_assets/HamiltonMausoleum.m4a'
  ]
}

self.addEventListener('install', e => {
  self.skipWaiting()

  e.waitUntil(
    caches.open(cachingOffline.version).then(cache => {
      return cache.addAll(cachingOffline.urls)
    })
  )
})

let ndt_cache = url => {
  return (
    (/\/\/?(.+)(lovelivec\.kr|localhost)/.test(url) &&
      /fonts.(googleapis|gstatic).com/.test(url)) ||
    (url.indexOf('data/') !== -1 ||
      url.indexOf('.html') !== -1 ||
      url.indexOf('.ico') !== -1 ||
      url.indexOf('?pid=') !== -1)
  )
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(async chx => {
      return (
        chx ||
        fetch(e.request).then(async res => {
          if (!res || !ndt_cache(e.request.url)) {
            return res
          }

          var x = await caches.open(cachingOffline.version)
          x.put(e.request, res.clone())

          return res
        })
      )
    })
  )
})

self.addEventListener('activate', async e => {
  e.waitUntil(
    caches.keys().then(async cnObjects => {
      return Promise.all(
        cnObjects
          .filter(cn => {
            return cachingOffline.version !== cn
          })
          .map(cn => {
            return caches.delete(cn)
          })
      )
    })
  )
})

self.addEventListener('message', e => {
  if (e.data._cmd === 'sk_W') self.skipWaiting()
})

const clearCaches = async () => {
  caches.keys().then(async cnObjects => {
    return Promise.all(
      cnObjects
        .filter(cn => {
          true
        })
        .map(cn => {
          return caches.delete(cn)
        })
    )
  })
}
