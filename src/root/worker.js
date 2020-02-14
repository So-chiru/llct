self.addEventListener('install', ev => {
  console.log(ev)
})

self.addEventListener('fetch', ev => {
  console.log(ev)
})

self.addEventListener('activate', ev => {
  console.log(ev)
})

self.addEventListener('message', msg => {
  console.log(msg)
})
