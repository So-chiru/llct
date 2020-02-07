Vue.component('llct-music-card', {
  template: `<div class="llct-music-card" v-bind:key="title" :data-index="index">
    <div class="info">
      <llct-image :src="cover_url" :placeholder="placeholder"></llct-image>
      <div class="text">
        <h3 v-if="!useAlt">{{title}}</h3>
        <h3 v-else>{{alt}}</h3>
        <p>{{artist}}</p>
      </div class="text">
    </div>
    <div class="control">
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
    'useAlt',
    'alt'
  ],
  methods: {
    play (id) {
      this.$llctEvents.$emit(
        'play',
        this.playlist ? this.playlist : id,
        false,
        true,
        null,
        this.playlist && typeof this.index === 'number' ? this.index : null
      )
    },

    addPlaylist (id) {
      let plBtns = []
      let leastOne = false

      let song = this.$llctDatas.getSong(id)
      for (var i = 0; i < window.playlists.length(); i++) {
        let listObj = window.playlists.lists[i]

        if (!listObj.readOnly) {
          leastOne = true
        } else {
          continue
        }

        ;(i => {
          plBtns.push({
            type: 'button',
            default: listObj.title,
            callback: _v => {
              window.playlists.addSong(i, song)
            }
          })
        })(i)
      }

      if (!window.playlists.length() || !leastOne) {
        return showModal(
          '재생목록 없음',
          '만든 재생목록이 없습니다. 재생목록 탭에서 새로 만들어주세요.'
        )
      }

      showModal(
        '플레이리스트에 추가',
        '어느 플레이리스트에 추가 할까요?',
        plBtns
      )
    }
  }
})
