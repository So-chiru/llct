Vue.component('llct-ayumu', {
  template: `<div class="llct-tab" id="tab0">
    <div class="ayumu-cards-holder">
      <span>
        <llct-card v-for="(card, index) in this.$llctDatas.recommends.Cards" v-bind:key="'card_' + index" :index="index" :title="card.Title" :subtitle="card.SubTitle" :playlist="card.Playlist" :bg_url="idfy(card.BG)" :ext_url="card.ExtURL" :id="card.ID"></llct-card>
      </span>
      <span v-if="!this.$llctDatas.recommends.Cards">
        <llct-card v-for="(n, index) in 3" :static="true" v-bind:key="'card_skeleton' + index" :index="1" :skeleton="true" v-once></llct-card>
      </span>
    </div>
    <div class="ayumu-mod-select">
      <div class="ayumu-mod-buttons">
        <div v-on:click="mode = 0" :class="{in_active: mode !== 0}">
          <p>추천 곡</p>
        </div>
        <div v-on:click="mode = 1" :class="{in_active: mode !== 1}">
          <p>최근 들은 곡</p>
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
      <transition-group v-if="this.$llctDatas.recommends.Songs" name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter" tag="span">
        <llct-music-card v-show="mode === 0" placeholder="round" v-for="(card, index) in this.$llctDatas.recommends.Songs" v-bind:key="'card' + Math.random() + card.ID" :title="card.Title" :artist="getArtist(card.ID, card.Artist)" :cover_url="getCoverURL(card.ID)" :id="card.ID"></llct-music-card>
        <llct-music-card v-show="mode === 1" placeholder="round" v-for="(card, index) in this.$llctDatas.recentPlayed" v-bind:key="'card' + Math.random() + card.id" :title="card.title" :artist="getArtist(card.id, card.artist)" :cover_url="getCoverURL(card.id)" :id="card.id"></llct-music-card>
      </transition-group>
      <transition-group v-else name="llct-card">
        <llct-music-card v-for="(n, index) in 12" v-bind:key="'m_card_skeleton' + index" :index="index" :skeleton="true" v-once></llct-music-card>
      </transition-group>  
    </div>
  </div>
  `,
  props: ['current'],
  data () {
    return {
      mode: 0,
      recentMusics: []
    }
  },
  methods: {
    addCard (item) {
      if (typeof item !== 'object') {
        throw new Error('Given argument is not an object.')
      }

      this.cards.push(item)
    },
    beforeEnter (el) {
      el.style.transitionDelay = 25 * Number(el.dataset.index, 10) + 'ms'
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

    idfy (str) {
      return str.indexOf('LLCT.ID$') > -1
        ? `${this.$llctDatas.base}/cover/${str.split('LLCT.ID$')[1]}`
        : str
    },

    getCoverURL (id) {
      return `${this.$llctDatas.base}/cover/75/${id}`
    },

    refresh () {
      this.$llctDatas.refresh()
    }
  },
  mounted () {
    this.slider = new LLCTSlide(
      this.$el.querySelector('.ayumu-cards-holder span'),
      1200
    )
  }
})
