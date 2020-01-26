Vue.component('llct-card', {
  template: `
    <div class="llct-card" data-clickable="true">
      <transition name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <h3>{{subtitle}}</h3>
          <h1>{{title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer"></div>
      <div class="llct-card-bg">
        <img :src="url"></img>
      </div>
    </div>
  `,
  props: ['index', 'title', 'subtitle', 'url'],
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 75 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    }
  }
})

Vue.component('llct-music-card', {
  template: `<div class="llct-music-card">
    <div class="info">
      <img :src="cover_url"></img>
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

Vue.component('llct-ayumu', {
  template: `<div class="llct-tab">
    <div class="ayumu-cards-holder">
      <llct-card v-for="(card, index) in cards" v-bind:key="index" :index="index" :title="card.title" :subtitle="card.subtitle" :url="card.url"></llct-card>
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
      <llct-music-card v-for="(card, index) in music_cards" v-vind:key="index" :title="card.title" :artist="card.artist" :cover_url="card.cover_url"></llct-music-card>
    </div>
  </div>
  `,
  data: () => {
    return {
      cards: [
        {
          title: 'Thank you, FRIENDS!!',
          subtitle: '이런 곡은 어때요?',
          url: 'https://t1.daumcdn.net/cfile/tistory/99EBB2395BF40DE119'
        },
        {
          title: 'TOKIMEKI Runners',
          subtitle: '오늘 가장 많이 재생된 곡',
          url:
            'https://image.aladin.co.kr/product/16933/37/cover500/f382534371_1.jpg'
        },
        {
          title: 'Love U my friends',
          subtitle: '이런 곡은 어때요?',
          url:
            'https://images-na.ssl-images-amazon.com/images/I/51R19KJJ8KL.jpg'
        },
        {
          title: '루비야!!!',
          subtitle: '아아아아아아아아악!!',
          url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg'
        },
        {
          title: '루비야!!!',
          subtitle: '아아아아아아아아악!!',
          url: 'https://i.ytimg.com/vi/KNt8rnr4UDI/hqdefault.jpg'
        }
      ],

      music_cards: [
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

Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title">{{this.$root.title}}</h1>
      </transition>
      <transition name="llct-tab-title" appear>
        <h3 :key="this.$root.desc">{{this.$root.desc}}</h3>
      </transition>
    </div>
    <llct-ayumu></llct-ayumu>
  </div>`
})

Vue.component('llct-menu', {
  template: `<div class="llct-menu-in">
    <transition name="m-button" appear>
      <div class="m-button" data-index="1">
        <i class="material-icons">home</i>
        <p>메인</p>
      </div>
    </transition>
    <transition name="m-button" appear>
      <div class="m-button" data-index="2">
        <i class="material-icons">library_music</i>
        <p>음악</p>
      </div>
    </transition>
    <transition name="m-button" appear>
      <div class="m-button" data-index="3">
        <i class="material-icons">playlist_play</i>
        <p>재생목록</p>
      </div>
    </transition>
    <transition name="m-button" appear>
      <div class="m-button" data-index="4">
        <i class="material-icons">equalizer</i>
        <p>재생 중</p>
      </div>
    </transition>
  </div>`,
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 50 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    }
  }
})

const init = () => {
  var app = new Vue({
    el: 'llct-app',
    data: () => {
      return {
        tabs: [
          {
            title: '둘러보기',
            desc: ''
          },
          {
            title: 'LLCT',
            desc: 'LoveLive Call Table'
          }
        ],
        currentTab: 0,
        title: '둘러보기',
        desc: ''
      }
    },
    methods: {
      updateTitle (title, desc) {
        this.title = title
        this.desc = desc
      },

      changeTab (id) {
        if (this.tabs[id]) {
          this.updateTitle(this.tabs[id].title, this.tabs[id].desc)
        }
      }
    },
    ready: () => {
      changeTab(0)
    }
  })

  var menu = new Vue({
    el: 'llct-menu'
  })

  window.app = app
  window.menu = menu
}

window.addEventListener('DOMContentLoaded', init)
