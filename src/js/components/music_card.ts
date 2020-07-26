import LLCTImage from './image'

import * as Modal from './modal'
import * as Toast from '../components/toast'

export default {
  components: {
    LLCTImage
  },
  template: `<div class="llct-music-card" :key="title + '.' + (offline && grayOut)" :data-index="index" :class="{skeleton: skeleton, grayOut: offline && grayOut}" :title="offline && grayOut ? '다운로드하지 않은 콜표입니다.' : ''">
    <div class="info">
      <LLCTImage :src="cover_url" :placeholder="placeholder" :skeleton="skeleton" :alt="title + ' 앨범 커버'"></LLCTImage>
      <div class="text">
        <h3 v-if="!useAlt" :title="title" :class="{skeleton: skeleton}">{{title}}</h3>
        <h3 v-else :title="alt">{{alt}}</h3>
        <p :title="artist" :class="{skeleton: skeleton}">{{artist}}</p>
      </div class="text">
    </div>
    <div class="control" v-if="!skeleton">
      <div class="button sub" v-on:click="addPlaylist(id)" v-if="!disablePlaylist">
        <i class="material-icons">playlist_add</i>
      </diV>
      <div class="button" v-on:click="play(id)">
        <i class="material-icons">play_arrow</i>
      </div>
      <div class="button sub" v-if="removeButton" v-on:click="removeButton">
        <i class="material-icons" :data-index="index">close</i>
      </div>
    </div>
  </div>`,
  props: [
    'title',
    'artist',
    'cover_url',
    'id',
    'placeholder',
    'index',
    'disablePlaylist',
    'removeButton',
    'playlist',
    'skeleton',
    'useAlt',
    'alt',
    'currentGroup'
  ],
  watch: {
    async currentGroup () {
      this.grayOut = false

      this.grayOut =
        !navigator.onLine && !(await this.$llctDatas.checkAvailable(this.id))
    }
  },
  data () {
    return {
      grayOut: null,
      oneMore: false
    }
  },
  computed: {
    offline () {
      return !navigator.onLine
    }
  },
  methods: {
    playAnyway (id) {
      this.$store.dispatch(
        'player/play',
        this.playlist
          ? {
              playlist: this.playlist,
              noURLState: false,
              playOnLoad: true,
              moveTab: true,
              playlistIndex: typeof this.index === 'number' ? this.index : null
            }
          : {
              id,
              noURLState: false,
              playOnLoad: true,
              moveTab: true,
              playlistIndex: null
            }
      )
    },
    play (id) {
      if (this.grayOut && !this.oneMore) {
        if (!this.oneMore) {
          this.oneMore = true

          setTimeout(() => {
            this.oneMore = false
          }, 500)
        }

        Toast.show(
          '다운로드하지 않은 콜표입니다. 계속하려면 한번 더 클릭하거나 여기를 클릭하세요.',
          'offline_bolt',
          false,
          3000,
          () => {
            this.playAnyway(id)
          }
        )

        return
      }

      this.oneMore = false

      this.playAnyway(id)
    },

    addPlaylist (id) {
      let buttons = []
      let leastOne = false

      let song = this.$llctDatas.getSong(id)
      for (
        var i = 0;
        i < this.$store.state.data.playlistsHolder.length();
        i++
      ) {
        let listObj = this.$store.state.data.playlistsHolder.lists[i]

        if (!listObj.readOnly) {
          leastOne = true
        } else {
          continue
        }

        ;(i => {
          buttons.push({
            type: 'button',
            default: listObj.title,
            callback: _v => {
              this.$store.state.data.playlistsHolder.addSong(i, song)
            }
          })
        })(i)
      }

      if (!this.$store.state.data.playlistsHolder.length() || !leastOne) {
        return Modal.show(
          '재생목록 없음',
          '만든 재생목록이 없습니다. 재생목록 탭에서 새로 만들어주세요.',
          null,
          null,
          null,
          null,
          null
        )
      }

      Modal.show(
        '플레이리스트에 추가',
        '어느 플레이리스트에 추가 할까요?',
        buttons,
        null,
        null,
        null,
        null
      )
    }
  },

  async mounted () {
    this.grayOut =
      !navigator.onLine && !(await this.$llctDatas.checkAvailable(this.id))
  }
}
