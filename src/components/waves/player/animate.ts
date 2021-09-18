import { MusicPlayerState } from '@/@types/state'

class PlayerWave {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: MusicPlayerState
  progress: number

  width: number
  height: number

  seed: number

  color: string

  raf?: number

  constructor (
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    seed?: number
  ) {
    this.canvas = canvas

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error("This browser doesn't support 2d context.")
    }

    this.context = context
    this.state = MusicPlayerState.Paused
    this.progress = 0

    this.seed = seed ?? Math.random() * 10000 - 5000

    this.width = width
    this.height = width

    this.canvas.width = width * 2
    this.canvas.height = height * 2

    this.color = '#ffffffDD'
  }

  updateProgress (progress: number) {
    this.progress = 1 - progress
  }

  get started () {
    return this.raf !== 0
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

  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  render () {
    this.clear()

    const t = Date.now() / 2000
    const sin = Math.sin((t + this.seed) * Math.PI)
    const cos = Math.cos((t + this.seed) * Math.PI)

    let waveTo = 0

    if (this.state === MusicPlayerState.Playing) {
      waveTo = 9
    } else if (this.state === MusicPlayerState.Paused) {
      waveTo = 3
    } else {
      waveTo = 0
    }

    const zeroOffset = waveTo * ((this.seed < 0 ? sin : cos) * 0.75)
    const halfOffset = waveTo * ((this.seed < 0 ? cos : sin) * 0.75)

    const points = [
      [0, this.progress * this.canvas.height + zeroOffset],
      [0.3333, this.progress * this.canvas.height + zeroOffset],
      [0.6666, this.progress * this.canvas.height + halfOffset],
      [1, this.progress * this.canvas.height + halfOffset]
    ]

    this.context.beginPath()
    this.context.fillStyle = this.color + 'DD'

    this.context.moveTo(0, this.canvas.height)
    this.context.lineTo(points[0][0], points[0][1])

    for (let i = 0; i < points.length; i++) {
      if (points[i - 1]) {
        this.context.quadraticCurveTo(
          points[i - 1][0] * this.canvas.width,
          points[i - 1][1],
          ((points[i - 1][0] + points[i][0]) / 2) * this.canvas.width,
          (points[i - 1][1] + points[i][1]) / 2
        )
      } else {
        this.context.lineTo(points[i][0], points[i][1])
      }
    }

    this.context.lineTo(this.canvas.width, points[points.length - 1][1])
    this.context.lineTo(this.canvas.width, this.canvas.height)
    this.context.lineTo(0, this.canvas.height)

    this.context.fill()
    this.context.closePath()

    this.raf = requestAnimationFrame(this.render.bind(this))
  }
}

export default PlayerWave
