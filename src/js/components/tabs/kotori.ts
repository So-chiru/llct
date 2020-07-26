import LLCTCard from '../card'

import * as Playlist from '../../core/playlist'

import LLCTKotoriDetail from './kotori-detail'

import { sha3_256 } from 'js-sha3'

import * as Modal from '../modal'

export default {
  components: {
    LLCTCard,
    LLCTKotoriDetail
  },
  template: `<div class="llct-tab llct-no-transform" id="tab2">
    <div class="kotori-cards-list">
      <LLCTCard v-for="(card, index) in playlists" v-bind:key="hash(card)" v-on:click="openPlaylist()" :oclick="openPlaylist" :data-title="card.title" :spoiler="card.spoiler" :title="card.title" :subtitle="'총 ' + (card.lists || []).length + '곡 수록'" :bg_url="card.bg ? card.bg : card.lists ? getCoverURL((card.lists[0] || {}).id) : null"></LLCTCard>
      <div class="kotori-playlist-add" v-on:click="playlists.length >= 30 ? noMorePlaylist() : addPlaylist()">
        <div>
          <i class="material-icons">add</i>
          <p>재생목록 만들기</p>
        </div>
      </div>
    </div>
    <LLCTKotoriDetail :selected="selectedPlaylist" :lastpl="lastPlaylist"></LLCTKotoriDetail>
  </div>`,
  props: ['current'],
  data () {
    return {
      selectedPlaylist: null,
      lastPlaylist: null
    }
  },
  computed: {
    playlists () {
      return this.$store.state.data.playlistsHolder.lists
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
      for (
        var i = 0;
        i < this.$store.state.data.playlistsHolder.length();
        i++
      ) {
        if (this.playlists[i].title == title) {
          this.selectedPlaylist = this.playlists[i]
          this.lastPlaylist = this.playlists[i]
        }
      }
    },

    remove () {
      for (
        var i = 0;
        i < this.$store.state.data.playlistsHolder.length();
        i++
      ) {
        if (this.playlists[i].title == this.selectedPlaylist.title) {
          return this.$store.state.data.playlistsHolder.remove(i)
        }
      }
    },

    playlistCb (v) {
      if (!v || v == '' || v.length > 30) return false

      let pl = new Playlist.LLCTPlaylist(v, false)
      this.$store.state.data.playlistsHolder.add(pl)

      this.selectedPlaylist = pl
      this.lastPlaylist = pl
    },

    noMorePlaylist () {
      Modal.show(
        '재생목록 만들기',
        this.$store.state.data.playlistsHolder.length() +
          '개 이상 플레이리스트를 만들 수 없습니다.',
        null,
        null,
        null,
        null,
        null
      )
    },

    clearPlaylist () {},

    addPlaylist () {
      Modal.show(
        '재생목록 만들기',
        '재생목록 이름을 입력해주세요.',
        [
          {
            type: 'text',
            placeholder: '예시: 내가 쓰는 재생목록',
            callback: this.playlistCb,
            limit: 30,
            check: text => {
              for (
                var i = 0;
                i < this.$store.state.data.playlistsHolder.length();
                i++
              ) {
                if (
                  this.$store.state.data.playlistsHolder.lists[i].title ==
                  text.trim()
                )
                  return '이미 동일한 이름의 플레이리스트가 있습니다.'
              }

              return null
            }
          }
        ],
        this.playlistCb,
        () => {},
        null,
        '만들기'
      )
    },

    evHandler (ev) {
      this.playLists = ev.detail.playlists.lists
    }
  },
  mounted () {
    this.$llctEvents.$on('openPlaylist', title => {
      this.selectedPlaylist = this.$store.state.data.playlistsHolder.find(title)
      this.lastPlaylist = this.selectedPlaylist
    })
  }
}
