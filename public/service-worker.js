/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./worker_src/cache.ts":
/*!*****************************!*\
  !*** ./worker_src/cache.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cacheHandler = exports.apiPathMatch = exports.extensionMatch = exports.clearCaches = exports.addCaches = exports.DO_NOT_CACHE_URL = exports.STATIC_CACHE_URL = exports.DYNAMIC_CACHE = exports.STATIC_CACHE = void 0;
const sw = self;
exports.STATIC_CACHE = '@llct/cache/static/v1';
exports.DYNAMIC_CACHE = '@llct/cache/dynamic/v1';
exports.STATIC_CACHE_URL = [
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
];
exports.DO_NOT_CACHE_URL = [];
const cachingExtensionsPath = [
    [/(\/images\/.+|\/sounds\/.+)/g, {}],
    [/\.(css|json)$/g, {}],
    [/.*\.js$/g, {}]
];
const cachingAPIPath = [
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
];
const addCaches = (scope) => caches.open(scope).then(cache => cache.addAll(exports.STATIC_CACHE_URL));
exports.addCaches = addCaches;
const clearCaches = (scope) => caches
    .open(scope)
    .then(async (cache) => (await cache.keys()).map(v => cache.delete(v)));
exports.clearCaches = clearCaches;
const extensionMatch = (url) => {
    for (const v of cachingExtensionsPath) {
        if (new RegExp(v[0], 'g').test(url)) {
            return v[1];
        }
    }
    return null;
};
exports.extensionMatch = extensionMatch;
const apiPathMatch = (url) => {
    for (const v of cachingAPIPath) {
        if (new RegExp(v[0], 'g').test(url)) {
            return v[1];
        }
    }
    return null;
};
exports.apiPathMatch = apiPathMatch;
const cacheHandler = async (scope, req, cacheOption) => {
    const storage = await caches.open(scope);
    if (!cacheOption.noCache && (!navigator.onLine || !cacheOption.revalidate)) {
        let localReq = req;
        if (sw.registration.scope.indexOf(new URL(req.url).origin) === 0 &&
            req.url.indexOf('/?id=') > -1) {
            localReq = new Request('/');
        }
        const exists = await storage.match(localReq);
        if (exists) {
            return exists;
        }
    }
    try {
        const data = await fetch(req, {
            mode: 'cors',
            credentials: 'same-origin'
        });
        if (data.status > 400) {
            throw new Error(JSON.stringify({ code: data.status, text: await data.text() }));
        }
        if (data.status >= 200 && data.status < 300) {
            storage.put(req, data.clone());
        }
        return data;
    }
    catch (e) {
        if (typeof e === 'string') {
            const parsed = JSON.parse(e);
            if (!parsed.code) {
                return new Response(e);
            }
            return new Response(parsed.text, {
                status: parsed.code
            });
        }
        return new Response(e);
    }
};
exports.cacheHandler = cacheHandler;


/***/ }),

/***/ "./worker_src/worker.ts":
/*!******************************!*\
  !*** ./worker_src/worker.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const sw = self;
const llctCache = __importStar(__webpack_require__(/*! ./cache */ "./worker_src/cache.ts"));
sw.addEventListener('install', ev => {
    sw.skipWaiting();
    llctCache.clearCaches(llctCache.STATIC_CACHE);
    llctCache.clearCaches(llctCache.DYNAMIC_CACHE);
    ev.waitUntil(llctCache.addCaches(llctCache.STATIC_CACHE));
});
sw.addEventListener('activate', () => { });
sw.addEventListener('fetch', ev => {
    if (!('caches' in self)) {
        return ev;
    }
    if (llctCache.DO_NOT_CACHE_URL.filter(v => ev.request.url.indexOf(v) > -1)
        .length) {
        return ev;
    }
    const url = new URL(ev.request.url);
    if (url.origin === "https://api-local.lovelivec.kr") {
        const matches = llctCache.apiPathMatch(ev.request.url);
        if (matches) {
            return ev.respondWith(llctCache.cacheHandler(llctCache.DYNAMIC_CACHE, ev.request, matches));
        }
    }
    else if (sw.registration.scope.indexOf(url.origin) === 0) {
        const matches = llctCache.extensionMatch(url.pathname);
        if (matches || url.pathname === '/') {
            return ev.respondWith(llctCache.cacheHandler(llctCache.STATIC_CACHE, ev.request, matches || {}));
        }
        return ev;
    }
    return ev;
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./worker_src/worker.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=service-worker.js.map