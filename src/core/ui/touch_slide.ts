import eventBus from '../eventbus'

export const enum TouchDirection {
  Horizontal,
  Vertical
}

interface TouchSliderOptions {
  /**
   * 얼만큼 넘기면 콜백 동작이 수행할 지를 결정합니다.
   */
  threshold?: number
  applyTo?: string
  direction?: TouchDirection
}

interface TouchSliderEvents {
  start: () => void
  move: (px: number, threshold: number) => void
  end: (thresholdOver: boolean) => void
  destroy: () => void
}

export default class TouchSlider {
  elem: HTMLElement
  options: TouchSliderOptions
  threshold: number
  direction: number
  events: eventBus<TouchSliderEvents>

  touchStarted: number
  touchLast: number
  mouseStarted: number
  mouseLast: number

  constructor (elem: HTMLElement, options?: TouchSliderOptions) {
    this.elem = elem

    this.options = options || {}

    this.threshold = (options && options.threshold) || 0
    if (this.threshold === 0) {
      this.updateThreshold()
    }

    this.direction =
      this.options && this.options.direction === TouchDirection.Horizontal
        ? TouchDirection.Horizontal
        : TouchDirection.Vertical

    this.events = new eventBus()

    this.addTouchHandler()
    this.addMouseHandler()

    this.addGlobalEventListener()

    this.touchStarted = -1
    this.touchLast = -1
    this.mouseStarted = -1
    this.mouseLast = -1
  }

  resizeHandler () {
    requestAnimationFrame(() => {
      this.updateThreshold()
    })
  }

  addGlobalEventListener () {
    window.addEventListener('resize', this.resizeHandler.bind(this))
  }

  updateThreshold () {
    let screenSize = window.innerHeight

    if (this.direction === TouchDirection.Horizontal) {
      screenSize = window.innerWidth
    }

    this.threshold = this.options.threshold || screenSize / 6
  }

  addTouchHandler () {
    const boundedHandler = this.touchHandler.bind(this)
    this.elem.addEventListener('touchstart', boundedHandler)

    this.events.on('destroy', () => {
      this.elem.removeEventListener('touchstart', boundedHandler)
    })
  }

  addMouseHandler () {
    const boundedHandler = this.mouseHandler.bind(this)
    this.elem.addEventListener('mousedown', boundedHandler)

    this.events.on('destroy', () => {
      this.elem.removeEventListener('mousedown', boundedHandler)
    })
  }

  touchHandler (ev: TouchEvent) {
    if (ev.type !== 'touchstart') {
      return
    }

    this.touchStarted =
      ev.touches[0][
        this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX'
      ]

    this.events.runAll('start')

    const boundedHandler = this.globalTouchHandler.bind(this)
    window.addEventListener('touchmove', boundedHandler)
    window.addEventListener('touchend', boundedHandler)

    this.events.on('end', () => {
      window.removeEventListener('touchmove', boundedHandler)
      window.removeEventListener('touchend', boundedHandler)
    })
  }

  globalTouchHandler (ev: TouchEvent) {
    if (ev.type === 'touchmove' && this.touchStarted !== -1) {
      this.touchLast =
        ev.touches[0][
          this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX'
        ] - this.touchStarted

      this.events.runAll('move', this.touchLast, this.threshold)
    } else if (ev.type === 'touchend' || ev.type === 'touchcancel') {
      this.touchStarted = -1
      this.events.runAll('end', this.touchLast > this.threshold)
      this.touchLast = 0
    }
  }

  mouseHandler (ev: MouseEvent) {
    if (ev.type !== 'mousedown') {
      return
    }

    this.mouseStarted =
      ev[this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX']

    this.events.runAll('start')

    const boundedHandler = this.globalMouseHandler.bind(this)
    window.addEventListener('mousemove', boundedHandler)
    window.addEventListener('mouseup', boundedHandler)

    this.events.on('end', () => {
      window.removeEventListener('mousemove', boundedHandler)
      window.removeEventListener('mouseup', boundedHandler)
    })
  }

  globalMouseHandler (ev: MouseEvent) {
    if (ev.type === 'mousemove' && this.mouseStarted !== -1) {
      this.mouseLast =
        ev[this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX'] -
        this.mouseStarted
      this.events.runAll('move', this.mouseLast, this.threshold)
    } else if (ev.type === 'mouseup') {
      this.mouseStarted = -1
      this.events.runAll('end', this.mouseLast > this.threshold)
      this.mouseLast = 0
    }
  }

  destroy () {
    this.events.runAll('end', false)
    this.events.runAll('destroy')

    window.removeEventListener('resize', this.resizeHandler)
  }
}
