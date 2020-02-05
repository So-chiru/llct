Vue.component('llct-card', {
  template: `
    <div class="llct-card" data-clickable="true" v-on:click="interact(id, ext_url, title, playlist)">
      <transition name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <p v-if="ext_url"><i class="material-icons">exit_to_app</i> <span>{{urlForm(ext_url)}}</span></p>
          <h3>{{subtitle}}</h3>
          <h1>{{title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer"></div>
      <div class="llct-card-bg">
        <llct-image v-bind:src="bg_url"></llct-image>
      </div>
    </div>
  `,
  props: ['index', 'title', 'subtitle', 'bg_url', 'id', 'ext_url', 'oclick', 'playlist'],
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 45 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    urlForm (url) {
      return new URL(url).host || url
    },

    interact (id, ext_url, title, playlist) {
      if (id) {
        this.$llctEvents.$emit('play', id)
        return
      }

      if (playlist) {
        this.$llctEvents.$emit('openPlaylist', playlist)
        return
      }

      if (ext_url) {
        window.open(ext_url, '_blank')
        return
      }

      if (this.oclick) {
        this.oclick(title)
      }
    }
  }
})
