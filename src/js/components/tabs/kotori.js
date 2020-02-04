Vue.component('llct-kotori', {
  template: `<div class="llct-tab" id="tab2">
    <div class="kotori-cards-list">
      <llct-card v-for="(card, index) in playLists" v-bind:key="index" :index="index" :title="card.title" :subtitle="'총 ' + (card.items || []).length + '곡 수록'" :bg_url="card.bg ? card.bg : card.items ? this.$llctDatas.getCoverURL(card.items[0]) : null"></llct-card>
      <div class="kotori-playlist-add" v-on:click="playLists.length >= 30 ? noMorePlaylist() : addPlaylist()">
        <div>
          <i class="material-icons">add</i>
          <p>재생목록 만들기</p>
        </div>
      </div>
    </div>
    <llct-kotori-detail></llct-kotori-detail>
  </div>`,
  props: ['current'],
  data () {
    return {
      playLists: window.playlists
    }
  },
  methods: {
    playlistCb (v) {
      if (!v || v == '' || v.length > 30) return false

      let pl = new LLCTPlaylist(v, true)
      window.playlists.push(pl)

      // TODO : Tab in
    },

    noMorePlaylist () {
      window.showModal(
        '재생목록 만들기',
        window.playlists.length + '개 이상 플레이리스트를 만들 수 없습니다.'
      )
    },

    addPlaylist () {
      window.showModal(
        '재생목록 만들기',
        '재생목록 이름을 입력해주세요.',
        [
          {
            type: 'text',
            placeholder: '예시: 내가 쓰는 재생목록',
            callback: this.playlistCb,
            limit: 30,
            check: text => {
              for (var i = 0; i < window.playlists.length; i++) {
                if (window.playlists[i].title == text.trim()) return '이미 동일한 이름의 플레이리스트가 있습니다.'
              }

              return null
            }
          }
        ],
        this.playlistCb,
        () => {}
      )
    }
  }
})
