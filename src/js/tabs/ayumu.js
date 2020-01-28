Vue.component('llct-ayumu', {
  template: `<div class="llct-tab" id="0">
    <div class="ayumu-cards-holder">
      <llct-card v-for="(card, index) in cards" v-bind:key="index" :index="index" :title="card.title" :subtitle="card.subtitle" :url="card.url" :id="card.id"></llct-card>
    </div>
    <div class="ayumu-mod-select">
      <div class="ayumu-mod-buttons">
        <div>
          <p>추천 곡</p>
        </div>
        <div class="in_active" v-on:click="changeTab(1)">
          <p>모든 곡</p>
          <i class="material-icons">chevron_right</i>
        </div>
      </div>
      <div class="ayumu-mod-ext-buttons">
        <i class="material-icons spin">refresh</i>
      </div>
    </div>
    <div class="ayumu-music-cards">
      <transition-group name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter" tag="span">
        <llct-music-card v-for="(card, index) in music_cards" v-bind:key="index" :title="card.title" :artist="card.artist" :cover_url="card.cover_url" :id="card.id"></llct-music-card>
      </transition-group>
    </div>
  </div>
  `,
  data: () => {
    return {
      cards: [
        {
          title: 'Thank you, FRIENDS!!',
          subtitle: '이런 곡은 어때요?',
          url: 'https://t1.daumcdn.net/cfile/tistory/99EBB2395BF40DE119',
          id: '10001'
        },
        {
          title: 'TOKIMEKI Runners',
          subtitle: '오늘 가장 많이 재생된 곡',
          url:
            'https://image.aladin.co.kr/product/16933/37/cover500/f382534371_1.jpg',
          id: '20001'
        },
        {
          title: 'Love U my friends',
          subtitle: '이런 곡은 어때요?',
          url:
            'https://images-na.ssl-images-amazon.com/images/I/51R19KJJ8KL.jpg',
          id: '20011'
        },
        {
          title: '루비야!!!',
          subtitle: '아아아아아아아아악!!',
          url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg',
          id: null
        },
        {
          title: '루비야!!!',
          subtitle: '아아아아아아아아악!!',
          url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg',
          id: null
        }
      ],

      music_cards: [
        {
          title: 'Thank you, FREINDS!!',
          artist: 'Aqours',
          cover_url: 'https://t1.daumcdn.net/cfile/tistory/99EBB2395BF40DE119',
          id: '00001'
        },
        {
          title: 'TOKIMEKI Runners',
          artist: '虹ヶ咲学園 スクールアイドル同好会',
          cover_url:
            'https://image.aladin.co.kr/product/16933/37/cover500/f382534371_1.jpg',
          id: '20001'
        },
        {
          title: 'SUNNY DAY SONG',
          artist: 'Aqours',
          cover_url:
            'https://is1-ssl.mzstatic.com/image/thumb/Music1/v4/f0/47/58/f0475867-91dd-3f0b-ccd4-a57a342e6f13/source/1200x1200bb.jpg',
          id: '00079'
        },
        {
          title: 'Thank you, FREINDS!!',
          artist: 'Aqours',
          cover_url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg'
        },
        {
          title: 'Thank you, FREINDS!!',
          artist: 'Aqours',
          cover_url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg'
        },
        {
          title: 'Thank you, FREINDS!!',
          artist: 'Aqours',
          cover_url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg'
        }
      ]
    }
  },
  methods: {
    addCard (item) {
      if (typeof item !== 'object') {
        throw new Error('Given argument is not an object.')
      }

      this.cards.push(item)
    },
    beforeEnter (el) {
      el.style.transitionDelay = 25 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    changeTab (id) {
      this.$root.changeTab(id)
    }
  },
  mounted () {
    if (!('ontouchstart' in window)) {
      let $el = this.$el.querySelector('.ayumu-cards-holder')
      var hammer = new Hammer($el, {})

      let expo = (t, b, c, d) => {
        return c * (-Math.pow(2, (-10 * t) / d) + 1) + b
      }
      let duration = 1200

      hammer.on('pan', ev => {
        $el.scrollLeft = $el.scrollLeft + ev.velocityX * -10

        let a = ev.velocityX
        let b = ev.velocityX * -1
        let start = ev.timeStamp

        if (!ev.isFinal) return false

        let req = null

        let r = () => {
          a = expo(Date.now() - start, ev.velocityX, b, duration)

          $el.scrollLeft = $el.scrollLeft + a * -10

          if (a > -0.1 && a < 0.1) {
            a = undefined
            b = undefined
            start = undefined
            r = undefined

            cancelAnimationFrame(req)
            return
          }

          req = requestAnimationFrame(r)
        }

        r()
      })
    }
  }
})
