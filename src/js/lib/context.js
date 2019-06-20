var __kara_d_d_rg = /kara_(\d+)_(\d+)/g
let HugContext = class {
  constructor (element) {
    this.__obj_curPointer = null
    this.__target = null
    this.__action_lists = {}
    this.__register_fn(element)
  }

  get target () {
    return this.__target
  }

  get targetX () {
    return this.__target ? Number(this.__target[0]) : null
  }

  get targetY () {
    return this.__target ? Number(this.__target[1]) : null
  }

  openContext = _ev => {
    var t_id = _ev.target.id

    if (__kara_d_d_rg.test(t_id)) {
      this.__target = t_id.split('_').splice(-2)
      document.getElementById('__context_bg').style.display = 'block'
      document.getElementById('__context_frame').style.display = 'block'
      document.getElementById('__context_frame').style.top =
        _ev.clientY -
        2 +
        (_ev.clientY -
          2 +
          document.getElementById('__context_frame').clientHeight >
        window.innerHeight
          ? -1 * document.getElementById('__context_frame').clientHeight
          : 0) +
        'px'
      document.getElementById('__context_frame').style[
        _ev.pageX + 110 > window.innerWidth ? 'right' : 'left'
      ] = (_ev.pageX + 110 > window.innerWidth ? '5px' : _ev.clientX + 5) + 'px'

      document.getElementById('kara_liner').innerHTML = this.targetX
      document.getElementById('kara_number').innerHTML = this.targetY

      return _ev.preventDefault()
    }
  }
  closeContext = () => {
    document.getElementById('__context_frame').style.display = 'none'
    document.getElementById('__context_bg').style.display = 'none'
  }

  __register_fn = parent => {
    this.__obj_curPointer = Sakurauchi.listen(
      'contextmenu',
      e => {
        this.openContext(e)
      },
      parent
    )
  }
  destroy = parent => {
    Sakurauchi.delisten('contextmenu', this.__obj_curPointer, parent)
  }
  addItem = () => {}
  removeItem = () => {}
  addAction = (ev, fns) => {
    if (!this.__action_lists[ev]) {
      this.__action_lists[ev] = []
    }

    this.__action_lists[ev].push(fns)
  }
  __runAction = (ev, args) => {
    if (typeof this.__action_lists[ev] === 'undefined') return 0
    this.__action_lists[ev].forEach(fns => {
      fns(args)
    })
  }
  act = (ev, args) => {
    this.__runAction(ev, args)
    this.closeContext()
  }
}
