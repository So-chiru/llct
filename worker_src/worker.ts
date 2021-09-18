const sw = (self as unknown) as ServiceWorkerGlobalScope

import * as llctCache from './cache'

sw.addEventListener('install', ev => {
  sw.skipWaiting()

  ev.waitUntil(llctCache.addCaches(llctCache.STATIC_CACHE))
})

sw.addEventListener('activate', () => {
  llctCache.freshCaches()
})

sw.addEventListener('fetch', ev => {
  if (!('caches' in self)) {
    return ev
  }

  if (
    llctCache.DO_NOT_CACHE_URL.filter(v => ev.request.url.indexOf(v) > -1)
      .length
  ) {
    return ev
  }

  const url = new URL(ev.request.url)

  if (url.origin === process.env.API_SERVER) {
    const matches = llctCache.apiPathMatch(ev.request.url)

    if (matches) {
      return ev.respondWith(
        llctCache.cacheHandler(llctCache.DYNAMIC_CACHE, ev.request, matches)
      )
    }
  } else if (sw.registration.scope.indexOf(url.origin) === 0) {
    const matches = llctCache.extensionMatch(url.pathname)

    if (matches || url.pathname === '/') {
      return ev.respondWith(
        llctCache.cacheHandler(
          llctCache.STATIC_CACHE,
          ev.request,
          matches || {}
        )
      )
    }

    return ev
  }

  return ev
})
