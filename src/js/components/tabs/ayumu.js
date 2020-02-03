Vue.component('llct-ayumu', {
  template: `<div class="llct-tab" id="tab0">
    <div class="ayumu-cards-holder">
      <transition-group name="llct-card">
        <llct-card v-for="(card, index) in this.$llctDatas.recommends.Cards" v-bind:key="index" :index="index" :title="card.Title" :subtitle="card.SubTitle" :bg_url="card.BG" :ext_url="card.ExtURL" :id="card.ID"></llct-card>
      </transition-group>
    </div>
    <div class="ayumu-mod-select">
      <div class="ayumu-mod-buttons">
        <div>
          <p>추천 곡</p>
        </div>
        <div class="in_active" v-on:click="changeTab(1)">
          <p>모든 곡</p>
          <i class="material-icons">chevron_right</i>
        </div>
      </div>
      <div class="ayumu-mod-ext-buttons">
        <i class="material-icons spin" v-on:click="refresh">refresh</i>
      </div>
    </div>
    <div class="ayumu-music-cards">
      <transition-group name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter" tag="span">
        <llct-music-card placeholder="round" v-for="(card, index) in this.$llctDatas.recommends.Songs" v-bind:key="'card' + card.ID" :title="card.Title" :artist="getArtist(card.ID, card.Artist)" :cover_url="card.CoverURL" :id="card.ID"></llct-music-card>
      </transition-group>
    </div>
  </div>
  `,
  props: ['current'],
  methods: {
    addCard (item) {
      if (typeof item !== 'object') {
        throw new Error('Given argument is not an object.')
      }

      this.cards.push(item)
    },
    beforeEnter (el) {
      el.style.transitionDelay = 25 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    getArtist (id, artist) {
      return this.$llctDatas.artist(id, artist)
    },

    changeTab (id) {
      this.$root.changeTab(id)
    },

    refresh () {
      this.$llctDatas.refresh()
    }
  },
  mounted () {
    this.slider = new LLCTSlide(
      this.$el.querySelector('.ayumu-cards-holder'),
      1200
    )
  }
})
