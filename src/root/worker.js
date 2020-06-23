const CACHE = 'llct-cache-v20200623-1946'
const DYNAMIC_CACHE = 'llct-cache-dynamic-v20200620-1623'
const CACHE_DURATION = 6 * 3600
const CACHE_URL = [
  '/',
  '/?utm_source=pwa',
  '/assets/aqours.png',
  '/assets/niji.png',
  '/assets/us.png',
  '/assets/tick.mp3',
  '/assets/llct-effects-1.mp3',
  '/assets/logo/logo-192.png',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js',
  'https://cdn.jsdelivr.net/npm/hammerjs@2.0.8/hammer.min.js',
  'https://cdn.jsdelivr.net/npm/vue-lazyload@1.3.3/vue-lazyload.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.8.7/polyfill.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js',
  'https://fonts.googleapis.com/css?family=Material+Icons|Noto+Sans+KR:100,300,400,500,700&display=swap',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  '/mikan.min.css',
  '/mikan.min.js',
  '/manifest.json'
]

const tempData = url => {
  return (
    url.indexOf('/lists') > -1 ||
    url.indexOf('/playlists') > -1 ||
    url.indexOf('/recommend') > -1 ||
    url.indexOf('/call') > -1
  )
}

const filter = url => {
  let u = new URL(url)

  if (u.pathname == '/' || u.pathname == '/index.html') {
    u.search = ''
    u.fragment = ''
  }

  return url
}

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches
      .open(CACHE)
      .then(c => {
        return c.addAll(CACHE_URL)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('fetch', ev => {
  if (
    ev.request.url.indexOf('googletag') > -1 ||
    ev.request.url.indexOf('analytics') > -1
  ) {
    return ev
  }

  if (ev.request.url.indexOf('/audio/') > -1) {
    return ev
  }

  ev.request.url = filter(ev.request.url)

  let cacheMatch = caches.match(ev.request).then(res => {
    if (res) {
      const expire = Date.parse(res.headers.get('llct-expires'))

      if (tempData(ev.request.url) && !navigator.onLine) {
        return res
      }

      if (
        !tempData(ev.request.url) &&
        (expire > new Date() || !expire || !navigator.onLine)
      ) {
        return res
      }
    }

    return fetch(ev.request)
      .then(res => {
        if (!res) {
          return res
        }

        const expires = new Date()
        expires.setSeconds(expires.getSeconds() + CACHE_DURATION)

        const cacheResCreated = {
          status: res.status,
          statusText: res.statusText,
          origin: ev.origin,
          headers: { 'llct-expires': expires.toUTCString() }
        }

        res.headers.forEach((v, k) => {
          cacheResCreated.headers[k] = v
        })

        const finalResponse = res.clone()
        return res.blob().then(body => {
          caches.open(DYNAMIC_CACHE).then(cache => {
            if (cacheResCreated.status == 0) {
              return false
            }

            cache.put(ev.request, new Response(body, cacheResCreated))
          })

          return finalResponse
        })
      })
      .catch(e => {
        return new Response(null, {
          status: navigator.onLine ? 404 : 550,
          statusText: navigator.onLine ? e.message : 'Offline'
        })
      })
  })

  ev.respondWith(cacheMatch)
})

self.addEventListener('activate', ev => {
  let definedCaches = [CACHE, DYNAMIC_CACHE]

  ev.waitUntil(
    caches.keys().then(cacheNs => {
      return Promise.all(
        cacheNs.map(cac => {
          if (definedCaches.indexOf(cac) === -1) {
            return caches.delete(cac)
          }
        })
      )
    })
  )

  self.clients.matchAll().then(clients => {
    clients.forEach(cli =>
      cli.postMessage({
        cmd: 0x01,
        msg: null
      })
    )
  })

  return self.clients.claim()
})

self.addEventListener('message', msg => {
  //console.log(msg)
})
