Vue.component('llct-kotori', {
  template: `<div class="llct-tab" id="tab2">
    <div class="kotori-cards-list">
      <llct-card v-for="(card, index) in playLists" v-bind:key="index" :index="index" :title="card.Title" :subtitle="'총 ' + card.Lists.length + '곡 수록'" :bg_url="card.BG" :id="card.ID"></llct-card>
      <div class="kotori-playlist-add">
        <div>
          <i class="material-icons">add</i>
          <p>플레이리스트 만들기</p>
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
  methods: {}
})
