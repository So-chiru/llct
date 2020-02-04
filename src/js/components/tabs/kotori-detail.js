Vue.component('llct-kotori-detail', {
  template: `<div class="kotori-in-tab" v-show="this.$root.popup">

  </div>`,
  props: ['current'],
  data () {
    return {
      playLists: window.playlists
    }
  }
})
