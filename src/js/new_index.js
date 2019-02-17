const pagePlayerAnimation = (index, nextIndex, direction) => {
  yohanePlayer[nextIndex === 2 ? 'show' : 'hide']()
}

let yohanePlayer = {
  show: () => {
    $('.player').removeClass('hide')
    $('.player').addClass('show')
  },
  hide: () => {
    $('.player').removeClass('show')
    $('.player').addClass('hide')
  }
}
