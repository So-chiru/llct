Vue.component('llct-karaoke', {
  template: `
    <div class="llct-karaoke">
      <span v-for="(line, index) in karaData.timeline" class="karaoke-line-wrap" :key="'line_' + index">
        <transition name="llct-karaoke" appear>
          <p class="karaoke-line">
            <span class="karaoke-word" v-for="word in line.collection" :type="word.type" :start="word.start_time" :end="word.end_time" :class="{empty: word.text == ''}">{{word.text.replace(' ', '&nbsp;')}}</span>
          </p>
        </transition>
        <p class="karaoke-lyrics" v-if="line.lyrics && line.lyrics.length > 0">{{line.lyrics}}</p>
      </span>
    </div>
  `,
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      karaData: { metadata: {}, timeline: [] }
    }
  },
  watch: {
    id: {
      deep: true,
      immediate: true,
      handler () {
        this.load()
      }
    }
  },
  methods: {
    load () {
      let request = this.$llctDatas.karaoke(this.id)

      request.then(data => {
        this.karaData = data

        console.log(this.karaData)
      })
    }
  },
  mounted () {}
})
