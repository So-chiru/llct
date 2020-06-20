Vue.component('llct-image', {
  data: () => {
    return {
      load: false
    }
  },
  methods: {
    done() {
      if (this.full) {
        let height = this.$el.clientHeight
        let parentHeight = this.$el.parentNode.clientHeight

        if (height < parentHeight) {
          this.$el.style.minWidth = "100%"
          this.$el.style.minHeight = "100%"
        }

        return
      }

      this.load = true
    },

    errHandle (ev) {
      if (this.error) {
        this.error(ev)
      }
    }
  },
  props: ['shouldShow', 'error', 'skeleton', 'full', 'image'],
  computed: {
    show () {
      return window.LLCTSettings.get('useImages') || this.shouldShow
    }
  },
  template: `
    <img v-lazy="$attrs.src" :alt="image || 'LLCT Image'" v-on:error="errHandle" v-on:load="done" v-show="show ? ($attrs.placeholder !== '' ? true : (show ? load : false)) : false" class="llct-image" :class="{loaded: done, round: $attrs.placeholder == 'round', skeleton: skeleton}"></img>
  `
})
