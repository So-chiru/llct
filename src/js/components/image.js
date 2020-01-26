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
    <transition name="llct-image">
      <img :src="$attrs" v-on:load="done" v-show="load"></img>
    </transition>
  `
})