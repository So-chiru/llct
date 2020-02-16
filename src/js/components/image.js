Vue.component('llct-image', {
  data: () => {
    return {
      load: false
    }
  },
  methods: {
    done () {
      this.load = true
    },

    errHandle (ev) {
      if (this.error) {
        this.error(ev)
      }
    }
  },
  props: ['shouldShow', 'error', 'skeleton'],
  computed: {
    show () {
      return window.LLCTSettings.get('useImages') || this.shouldShow
    }
  },
  template: `
    <img v-lazy="$attrs.src" v-on:error="errHandle" v-on:load="done" v-show="show ? ($attrs.placeholder !== '' ? true : (show ? load : false)) : false" class="llct-image" :class="{loaded: done, round: $attrs.placeholder == 'round', skeleton: skeleton}"></img>
  `
})
