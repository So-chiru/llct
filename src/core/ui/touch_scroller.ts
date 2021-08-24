const DELTA_COUNTS = 5
const DELTA_THRESHOLD = 3

/**
 * 터치 스크롤에 사용할 옵션
 */
interface TouchScrollerOptions {
  /**
   * 관성 스크롤을 사용할 지에 대한 여부
   */
  momentum?: boolean

  /**
   * 어느 방향으로 스크롤이 가능한 지를 지정
   */
  direction: TouchScrollerDirection
}

export const enum TouchScrollerDirection {
  Horizonal,
  Vertical
}

const DefaultTouchScrollerOptions: TouchScrollerOptions = {
  momentum: true,
  direction: TouchScrollerDirection.Horizonal
}

export class TouchScroller {
  $: HTMLElement
  readonly options: Required<TouchScrollerOptions>

  pressed = false
  pressData = {
    startPos: -1,
    lastPos: -1,
    start: -1,
    last: -1,
    delta: -1
  }

  deltaData: number[] = []

  /**
   * 스크롤이 가능한 요소를 인자로 받아 스크롤 바를 숨기고 대신 터치나 마우스 움직임으로 스크롤할 수 있게 만듭니다.
   * @param element 스크롤이 가능한 HTMLElement
   */
  constructor (element: HTMLElement, options = DefaultTouchScrollerOptions) {
    this.$ = element
    this.options = Object.assign(
      {},
      DefaultTouchScrollerOptions,
      options
    ) as Required<TouchScrollerOptions>

    this.initialize()
  }

  get isHorizonal () {
    return this.options.direction === TouchScrollerDirection.Horizonal
  }

  addStyles () {
    this.$.setAttribute(
      'style',
      'scrollbar-width: none; user-select: none; scrollbar-height: none;'
    )
  }

  removeStyles () {
    this.$.setAttribute('style', '')
  }

  /**
   * 요소가 스크롤 가능한지에 대한 여부를 반환합니다.
   */
  get scrollable (): boolean {
    return this.isHorizonal
      ? this.$.scrollWidth > this.$.clientWidth
      : this.$.scrollHeight > this.$.clientHeight
  }

  /**
   * 주어진 값 만큼 스크롤합니다.
   * @param amount
   */
  moveScrollBy (amount: number): void {
    if (this.isHorizonal) {
      this.$.scrollLeft = this.pressData.last + amount
      this.pressData.last = this.$.scrollLeft
    } else {
      this.$.scrollTop = this.pressData.last + amount
      this.pressData.last = this.$.scrollTop
    }
  }

  addDeltaData () {
    this.deltaData.push(this.pressData.delta)

    if (this.deltaData.length > DELTA_COUNTS) {
      this.deltaData.splice(0, 1)
    }
  }

  doMomentumScroll () {
    if (this.deltaData.length < DELTA_COUNTS) {
      return
    }

    const average =
      this.deltaData.reduce((p, c) => p + c, 0) / this.deltaData.length

    if (Math.abs(average) < DELTA_THRESHOLD) {
      return
    }

    let iter = 1
    const update = () => {
      const scrollDirectionLT = this.isHorizonal
        ? this.$.scrollLeft
        : this.$.scrollTop
      const scrollDirectionWH = this.isHorizonal
        ? this.$.scrollWidth
        : this.$.scrollHeight

      this.moveScrollBy(average / iter)
      iter++

      if (
        Math.abs(average / iter) < DELTA_THRESHOLD / 10 ||
        scrollDirectionLT < 1 ||
        scrollDirectionLT >= scrollDirectionWH
      ) {
        return
      }

      requestAnimationFrame(() => update())
    }

    update()
  }

  handleMouse (ev: MouseEvent): void {
    if (!this.scrollable) {
      return
    }

    if (ev.type === 'mousedown') {
      this.pressed = true
      this.pressData = {
        ...this.pressData,
        startPos: this.isHorizonal ? ev.clientX : ev.clientY,
        start: this.isHorizonal ? this.$.scrollLeft : this.$.scrollTop
      }

      return
    } else if (ev.type === 'mouseup') {
      this.pressed = false
      this.pressData = {
        ...this.pressData,
        startPos: -1,
        start: -1
      }

      if (Math.abs(this.pressData.delta) > 0) {
        if (this.options.momentum) {
          this.doMomentumScroll()
        }

        ev.preventDefault()
      }

      return
    }

    if (!this.pressed) {
      return
    }

    if (ev.type === 'mousemove') {
      const clientPos = this.isHorizonal ? ev.clientX : ev.clientY

      if (this.pressData.lastPos < 0) {
        this.pressData.lastPos = this.pressData.startPos
      }

      this.pressData.delta = this.pressData.lastPos - clientPos
      this.pressData.lastPos = clientPos

      this.addDeltaData()
      this.moveScrollBy(this.pressData.delta)
    }
  }

  /**
   * 주어진 요소에 이벤트 리스너를 붙입니다.
   */
  attachEventListener () {
    this.$.addEventListener('mousedown', this.handleMouse.bind(this))
    this.$.addEventListener('mouseup', this.handleMouse.bind(this))

    this.$.addEventListener('mousemove', this.handleMouse.bind(this))
  }

  /**
   * 주어진 요소에 부착된 이벤트 리스터를 뗴어냅니다.
   */
  dettachEventListener () {
    this.$.removeEventListener('mousedown', this.handleMouse)
    this.$.removeEventListener('mouseup', this.handleMouse)
    this.$.removeEventListener('mousemove', this.handleMouse)
  }

  /**
   * 스크롤러를 초기화합니다.
   */
  initialize () {
    this.attachEventListener()
    this.addStyles()
  }

  /**
   * 스크롤러를 파괴합니다.
   */
  destroy () {
    this.dettachEventListener()
    this.removeStyles()
  }
}

export default TouchScroller
