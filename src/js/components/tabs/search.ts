import LLCTMusicCard from '../music_card'
import LLCTSearchbox from '../searchbox'

export default {
  components: {
    LLCTMusicCard,
    LLCTSearchbox
  },
  template: `<div class="llct-tab" id="tab3">
    <div class="search-info">
      <LLCTSearchbox placeholder="여기에 검색할 텍스트 입력" :extraText="waitEnter && waitEnter + '개의 검색 결과가 있지만, 렌더링 성능을 위해 표시하지 않았습니다. 엔터를 눌러 결과를 확인할 수 있습니다.' || ''" :enter="(v) => goSearch(v, false)" :type="(v) => goSearch(v, true)"></LLCTSearchbox>
      <div class="search-music-cards" v-if="this.searchedData && this.searchedData.length">
        <transition-group name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter" tag="span">
          <LLCTMusicCard placeholder="round" v-for="(card, index) in this.searchedData" v-bind:key="'card_search_' + card.id" :data="card"></LLCTMusicCard>
        </transition-group>
      </div>
      <div class="search-music-nores" v-else>
        <div class="inner">
          <div class="big-icon">
            <div class="bg"></div>
            <span class="material-icons">{{this.keyword == '' ? 'find_in_page' : 'close'}}</span>
          </div>
          <transition-group name="llct-search-text">
            <h1 :key="'show_' + this.keyword == ''" v-show="this.keyword == ''">검색어를 입력하세요.</h1>
            <h1 :key="'show_' + this.keyword == ''" v-show="this.keyword !== ''">검색 결과가 없습니다.</h1>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      searchedData: null,
      keyword: '',
      waitEnter: 0
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 25 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    getArtist (id, artist) {
      return this.$store.state.data.getArtist(this.$store.state, id, artist)
    },

    getCoverURL (id) {
      return `${this.$llctDatas.base}/cover/75/${id}`
    },

    goSearch (v, skipLarge) {
      this.keyword = v

      let s = this.$llctDatas.search(v)
      this.waitEnter = s.length > 15 ? s.length : 0
      if (skipLarge && s.length > 15) {
        return
      }

      this.waitEnter = 0
      this.searchedData = s
    }
  }
}
