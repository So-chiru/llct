const cachingOffline = {
  version: 'deathwar_a0018',
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

let is_gtag = ur => {
  return /(www\.)?(google\-analytics)\.com/.test(ur)
}

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
          if (
            !res ||
            res.status >= 400 ||
            res.type !== 'basic' ||
            is_gtag(e.request.url) ||
            !ndt_cache(e.request.url)
          ) {
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

var _md_fns = {
  sk_W: () => {
    self.skipWaiting()
  },

  _clrs: async () => {
    await clearCaches()

    window.postMessage({
      cmd_t: 'popup',
      data: {
        icon: 'offline_bolt',
        text: '저장된 캐시를 비웠습니다.'
      }
    })
  },

  default: () => {}
}

// d

self.addEventListener('message', e => {
  _md_fns[_md_fns[e.data._cmd] || 'default']()
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
