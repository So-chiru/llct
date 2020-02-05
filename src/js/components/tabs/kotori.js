Vue.component('llct-kotori', {
  template: `<div class="llct-tab" id="tab2">
    <div class="kotori-cards-list">
      <llct-card v-for="(card, index) in playLists" v-bind:key="hash(card)" v-on:click="openPlaylist()" :index="index" :oclick="openPlaylist" :data-title="card.title" :title="card.title" :subtitle="'총 ' + (card.lists || []).length + '곡 수록'" :bg_url="card.bg ? card.bg : card.lists ? getCoverURL((card.lists[0] || {}).id) : null"></llct-card>
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
      playLists: (window.playlists || {}).lists || [],
      selectedPlaylist: null
    }
  },
  watch: {
    current (v) {
      if (!v && this.selectedPlaylist) this.selectedPlaylist = null
    }
  },
  methods: {
    getCoverURL (id) {
      return this.$llctDatas.base + '/cover/' + id
    },
    hash (obj) {
      return sha3_256(JSON.stringify(obj))
    },

    openPlaylist (title) {
      for (var i = 0; i < window.playlists.length(); i++) {
        if (playlists.lists[i].title == title) {
          this.selectedPlaylist = playlists.lists[i]
        }
      }
    },

    remove () {
      for (var i = 0; i < window.playlists.length(); i++) {
        if (playlists.lists[i].title == this.selectedPlaylist.title) {
          return playlists.remove(i)
        }
      }
    },

    playlistCb (v) {
      if (!v || v == '' || v.length > 30) return false

      let pl = new LLCTPlaylist(v, false)
      window.playlists.add(pl)

      this.selectedPlaylist = pl
    },

    noMorePlaylist () {
      window.showModal(
        '재생목록 만들기',
        window.playlists.length() + '개 이상 플레이리스트를 만들 수 없습니다.'
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
              for (var i = 0; i < window.playlists.length(); i++) {
                if (window.playlists.lists[i].title == text.trim())
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
  },
  mounted () {
    this.$llctEvents.$on('openPlaylist', title => {
      this.selectedPlaylist = window.playlists.find(title)
    })
  }
})
