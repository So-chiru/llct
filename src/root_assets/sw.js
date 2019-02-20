const cachingOffline = {
  version: 'desuwa_a0001',
  urls: [
    '/',
    '/index.html',
    '/yosoro.min.css',
    '/js/lib/reverb.min.js',
    '/js/lib/jquery.pagepiling.min.js',
    '/js/global.min.js',
    '/js/new_index.min.js',
    '/js/karaoke.min.js',
    '/js/lib/chillout.min.js',
    '/dome_SportsCentreUniversityOfYork.m4a',
    '/small_TyndallBruceMonument.m4a'
  ]
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cachingOffline.version).then(cache => {
      return cache.addAll(cachingOffline.urls)
    })
  )
})

let checkNeedCaching = url => {
  if (url.indexOf('data/') !== -1) return true
  if (url.indexOf('.html') !== -1) return true

  return false
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      return (
        r ||
        fetch(e.request).then(fRq => {
          if (!checkNeedCaching(e.request.url)) return fRq

          return caches.open(cachingOffline.version).then(cache => {
            cache.put(e.request, fRq.clone())
            return fRq
          })
        })
      )
    })
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cnObjects => {
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

const clearCaches = () => {
  caches.keys().then(cnObjects => {
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
