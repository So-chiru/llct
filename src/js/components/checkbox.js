Vue.component('llct-checkbox', {
  template: `<div class="llct-checkbox" :class="{disabled: disabled}" :data-id="id" :data-on="on" v-on:click="toggle">
    <div class="selected" :style="{transform: 'translateX(' + (typeof translateX !== 'undefined' ? translateX : (this.on ? 18 : 0)) + 'px)'}" v-on:pointermove="hover" v-on:pointerdown="down" v-on:pointerup="up" v-on:pointerout="out">
    </div>
  </div>`,

  props: {
    onChange: {
      type: Function
    },

    id: {
      type: String
    },

    checked: {
      type: Boolean
    },

    disabled: {
      type: Boolean
    }
  },

  data () {
    return {
      on: this.checked,
      _down: false,
      translateX: undefined,
      onceOut: false
    }
  },

  methods: {
    toggle () {
      if (this.disabled) {
        return
      }

      if (this.onceOut) {
        this.onceOut = false

        return
      }

      this.on = !this.on

      this.onChange &&
        this.onChange({
          target: {
            dataset: { id: this.id },
            checked: this.on,
            type: 'checkbox'
          }
        })
    },

    hover (ev) {
      if (this.disabled) {
        return
      }

      if (this._down) {
        this.translateX = Math.ceil(ev.offsetX)
      }
    },

    down (ev) {
      if (this.disabled) {
        return
      }

      this._down = true
    },

    up (ev) {
      if (this.disabled) {
        return
      }

      this._down = false
      this.translateX = undefined
    },
    out () {
      if (this.disabled) {
        return
      }

      if (this._down) {
        this._down = false
        this.translateX = undefined
        this.toggle()

        this.onceOut = true
      }
    }
  }
})
