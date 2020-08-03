import LLCTImage from './image'

import * as Modal from './modal'
import * as Toast from '../components/toast'

export default {
  components: {
    LLCTImage
  },
  template: `<div class="llct-music-card" :key="cardData.title + '.' + (offline && grayOut)" :data-index="index" :class="{skeleton: skeleton, grayOut: offline && grayOut}" :title="offline && grayOut ? '다운로드하지 않은 콜표입니다.' : ''">
    <div class="info">
      <LLCTImage :src="this.$llctDatas.base + '/cover/75/' + cardData.id" :placeholder="placeholder" :skeleton="skeleton" :alt="cardData.title + ' 앨범 커버'"></LLCTImage>
      <div class="text">
        <h3 v-if="!useAlt" :title="cardData.title" :class="{skeleton: skeleton}">{{cardData && (translated() && cardData.tr ? cardData.tr : cardData.title)}}</h3>
        <p :title="cardData.artist" :class="{skeleton: cardData.skeleton}">{{cardData.id && getArtist(cardData.id, cardData.artist)}}</p>
      </div class="text">
    </div>
    <div class="control" v-if="!skeleton">
      <div class="button sub" v-on:click="addPlaylist(cardData.id)" v-if="!disablePlaylist">
        <i class="material-icons">playlist_add</i>
      </diV>
      <div class="button" v-on:click="play()">
        <i class="material-icons">play_arrow</i>
      </div>
      <div class="button sub" v-if="removeButton" v-on:click="removeButton">
        <i class="material-icons" :data-index="index">close</i>
      </div>
    </div>
  </div>`,
  props: [
    'data',
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
      oneMoreTab: false,
      cardData: {}
    }
  },
  computed: {
    offline () {
      return !navigator.onLine
    }
  },
  methods: {
    translated () {
      return this.$llctDatas.useTranslatedTitle
    },

    playAnyway(id) {
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
    play() {
      if (this.grayOut && !this.oneMoreTab) {
        if (!this.oneMoreTab) {
          this.oneMoreTab = true

          setTimeout(() => {
            this.oneMoreTab = false
          }, 500)
        }

        Toast.show(
          '다운로드하지 않은 콜표입니다. 계속하려면 한번 더 클릭하거나 여기를 클릭하세요.',
          'offline_bolt',
          false,
          3000,
          () => {
            this.playAnyway(this.cardData.id)
          }
        )

        return
      }

      this.oneMoreTab = false

      this.playAnyway(this.cardData.id)
    },

    addPlaylist (id) {
      let buttons = []
      let leastOne = false

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
              this.$store.state.data.playlistsHolder.addSong(i, id)
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
    },

    getArtist (id, artist) {
      return this.$store.state.data.getArtist(this.$store.state, id, artist)
    },

    setCardData () {
      if (Object.keys(this.$store.state.data.lists).length === 0) {
        this.cardData = 1000

        return
      }

      if (typeof this.data === 'string') {
        this.cardData =
          this.$store.state.data.getSong(this.$store.state, this.data) || {}
      } else if (typeof this.data === 'object') {
        this.cardData = this.data
      } else {
        this.cardData = {}
      }
    }
  },

  async mounted () {
    this.grayOut =
      !navigator.onLine && !(await this.$llctDatas.checkAvailable(this.id))

    this.setCardData()

    if (this.cardData === 1000) {
      this.$llctDatas.$on('listsLoaded', this.setCardData)
    }
  }
}
