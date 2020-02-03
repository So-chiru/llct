Vue.component('llct-kotori', {
  template: `<div class="llct-tab" id="tab2">
    <div class="kotori-cards-list">
      <llct-card v-for="(card, index) in playLists" v-bind:key="index" :index="index" :title="card.Title" :subtitle="'총 ' + card.Lists.length + '곡 수록'" :bg_url="card.BG" :id="card.ID"></llct-card>
      <div class="kotori-playlist-add" v-on:click="addPlaylist()">
        <div>
          <i class="material-icons">add</i>
          <p>재생목록 만들기</p>
        </div>
      </div>
    </div>
  </div>`,
  props: ['current'],
  data () {
    return {
      playLists: [
        {
          Title: 'Aqours 5th LoveLive!',
          BG: this.$llctDatas.getCoverURL('10089'),
          Lists: ['', '', '', '', '']
        },
        {
          Title: 'Aqours 4th LoveLive!',
          BG: this.$llctDatas.getCoverURL('10001'),
          Lists: ['', '', '', '', '']
        },
        {
          Title: 'Aqours 3rd LoveLive!',
          BG: this.$llctDatas.getCoverURL('10039'),
          Lists: ['', '', '', '', '']
        },
        {
          Title: 'Aqours 2nd LoveLive! Tour',
          BG: this.$llctDatas.getCoverURL('10028'),
          Lists: ['', '', '', '', '']
        }
      ]
    }
  },
  methods: {
    playlistCb(v) {
      console.log(v)

      // TODO : v로 재생목록 만들고 Tab in
    },
    addPlaylist () {
      window.showModal(
        '재생목록 만들기',
        '재생목록 이름을 입력 해 주세요.',
        [
          {
            type: 'text',
            placeholder: '내가 쓰는 재생목록',
            callback: this.playlistCb
          }
        ],
        this.playlistCb,
        () => {}
      )
    }
  }
})
