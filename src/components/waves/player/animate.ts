import { MusicPlayerState } from '@/@types/state'

class PlayerWave {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  state: MusicPlayerState
  progress: number

  width: number
  height: number

  raf?: number

  constructor (canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error("This browser doesn't support 2d context.")
    }

    this.context = context
    this.state = MusicPlayerState.Paused
    this.progress = 0

    this.width = width
    this.height = height

    this.canvas.width = width
    this.canvas.height = height
  }

  updateProgress (progress: number) {
    // TODO : ease

    this.progress = 1 - progress
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

    const sin = Math.sin(Date.now() / 1000)
    const cos = Math.cos(Date.now() / 1000)

    let waveTo = 0

    if (this.state === MusicPlayerState.Playing) {
      waveTo = 12
    } else if (this.state === MusicPlayerState.Paused) {
      waveTo = 3
    } else {
      waveTo = 0
    }

    const points = [
      [0, this.canvas.height * this.progress],
      [33, this.canvas.height * this.progress + waveTo * sin],
      [66, this.canvas.height * this.progress + waveTo * cos],
      [100, this.canvas.height * this.progress]
    ]

    this.context.beginPath()
    this.context.fillStyle = '#ffffff'

    this.context.moveTo(0, 100)
    this.context.lineTo(points[0][0], points[0][1])

    for (let i = 0; i < points.length; i++) {
      if (points[i - 1]) {
        this.context.quadraticCurveTo(
          points[i - 1][0],
          points[i - 1][1],
          (points[i - 1][0] + points[i][0]) / 2,
          (points[i - 1][1] + points[i][1]) / 2
        )
      } else {
        this.context.lineTo(points[i][0], points[i][1])
      }
    }

    this.context.lineTo(100, points[points.length - 1][1])
    this.context.lineTo(100, 100)
    this.context.lineTo(0, 100)

    this.context.fill()
    this.context.closePath()

    this.raf = requestAnimationFrame(this.render.bind(this))
  }
}

export default PlayerWave
