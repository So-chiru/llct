const cachingOffline = {
  version: 'deathwar_a0021_b',
  urls: [
    '/',
    '/manifest.json',
    '/live_assets/crying_15.mp3',
    '/?pid=',
    '/index.html',
    '/yosoro.min.css',
    '/data/lists.json',
    '/js/lib/reverb.min.js',
    '/lib/jquery.min.js',
    '/lib/ps/photoswipe.min.js',
    '/lib/ps/photoswipe.css',
    '/lib/ps/photoswipe-ui-default.min.js',
    '/lib/ps/default-skin/default-skin.css',
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
  e.waitUntil(
    (() => {
      caches.open(cachingOffline.version).then(cache => {
        return cache.addAll(cachingOffline.urls)
      })
      self.skipWaiting()
    })()
  )
})

let ndt_cache = url => {
  return (
    (/\/\/?(.+)(lovelivec\.kr|localhost|127\.0\.0\.1)/.test(url) ||
      /fonts.(googleapis|gstatic).com/.test(url)) &&
    /data\//.test(url)
  )
}

self.addEventListener('fetch', e => {
  var reqCacFet = /\/\/cdn\.lovelivec\.kr\/data\//g.test(e.request.url)
    ? new Request(e.request.url.replace(/cdn\./g, ''))
    : e.request

  reqCacFet = /lovelivec\.kr\/\?(.+)/.test(reqCacFet.url)
    ? new Request(reqCacFet.url.replace(/\?(.+)/g, ''))
    : reqCacFet

  e.respondWith(
    caches.match(reqCacFet).then(async chx => {
      return (
        chx ||
        fetch(e.request).then(async res => {
          if (!res || res.status >= 400 || !ndt_cache(e.request.url)) {
            return res
          }

          var x = await caches.open(cachingOffline.version)
          x.put(reqCacFet, res.clone())

          return res
        })
      )
    })
  )
})

self.addEventListener('activate', async e => {
  e.waitUntil(
    (() => {
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
      clients.claim()
    })()
  )
})

var sendMsgtoClient = async obj => {
  await self.clients.matchAll().then(cs => {
    cs.forEach(c => c.postMessage(JSON.parse(JSON.stringify(obj))))
  })
}

var _md_fns = {
  sk_W: () => {
    self.skipWaiting()
  },

  _clrs: async () => {
    await clearCaches()

    sendMsgtoClient({
      cmd_t: 'popup',
      data: {
        icon: 'offline_bolt',
        text: '저장된 캐시를 비웠습니다.'
      }
    })
  },

  default: () => {}
}

self.addEventListener('message', e => {
  _md_fns[_md_fns[e.data.cmd] ? e.data.cmd : 'default']()
})

const clearCaches = async () => {
  caches.open(cachingOffline.version).then(cache => {
    return cache.addAll(cachingOffline.urls)
  })

  caches.keys().then(async cnObjects => {
    cnObjects.forEach(async v => {
      await caches.open(v).then(async cache => {
        var _keys = await cache.keys()
        _keys.forEach(_k => {
          return cache.delete(_k)
        })
      })
    })
  })
}
