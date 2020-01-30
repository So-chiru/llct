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
  template: `
    <img v-lazy="$attrs.src" v-on:load="done" v-show="$attrs.placeholder !== '' ? true : load" class="llct-image" :class="{loaded: done, round: $attrs.placeholder == 'round'}"></img>
  `
})
