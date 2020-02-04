Vue.component('llct-kotori-detail', {
  template: `<div class="kotori-in-tab" :class="{show: selected != null}">
    <div class="content">
      <h1>{{select.title}}</h1>
      <h3>총 {{(select.lists || []).length}}개의 곡 있음</h3>
      <div v-if="!select.readOnly" v-on:click="remove">삭제</div>

      <div class="lists">
        <llct-music-card placeholder="round" v-for="(data, index) in (select.lists || [])" v-bind:key="index" :index="index" :title="data.title" :artist="getArtist(data.id, data.artist || '0')" :cover_url="getImageURL(data.id || '10001')" :id="data.id"></llct-music-card>
      </div>
    </div>
    <div class="bg" :key="selected != null" v-on:click="close"></div>
  </div>`,
  props: ['current', 'selected'],
  data () {
    return {
      playLists: window.playlists,
      select: this.selected || {}
    }
  },
  watch: {
    selected (v) {
      this.select = v || {}
    }
  },
  methods: {
    close () {
      this.$parent.selectedPlaylist = null
    },

    remove () {
      this.$parent.remove()
      this.close()
    },

    getImageURL (id) {
      return this.$llctDatas.base + '/cover/' + id
    },
    getArtist (id, artist) {
      return this.$llctDatas.artist(id, artist)
    }
  },
  mounted () {
    window.addEventListener('keydown', ev => {
      if (ev.keyCode == 27 && this.select) this.close()
    })
  }
})
