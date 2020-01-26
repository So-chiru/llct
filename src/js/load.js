window.addEventListener('load', () => {
  if (typeof init !== 'undefined') init()

  let load = document.querySelector('llct-wait')

  if (load) {
    load.classList.add('done')
  }
})
