Vue.component('llct-kotori-detail', {
  template: `<div class="kotori-in-tab" :class="{show: selected != null}">
    <div class="content">
      <div class="out-meta">
        <div class="meta">
          <h1>{{last.title}}</h1>
          <div class="control">
            <h3>총 {{(last.lists || []).length}}개의 곡이 재생목록에 있습니다.</h3>
            <div class="remove" v-if="!last.readOnly" v-on:click="removeConfirm">재생목록 삭제</div>
          </div>
        </div>
        <div class="close" v-on:click="close"><i class="material-icons">close</i></div>
      </div>
      <div class="lists">
        <draggable v-model="last.lists" :move="checkMovable" :disabled="!checkMovable()" :handle="'.info'" :touchStartThreshold="50" :animation="200" filter=".control" easing="cubic-bezier(0.4, 0, 0.2, 1)" draggable=".llct-music-card" @end="dragged">
          <llct-music-card placeholder="round" v-for="(data, index) in (last.lists || [])" :key="index" :playlist="last" :removeButton="last.readOnly ? false : removeSong" :disablePlaylist="!last.readOnly" :index="index" :title="data.title" :artist="getArtist(data.id, data.artist || '0')" :cover_url="getImageURL(data.id || '10001')" :id="data.id"></llct-music-card>
        </draggable>
      </div>
    </div>
  </div>`,
  props: ['current', 'selected', 'lastpl'],
  data () {
    return {
      playLists: window.playlists || {},
      select: this.selected || {},
      last: this.lastpl || {},
    }
  },
  watch: {
    selected (v) {
      this.select = v || {}
    },

    lastpl (v) {
      this.last = v || {}
    }
  },
  methods: {
    close () {
      this.$parent.selectedPlaylist = null
    },

    checkMovable () {
      return !this.select.readOnly
    },

    removeConfirm () {
      if (!this.select.lists.length) {
        this.remove()
        return
      }

      showModal(
        '재생목록 삭제',
        '정말 "' + this.select.title + '" 재생목록을 삭제할까요?',
        null,
        () => {
          this.remove()
        },
        () => {},
        true,
        '삭제'
      )
    },

    remove () {
      this.$parent.remove()
      this.close()
    },

    dragged () {
      window.playlists.save()
    },

    removeSong (ev) {
      window.playlists.find(this.select.title).remove(ev.target.dataset.index)
      window.playlists.save()
    },

    getImageURL (id) {
      return `${this.$llctDatas.base}/cover/75/${id}`
    },
    getArtist (id, artist) {
      return this.$llctDatas.artist(id, artist)
    },
    evKeydown (ev) {
      if (ev.keyCode == 27 && this.select) this.close()
    }
  },
  mounted () {
    window.addEventListener('keydown', this.evKeydown)
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.evKeydown)
  }
})
