import * as colors from '../../styles/colors'

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

  raf?: number

  vertexes: WaveVertex[]
  scale: number

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

    this.vertexes = []
    this.init()

    this.scale = 0

    this.resize(width, height)
  }

  init () {
    this.vertexes.push({
      x: 0,
      y: 0.7
    })

    this.vertexes.push({
      x: 0.3,
      y: 0.6
    })

    this.vertexes.push({
      x: 0.55,
      y: 0.4
    })

    this.vertexes.push({
      x: 0.8,
      y: 0.2
    })

    this.vertexes.push({
      x: 0.99,
      y: 0
    })
  }

  resize (width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }

  start () {
    this.render()
  }

  stop () {
    if (this.raf) {
      cancelAnimationFrame(this.raf)
    }
  }

  render () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.scale !== 1) {
      this.scale = Math.min(1, this.scale + 0.03)
    }

    const sin = Math.sin(Date.now() / 1000)
    const cos = Math.cos(Date.now() / 1000)
    const cosAbs = (Math.cos(Date.now() / 1000) + 1) / 2

    const sw = easeOutExpo(this.scale) * this.canvas.width
    const sh = easeOutExpo(this.scale) * this.canvas.height

    this.context.beginPath()
    this.context.moveTo(0, 0)
    this.context.lineTo(0, sh * this.vertexes[0].y)

    // const dots: number[][] = []

    for (let i = 0; i < this.vertexes.length; ++i) {
      const x = sw * this.vertexes[i].x
      const y = sh * this.vertexes[i].y

      if (this.vertexes[i + 1]) {
        const targetX = sw * this.vertexes[i + 1].x
        const targetY = sh * this.vertexes[i + 1].y + cos * 40

        const middleX = (x + targetX) / 2
        const middleY = (y + targetY) / 2

        const firstPoint = [x + cosAbs * 20, y]
        const secondPoint = [middleX - cos * 20, middleY + cos * 30]

        this.context.bezierCurveTo(
          firstPoint[0],
          firstPoint[1],
          secondPoint[0],
          secondPoint[1],
          targetX - 50,
          targetY
        )

        // dots.push([targetX - 20, targetY, ...firstPoint, ...secondPoint])
      }

      this.context.lineWidth = Math.max(10, 40 * cos)
      this.context.strokeStyle = '#fff'
      this.context.stroke()
    }

    this.context.lineTo(this.canvas.width, -40)

    this.context.strokeStyle = '#fff'
    this.context.stroke()

    this.context.fillStyle = colors.backgroundSemiAccent
    this.context.fill()

    // dots.forEach(v => {
    //   this.context.fillStyle = 'black'
    //   this.context.fillRect(v[0] - 2, v[1] - 2, 8, 8)

    //   this.context.fillStyle = 'red'
    //   this.context.fillRect(v[2], v[3], 5, 5)

    //   this.context.fillStyle = 'blue'
    //   this.context.fillRect(v[4], v[5], 5, 5)
    // })

    this.raf = requestAnimationFrame(this.render.bind(this))
  }
}
