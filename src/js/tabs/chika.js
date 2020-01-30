Vue.component('llct-chika', {
  template: `<div class="llct-tab" id="1">
    <div class="group-select">
      <div class="group-btn" v-on:click="changeGroup(0)" v-bind:class="{active: this.currentGroup == this.groups[0]}">
        <llct-image src="/assets/us.png"></llct-image>
      </div>
      <div class="group-btn" v-on:click="changeGroup(1)" v-bind:class="{active: this.currentGroup == this.groups[1]}">
        <llct-image src="/assets/aqours.png"></llct-image>
      </div>
      <div class="group-btn" v-on:click="changeGroup(2)" v-bind:class="{active: this.currentGroup == this.groups[2]}">
        <llct-image src="/assets/niji.png"></llct-image>
      </div>
    </div>
    <div class="chika-music-cards">
      <llct-music-card placeholder="round" v-for="(data, index) in this.$llctDatas.lists[this.currentGroup].collection" v-bind:key="index" :index="index" :title="data.title" :artist="getArtist(data.artist)" :cover_url="getImageURL(data.id)" :id="data.id"></llct-music-card>
    </div>
  </div>
  `,
  data: () => {
    return {
      groups: ["µ's", 'Aqours', '虹ヶ咲'],
      currentGroup: 'Aqours'
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 75 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    changeGroup (id) {
      this.currentGroup = this.groups[id]
    },

    getArtist (artist) {
      return (
        this.$llctDatas.lists[this.currentGroup].meta.artists[artist] ||
        artist ||
        this.currentGroup
      )
    },

    getImageURL (id) {
      return this.$llctDatas.base + '/cover/' + id
    }
  },
  mounted () {
    this.slide = new LLCTSlide(this.$el.querySelector('.group-select'), 1200)
  }
})
