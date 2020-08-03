import { Slider } from '../../core/slide'
import LLCTImage from '../image'
import LLCTMusicCard from '../music_card'

export default {
  components: {
    LLCTImage,
    LLCTMusicCard
  },
  template: `<div class="llct-tab" id="tab1">
    <div class="group-select">
      <div class="group-btn" v-on:pointerup="changeGroup(0)" v-bind:class="{active: this.currentGroup == this.groups[0]}">
        <LLCTImage :shouldShow="true" src="/assets/us.png"></LLCTImage>
      </div>
      <div class="group-btn" v-on:pointerup="changeGroup(1)" v-bind:class="{active: this.currentGroup == this.groups[1]}">
        <LLCTImage :shouldShow="true" src="/assets/aqours.png"></LLCTImage>
      </div>
      <div class="group-btn" v-on:pointerup="changeGroup(2)" v-bind:class="{active: this.currentGroup == this.groups[2]}">
        <LLCTImage :shouldShow="true" src="/assets/niji.png"></LLCTImage>
      </div>
    </div>
    <div class="chika-music-cards" v-if="Object.keys(this.$store.state.data.lists).length" v-bind:key="this.currentGroup">
      <LLCTMusicCard placeholder="round" v-for="(data, index) in (this.$store.state.data.lists[this.currentGroup] || {collection: []}).collection" v-bind:key="index + '.' + useTranslated()" :currentGroup="currentGroup" :index="index" :data="data"></LLCTMusicCard>
    </div>
    <div class="chika-music-cards" v-else>
      <LLCTMusicCard v-for="(n, index) in 18" v-bind:key="'m_card_skeleton' + index" :index="index" :skeleton="true"></LLCTMusicCard>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      groups: ["0µ's", '1Aqours', '2虹ヶ咲'],
      currentGroup: '1Aqours'
    }
  },
  methods: {
    useTranslated () {
      return this.$llctDatas.useTranslatedTitle
    },

    beforeEnter (el) {
      el.style.transitionDelay = 75 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    changeGroup (id) {
      this.currentGroup = this.groups[id]
    },

    getArtist (artist) {
      return (
        this.$store.state.data.lists[this.currentGroup].meta.artists[artist] ||
        artist ||
        this.currentGroup
      )
    },

    getImageURL (id) {
      return `${this.$llctDatas.base}/cover/75/${id}`
    }
  },
  beforeRouteEnter () {
    this.slide = new Slider(this.$el.querySelector('.group-select'), 1200)
  }
}
