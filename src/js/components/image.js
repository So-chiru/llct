Vue.component('llct-image', {
  data: () => {
    return {
      load: false
    }
  },
  methods: {
    done () {
      this.load = true
    }
  },
  props: ['shouldShow'],
  computed: {
    show () {
      return window.LLCTSettings.get('useImages') || this.shouldShow
    }
  },
  template: `
    <img v-lazy="$attrs.src" v-on:load="done" v-show="show ? ($attrs.placeholder !== '' ? true : (show ? load : false)) : false" class="llct-image" :class="{loaded: done, round: $attrs.placeholder == 'round'}"></img>
  `
})
