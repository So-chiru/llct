Vue.component('llct-kotori', {
  template: `<div class="llct-tab" id="tab2">
    <div class="kotori-cards-list">
      <llct-card v-for="(card, index) in playLists" v-bind:key="index" v-on:click="openPlaylist()" :index="index" :oclick="openPlaylist" :data-title="card.title" :title="card.title" :subtitle="'총 ' + (card.lists || []).length + '곡 수록'" :bg_url="card.bg ? card.bg : card.items ? this.$llctDatas.getCoverURL(card.items[0]) : null"></llct-card>
      <div class="kotori-playlist-add" v-on:click="playLists.length >= 30 ? noMorePlaylist() : addPlaylist()">
        <div>
          <i class="material-icons">add</i>
          <p>재생목록 만들기</p>
        </div>
      </div>
    </div>
    <llct-kotori-detail :selected="selectedPlaylist"></llct-kotori-detail>
  </div>`,
  props: ['current'],
  data () {
    return {
      playLists: window.playlists,
      selectedPlaylist: null
    }
  },
  watch: {
    current (v) {
      if (!v && this.selectedPlaylist) this.selectedPlaylist = null
    },
    playLists (v) {
      let lis = []
      for (var i = 0; i < window.playlists.length; i++) {
        let item = v[i]

        if (!item.readOnly) lis.push(item)
      }

      localStorage.setItem('LLCTPlaylist', JSON.stringify(lis))
    }
  },
  methods: {
    openPlaylist (title) {
      for (var i = 0; i < window.playlists.length; i++) {
        if (playlists[i].title == title) {
          this.selectedPlaylist = playlists[i]
        }
      }
    },

    remove () {
      for (var i = 0; i < window.playlists.length; i++) {
        if (playlists[i].title == this.selectedPlaylist.title) {
          return playlists.splice(i, 1)
        }
      }
    },

    playlistCb (v) {
      if (!v || v == '' || v.length > 30) return false

      let pl = new LLCTPlaylist(v, false)
      window.playlists.push(pl)

      this.selectedPlaylist = pl
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
                if (window.playlists[i].title == text.trim())
                  return '이미 동일한 이름의 플레이리스트가 있습니다.'
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
