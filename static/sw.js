importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.3/workbox/workbox-sw.js')

// --------------------------------------------------
// Configure
// --------------------------------------------------

// Set workbox config
workbox.setConfig({
  "debug": false
})

// Start controlling any existing clients as soon as it activates
workbox.core.clientsClaim()

// Skip over the SW waiting lifecycle stage
workbox.core.skipWaiting()

workbox.precaching.cleanupOutdatedCaches()

// --------------------------------------------------
// Precaches
// --------------------------------------------------

// Precache assets

// --------------------------------------------------
// Runtime Caching
// --------------------------------------------------

// Register route handlers for runtimeCaching
workbox.routing.registerRoute(new RegExp('https://api-football-v3.herokuapp.com/api/v3/.*'), new workbox.strategies.NetworkFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('https://media.api-sports.io/football/.*'), new workbox.strategies.NetworkFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/_nuxt/'), new workbox.strategies.CacheFirst ({}), 'GET')
workbox.routing.registerRoute(new RegExp('/'), new workbox.strategies.NetworkFirst ({}), 'GET')
