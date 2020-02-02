Vue.component('llct-music-card', {
  template: `<div class="llct-music-card" v-bind:key="title" :data-index="index">
    <div class="info">
      <llct-image :src="cover_url" :placeholder="placeholder"></llct-image>
      <div class="text">
        <h3>{{title}}</h3>
        <p>{{artist}}</p>
      </div class="text">
    </div>
    <div class="control">
      <div class="button" v-on:click="addPlaylist(id)">
        <i class="material-icons">playlist_add</i>
      </diV>
      <div class="button" v-on:click="play(id)">
        <i class="material-icons">play_arrow</i>
      </div>
    </div>
  </div>`,
  props: ['title', 'artist', 'cover_url', 'id', 'placeholder', 'index'],
  methods: {
    play (id) {
      this.$llctEvents.$emit('play', id)
    },

    addPlaylist(id) {
      showModal('플레이리스트에 추가', '어느 플레이리스트에 추가 할까요?<br><p>PlayList</p>', () => {

      })
    }
  }
})
