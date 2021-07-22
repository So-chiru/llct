import * as colors from '@/styles/colors'

interface WaveVertex {
  x: number
  y: number
}

const easeOutExpo = (x: number) => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}
export default class Wave {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  size: number

  /**
   * 파도의 저항. 0으로 갈수록 빨라집니다.
   */
  resistance: number

  raf?: number
  scaleToRaf?: number

  vertexes: WaveVertex[]
  mobileVertexes: WaveVertex[]
  scale: number

  backgroundColor: string

  constructor (element: HTMLCanvasElement, width: number, height: number) {
    this.canvas = element

    const context = this.canvas.getContext('2d')

    if (!context) {
      throw new Error(
        'Context is not defined. Does your browser supports CanvasRenderingContext2D?'
      )
    }

    this.context = context
    this.size = 100

    this.resistance = 1.3

    this.vertexes = [
      {
        x: 0,
        y: 0.7
      },
      {
        x: 0.3,
        y: 0.6
      },
      {
        x: 0.55,
        y: 0.4
      },
      {
        x: 0.77,
        y: 0.23
      },
      {
        x: 0.94,
        y: 0
      }
    ]

    this.mobileVertexes = [
      {
        x: 0,
        y: 0.7
      },
      {
        x: 0.38,
        y: 0.55
      },
      {
        x: 0.68,
        y: 0.35
      },
      {
        x: 0.94,
        y: 0.2
      },
      {
        x: 1.3,
        y: 0.1
      }
    ]
    this.init()

    this.scale = 0
    this.resize(width, height)

    this.backgroundColor = colors.backgroundSemiAccent

    this.scaleTo(3000, 1)
  }

  updateTheme (darkTheme: boolean) {
    this.backgroundColor = darkTheme
      ? colors.darkBackgroundSemiAccent
      : colors.backgroundSemiAccent
  }

  init () {}

  resize (width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }

  start () {
    if (this.raf) {
      return
    }

    this.render()
  }

  stop () {
    if (this.raf) {
      cancelAnimationFrame(this.raf)

      this.raf = 0
    }
  }

  scaleTo (duration: number, to: number, started?: number, toDown?: boolean) {
    if (this.scaleToRaf) {
      cancelAnimationFrame(this.scaleToRaf)
    }

    // 바로 시작하는 경우 부자연스러우니 + 200밀리초 딜레이를 주고 시작
    if (!started) {
      started = performance.now() + 200
    }

    if (typeof toDown === 'undefined') {
      toDown = this.scale - to > 0
    }

    // TODO : from 구현하기 (현재는 0, 1에서 시작함)

    let value = easeOutExpo((performance.now() - started) / duration)

    if (toDown) {
      value = 1 - value
    }

    if (Math.abs(to - value) < 0.001) {
      this.scale = to

      return
    }

    this.scale = value

    this.scaleToRaf = requestAnimationFrame(() =>
      this.scaleTo.bind(this)(duration, to, started, toDown)
    )
  }

  render () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const cos = Math.cos(Date.now() / (1000 * this.resistance))
    const sin = Math.sin(Date.now() / (1000 * this.resistance))
    const cosAbs = (cos + 1) / 2

    const sw = easeOutExpo(this.scale) * this.canvas.width
    const sh = easeOutExpo(this.scale) * this.canvas.height

    const vertexes =
      window.innerWidth <= 800 ? this.mobileVertexes : this.vertexes

    this.context.beginPath()
    this.context.moveTo(0, 0)
    this.context.lineTo(0, sh * vertexes[0].y)

    // const dots: number[][] = []

    for (let i = 0; i < vertexes.length; ++i) {
      if (!vertexes[i + 1]) {
        continue
      }

      const tBaseX = cos * 28
      const tBaseY = sin * 30

      const x = sw * vertexes[i].x
      const y = sh * vertexes[i].y

      const nextX = sw * vertexes[i + 1].x + tBaseX
      const nextY = sh * vertexes[i + 1].y - tBaseY

      const xGap = nextX - x

      const middleX = (x + nextX) / 2
      const middleY = (y + nextY) / 2

      const cp1x = middleX - xGap / 4
      const cp1y = middleY + tBaseX

      const cp2x = middleX + xGap / 4
      const cp2y = middleY - tBaseY

      this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextX, nextY)

      // dots.push([x, y, cp1x, cp1y, cp2x, cp2y, nextX, nextY])
    }

    this.context.lineTo(this.canvas.width, -40)

    this.context.lineWidth = 3 + cosAbs * 30
    this.context.strokeStyle = '#ffffff77'
    this.context.stroke()

    this.context.fillStyle = this.backgroundColor
    this.context.fill()

    // dots.forEach(v => {
    //   this.context.fillStyle = 'black'
    //   this.context.fillRect(v[0] - 2, v[1] - 2, 8, 8)

    //   this.context.fillStyle = 'blue'
    //   this.context.fillRect(v[6] - 2, v[7] - 2, 10, 10)

    //   this.context.fillStyle = 'red'
    //   this.context.fillRect(v[2], v[3], 5, 5)

    //   this.context.fillStyle = 'red'
    //   this.context.fillRect(v[4], v[5], 5, 5)
    // })

    this.raf = requestAnimationFrame(this.render.bind(this))
  }
}
