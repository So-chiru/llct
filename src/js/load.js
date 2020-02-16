const isIE = () => {
  return window.document.documentMode
}

window.addEventListener('DOMContentLoaded', () => {
  if (isIE()) {
    location.href = 'https://browser-update.org/update-browser.html'
  }

  if (typeof darkInit !== 'undefined') darkInit()
  if (typeof colorBlindInit !== 'undefined') colorBlindInit()
  if (typeof registerWorker !== 'undefined') registerWorker()
})

window.addEventListener('load', () => {
  if (typeof init !== 'undefined') init()

  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'UA-111995531-2')
})
