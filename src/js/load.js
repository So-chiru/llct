const isIE = () => {
  return window.document.documentMode
}

window.addEventListener('DOMContentLoaded', () => {
  if (isIE()) {
    location.href = 'https://browser-update.org/update-browser.html'
  }

  if (typeof preInit !== 'undefined') preInit()
  if (typeof darkInit !== 'undefined') darkInit()
  if (typeof colorBlindInit !== 'undefined') colorBlindInit()
})

window.addEventListener('load', () => {
  if (typeof init !== 'undefined') init()
  if (typeof registerWorker !== 'undefined') registerWorker()

  let s = document.createElement('script')
  s.src = 'https://www.googletagmanager.com/gtag/js?id=UA-111995531-2'
  document.querySelector('head').appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'UA-111995531-2')
})
