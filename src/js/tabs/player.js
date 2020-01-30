Vue.component('llct-player', {
  template: `<div class="llct-tab llct-tab-over" id="3">
    <div class="player-dash">
      <div class="player-left">
        <div class="player-info">
          <div class="player-info-image">
            <img :src="url"></img>
          </div>
          <div class="player-info-text">
            <p class="player-song-title">{{title}}</p>
            <p class="player-song-artist">{{artist}}</p>
          </div>
        </div>
        <div class="player-control">
          <div class="player-progress">
            <div class="player-progress-inner">
              <div class="current">0:00</div>
              <div class="bar">
                <div class="bar-current"></div>
                <div class="bar-load"></div>
                <div class="bar-bg"></div>
              </div>
              <div class="left">-0:00</div>
            </div>
          </div>
          <div class="player-btn">
            <i class="material-icons">play_arrow</i>
            <i class="material-icons">skip_next</i>
            <i class="material-icons diff">sync</i>
          </div>
        </div>
      </div>
      <div class="player-close" v-on:click="close()">
        <i class="material-icons">close</i>
      </div>
    </div>
  </div>
  `,
  data: () => {
    return {
      title: 'Thank you, FRIENDS!!',
      artist: 'Aqours',
      url: 'https://t1.daumcdn.net/cfile/tistory/99EBB2395BF40DE119'
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 25 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    close () {
      this.$root.changeTab(0)
    }
  }
})
