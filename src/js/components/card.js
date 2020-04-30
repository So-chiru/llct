Vue.component('llct-card', {
  template: `
    <div class="llct-card" :data-clickable="!static" v-on:click="interact(id, ext_url, title, playlist)">
      <transition name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <p v-if="spoiler" class="spoiler"><i class="material-icons">warning</i> <span>스포일러 주의</span></p>
          <p v-if="ext_url" class="ext_url"><i class="material-icons">exit_to_app</i> <span>{{urlForm(ext_url)}}</span></p>
          <h3 :class="{skeleton: skeleton}">{{subtitle}}</h3>
          <h1 :class="{skeleton: skeleton}">{{title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer" :class="{skeleton: skeleton, spoiler: spoiler}"></div>
      <div class="llct-card-bg" :class="{spoiler: spoiler}">
        <llct-image v-bind:src="bg_url"></llct-image>
      </div>
    </div>
  `,
  props: [
    'index',
    'title',
    'subtitle',
    'bg_url',
    'id',
    'static',
    'ext_url',
    'oclick',
    'playlist',
    'spoiler',
    'skeleton'
  ],
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

    interact(id, ext_url, title, playlist) {
      if (this.$el.dataset.dragging == "true") {
        this.$el.dataset.dragging = false

        return
      }

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
