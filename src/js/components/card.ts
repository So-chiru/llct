import LLCTImage from './image'

export default {
  components: {
    LLCTImage
  },
  template: `
    <div class="llct-card" :data-clickable="!static" v-on:click="interact(id, ext_url, title, playlist)">
      <div class="llct-card-content" v-if="skeleton" :data-index="index"> 
        <h3 class="skeleton"></h3>
        <h1 class="skeleton"></h1>
      </div>
      <transition name="llct-card" v-else appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <p v-if="spoiler" class="spoiler"><i class="material-icons">warning</i> <span>스포일러 주의</span></p>
          <p v-if="ext_url" class="ext_url"><i class="material-icons">exit_to_app</i> <span>{{urlForm(ext_url)}}</span></p>
          <h3>{{subtitle}}</h3>
          <h1 v-if="title" v-html="title"></h1>
          <h1 v-else>{{translated() && cardData && cardData.tr ? cardData && cardData.tr : cardData && cardData.title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer" :class="{skeleton: skeleton, spoiler: spoiler}"></div>
      <div class="llct-card-bg" :class="{spoiler: spoiler}">
        <LLCTImage v-bind:src="bg_url || this.$llctDatas.base + '/cover/' + (cardData && cardData.id)" :full="true" :alt="title + ' 커버 이미지'"></LLCTImage>
      </div>
    </div>
  `,
  data: () => {
    return {
      cardData: null
    }
  },
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
    'skeleton',
    'data'
  ],
  methods: {
    translated () {
      return this.$llctDatas.useTranslatedTitle
    },

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
    },

    setCardData () {
      if (Object.keys(this.$store.state.data.lists).length === 0) {
        this.cardData = 1000

        return
      }

      if (typeof this.data === 'object' && typeof this.data.ID === 'string') {
        this.cardData = this.$store.state.data.getSong(
          this.$store.state,
          this.data.ID
        )
      } else if (typeof this.data === 'string') {
        this.cardData =
          this.$store.state.data.getSong(this.$store.state, this.data) || {}
      } else {
        this.cardData = null
      }
    }
  },

  mounted () {
    this.setCardData()

    if (this.cardData === 1000) {
      this.$llctDatas.$on('listsLoaded', this.setCardData)
    }
  }
}
