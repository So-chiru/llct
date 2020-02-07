const isIE = () => {
  return window.document.documentMode
}

window.addEventListener('DOMContentLoaded', () => {
  if (isIE()) {
    location.href = 'https://browser-update.org/update-browser.html'
  }

  if (typeof darkInit !== 'undefined') darkInit()
})

window.addEventListener('load', () => {
  if (typeof init !== 'undefined') init()

  let load = document.querySelector('llct-wait')

  if (load) {
    load.classList.add('done')
  }
})
