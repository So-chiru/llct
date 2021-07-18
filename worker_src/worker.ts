const sw = (self as unknown) as ServiceWorkerGlobalScope

const LLCT_STATIC_CACHE = '@llct/cache/static/v1'
const LLCT_DYNAMIC_CACHE = '@llct/cache/dynamic/v1'

type CacheStorageKey = typeof LLCT_STATIC_CACHE | typeof LLCT_DYNAMIC_CACHE

const STATIC_CACHE_URL = ['/', '/images/logo/Icon.svg']

const DO_NOT_CACHE_URL = ['vendors-_yarn']

interface LLCTCacheOption {
  duration?: number
}

const cachingExtensions: { [index: string]: LLCTCacheOption } = {
  '.css': {},
  '.js': {}
}

const addCaches = (scope: CacheStorageKey) =>
  caches.open(scope).then(cache => cache.addAll(STATIC_CACHE_URL))

const clearCaches = (scope: CacheStorageKey) =>
  caches
    .open(scope)
    .then(async cache => (await cache.keys()).map(v => cache.delete(v)))

const extensionMatch = (url: string) =>
  cachingExtensions[
    Object.keys(cachingExtensions).filter(v => url.endsWith(v))[0]
  ]

const cacheHandler = async (req: Request) => {
  const storage = await caches.open(LLCT_STATIC_CACHE)

  const exists = await storage.match(req)

  if (exists) {
    return exists
  }

  const data = await fetch(req)

  storage.put(req, data.clone())

  return data
}

sw.addEventListener('install', ev => {
  sw.skipWaiting()

  clearCaches(LLCT_STATIC_CACHE)
  clearCaches(LLCT_DYNAMIC_CACHE)

  ev.waitUntil(addCaches(LLCT_STATIC_CACHE))
})

sw.addEventListener('activate', ev => {
  console.log(ev)
})

sw.addEventListener('fetch', ev => {
  if (DO_NOT_CACHE_URL.filter(v => ev.request.url.indexOf(v) > -1).length) {
    return ev
  }

  const url = new URL(ev.request.url)

  // const globalCache = await LLCTCache

  // const matchResponse = await globalCache.match(ev.request)
  // if (matchResponse) {
  //   console.log('match', matchResponse)

  //   return ev.respondWith(matchResponse.clone())
  // }

  if (url.origin === process.env.API_SERVER) {
    // console.log('request from Api server', ev)

    return ev
  } else if (sw.registration.scope.indexOf(url.origin) === 0) {
    const matches = extensionMatch(url.pathname)

    if (matches) {
      return ev.respondWith(cacheHandler(ev.request))
    }

    return ev
  }

  return ev
})
