import LLCTImage from './image'

export default {
  components: {
    LLCTImage
  },
  template: `
    <div class="llct-card" :data-clickable="!static" v-on:click="interact(id, ext_url, title, playlist)">
      <div class="llct-card-content" v-if="skeleton" :data-index="index"> 
        <h3 class="skeleton">{{subtitle}}</h3>
        <h1 class="skeleton">{{title}}</h1>
      </div>
      <transition name="llct-card" v-else appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <p v-if="spoiler" class="spoiler"><i class="material-icons">warning</i> <span>스포일러 주의</span></p>
          <p v-if="ext_url" class="ext_url"><i class="material-icons">exit_to_app</i> <span>{{urlForm(ext_url)}}</span></p>
          <h3 :class="{skeleton: skeleton}">{{subtitle}}</h3>
          <h1 :class="{skeleton: skeleton}">{{title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer" :class="{skeleton: skeleton, spoiler: spoiler}"></div>
      <div class="llct-card-bg" :class="{spoiler: spoiler}">
        <LLCTImage v-bind:src="bg_url" :full="true" :alt="title + ' 커버 이미지'"></LLCTImage>
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
    beforeEnter (el: HTMLElement) {
      el.style.transitionDelay = 45 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el: HTMLElement) {
      el.style.transitionDelay = ''
    },

    urlForm (url: string) {
      return new URL(url).host || url
    },

    interact (id: string, ext_url: string, title: string, playlist) {
      if (this.$el.dataset.dragging == 'true') {
        this.$el.dataset.dragging = false

        return
      }

      if (id) {
        this.$store.dispatch('player/play', {
          id,
          moveTab: true,
          playOnLoad: true
        })
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
}
