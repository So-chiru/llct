Vue.component('llct-music-card', {
  template: `<div class="llct-music-card">
    <div class="info">
      <llct-image v-bind:src="cover_url"></llct-image>
      <div class="text">
        <h3>{{title}}</h3>
        <p>{{artist}}</p>
      </div class="text">
    </div>
    <div class="control">
      <div class="button">
        <i class="material-icons">playlist_add</i>
      </diV>
      <div class="button">
        <i class="material-icons">play_arrow</i>
      </div>
    </div>
  </div>`,
  props: ['title', 'artist', 'cover_url']
})