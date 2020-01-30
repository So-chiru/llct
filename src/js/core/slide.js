const LLCTSlide = class {
  constructor ($el, duration) {
    if (!$el) {
      throw new Error('element is not defined.')
    }

    this.$el = $el
    this.velocityDuration = duration || 1200

    if (!('ontouchstart' in window)) {
      this.init()
    }
  }

  init () {
    this.hammer = new Hammer(this.$el, {})

    let expo = (t, b, c, d) => {
      return c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    }

    this.hammer.on('pan', ev => {
      this.$el.scrollLeft = this.$el.scrollLeft + ev.velocityX * -10

      let a = ev.velocityX
      let b = ev.velocityX * -1
      let start = ev.timeStamp

      if (!ev.isFinal) return false

      let req = null

      let r = () => {
        a = expo(Date.now() - start, ev.velocityX, b, this.velocityDuration)

        this.$el.scrollLeft = this.$el.scrollLeft + a * -10

        if (a > -0.1 && a < 0.1) {
          a = undefined
          b = undefined
          start = undefined
          r = undefined

          cancelAnimationFrame(req)
          return
        }

        req = requestAnimationFrame(r)
      }

      r()
    })
  }

  destroy () {
    this.$el = null
    this.hammer.destroy()
  }
}
