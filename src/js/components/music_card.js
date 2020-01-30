Vue.component('llct-music-card', {
  template: `<transition name="llct-music-card" appear tag="span" @before-enter="beforeEnter" @after-enter="afterEnter">
    <div class="llct-music-card" v-bind:key="title" :data-index="index">
      <div class="info">
        <llct-image :src="cover_url" :placeholder="placeholder"></llct-image>
        <div class="text">
          <h3>{{title}}</h3>
          <p>{{artist}}</p>
        </div class="text">
      </div>
      <div class="control">
        <div class="button">
          <i class="material-icons">playlist_add</i>
        </diV>
        <div class="button" v-on:click="play(id)">
          <i class="material-icons">play_arrow</i>
        </div>
      </div>
    </div>
  </transition>`,
  props: ['title', 'artist', 'cover_url', 'id', 'placeholder', 'index'],
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 10 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = '0ms'
    },

    play(id) {
      this.$llctEvents.$emit('play', id)
    }
  }
})