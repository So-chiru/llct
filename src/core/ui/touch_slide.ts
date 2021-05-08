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

    this.addTouchHandler()
    this.addMouseHandler()

    this.events = new eventBus()

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
    window.addEventListener('resize', this.resizeHandler)
  }

  updateThreshold () {
    let screenSize = window.innerHeight

    if (this.direction === TouchDirection.Horizontal) {
      screenSize = window.innerWidth
    }

    this.threshold = this.options.threshold || screenSize / 6
  }

  addTouchHandler () {
    this.elem.addEventListener('touchstart', this.touchHandler.bind(this))
    this.elem.addEventListener('touchend', this.touchHandler.bind(this))
    this.elem.addEventListener('touchmove', this.touchHandler.bind(this))
    this.elem.addEventListener('touchcancel', this.touchHandler.bind(this))
  }

  addMouseHandler () {
    this.elem.addEventListener('mousedown', this.mouseHandler.bind(this))
    this.elem.addEventListener('mousemove', this.mouseHandler.bind(this))
    this.elem.addEventListener('mouseleave', this.mouseHandler.bind(this))
    this.elem.addEventListener('mouseup', this.mouseHandler.bind(this))
  }

  touchHandler (ev: TouchEvent) {
    if (ev.type === 'touchstart') {
      this.touchStarted =
        ev.touches[0][
          this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX'
        ]

      this.events.runAll('start')
    } else if (ev.type === 'touchmove' && this.touchStarted !== -1) {
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
    if (ev.type === 'mousedown') {
      this.mouseStarted =
        ev[this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX']

      this.events.runAll('start')
    } else if (ev.type === 'mousemove' && this.mouseStarted !== -1) {
      this.mouseLast =
        ev[this.direction === TouchDirection.Vertical ? 'screenY' : 'screenX'] -
        this.mouseStarted
      this.events.runAll('move', this.mouseLast, this.threshold)
    } else if (ev.type === 'mouseup' || ev.type === 'mouseleave') {
      this.mouseStarted = -1
      this.events.runAll('end', this.mouseLast > this.threshold)
      this.mouseLast = 0
    }
  }

  destroy () {
    this.elem.removeEventListener('touchstart', this.touchHandler)
    this.elem.removeEventListener('touchend', this.touchHandler)
    this.elem.removeEventListener('touchmove', this.touchHandler)
    this.elem.removeEventListener('touchcancel', this.touchHandler)
    this.elem.removeEventListener('mousedown', this.mouseHandler)
    this.elem.removeEventListener('mouseleave', this.mouseHandler)
    this.elem.removeEventListener('mouseup', this.mouseHandler)
    this.elem.removeEventListener('mousemove', this.mouseHandler)

    window.removeEventListener('resize', this.resizeHandler)
  }
}
