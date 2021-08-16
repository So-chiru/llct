const sw = (self as unknown) as ServiceWorkerGlobalScope

export const STATIC_CACHE = '@llct/cache/static/v12'
export const DYNAMIC_CACHE = '@llct/cache/dynamic/v1'

type CacheStorageKey = typeof STATIC_CACHE | typeof DYNAMIC_CACHE

export const STATIC_CACHE_URL = [
  '/',
  '/manifest.json',
  '/sounds/tick.mp3',
  '/images/aqours.png',
  '/images/niji.png',
  '/images/us.png',
  '/images/logo/android-icon-36x36.png',
  '/images/logo/android-icon-48x48.png',
  '/images/logo/android-icon-72x72.png',
  '/images/logo/android-icon-96x96.png',
  '/images/logo/android-icon-144x144.png',
  '/images/logo/android-icon-192x192.png',
  '/images/logo/apple-icon-57x57.png',
  '/images/logo/apple-icon-60x60.png',
  '/images/logo/apple-icon-72x72.png',
  '/images/logo/apple-icon-76x76.png',
  '/images/logo/apple-icon-114x114.png',
  '/images/logo/apple-icon-120x120.png',
  '/images/logo/apple-icon-144x144.png',
  '/images/logo/apple-icon-152x152.png',
  '/images/logo/apple-icon-180x180.png',
  '/images/logo/apple-icon-precomposed.png',
  '/images/logo/apple-icon.png',
  '/images/logo/favicon-16x16.png',
  '/images/logo/favicon-32x32.png',
  '/images/logo/favicon-96x96.png',
  '/images/logo/favicon.ico',
  '/images/logo/Icon.svg',
  '/images/logo/ms-icon-70x70.png',
  '/images/logo/ms-icon-144x144.png',
  '/images/logo/ms-icon-150x150.png',
  '/images/logo/ms-icon-310x310.png'
]

export const DO_NOT_CACHE_URL = []

interface LLCTCacheOption {
  noCache?: boolean
  duration?: number
  revalidate?: boolean
}

const cachingExtensionsPath: [RegExp, LLCTCacheOption][] = [
  [/(\/images\/.+|\/sounds\/.+)/g, {}],
  [/\.(css|json)$/g, {}],
  [/.*\.js$/g, {}]
]

const cachingAPIPath: [RegExp, LLCTCacheOption][] = [
  [/\/cover\/[0-9]+(\?s=[0-9]+)?/g, {}],
  [
    /\/call\/[0-9]+/g,
    {
      revalidate: true
    }
  ],
  [
    /\/lists/g,
    {
      revalidate: true
    }
  ]
]

export const addCaches = (scope: CacheStorageKey) =>
  caches.open(scope).then(cache => cache.addAll(STATIC_CACHE_URL))

export const clearCaches = (scope: CacheStorageKey) =>
  caches
    .open(scope)
    .then(async cache => (await cache.keys()).map(v => cache.delete(v)))

export const extensionMatch = (url: string) => {
  for (const v of cachingExtensionsPath) {
    if (new RegExp(v[0], 'g').test(url)) {
      return v[1]
    }
  }

  return null
}

export const apiPathMatch = (url: string) => {
  for (const v of cachingAPIPath) {
    if (new RegExp(v[0], 'g').test(url)) {
      return v[1]
    }
  }

  return null
}

export const cacheHandler = async (
  scope: CacheStorageKey,
  req: Request,
  cacheOption: LLCTCacheOption
) => {
  const storage = await caches.open(scope)

  if (!cacheOption.noCache && (!navigator.onLine || !cacheOption.revalidate)) {
    let localReq = req

    if (
      sw.registration.scope.indexOf(new URL(req.url).origin) === 0 &&
      req.url.indexOf('/?id=') > -1
    ) {
      localReq = new Request('/')
    }

    const exists = await storage.match(localReq)

    if (exists) {
      return exists
    }
  }

  try {
    const data = await fetch(req, {
      mode: 'cors',
      credentials: 'same-origin'
    })

    if (data.status > 400) {
      throw new Error(
        JSON.stringify({ code: data.status, text: await data.text() })
      )
    }

    if (data.status >= 200 && data.status < 300) {
      storage.put(req, data.clone())
    }

    return data
  } catch (e) {
    if (typeof e.message === 'string') {
      const parsed = JSON.parse(e.message)

      if (!parsed.code) {
        return new Response(e, {
          status: 404
        })
      }

      return new Response(parsed.text, {
        status: parsed.code
      })
    }

    return new Response(e, {
      status: 500,
      statusText: e.message
    })
  }
}
