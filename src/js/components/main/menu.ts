import Vue from 'vue'

Vue.component('llct-menu', {
  template: `<div class="llct-menu-in" :class="{hidden: tab == 5}">
    <transition name="m-button" v-for="(item, i) in lists" :key="'mbutton' + i" appear @before-enter="beforeEnter" @after-enter="afterEnter">
      <div class="m-button" :data-index="i + 1" :tabindex="40 + (i + 1)" v-on:pointerup="changeTab(i)" v-on:keypress="(ev) => ev.keyCode == 13 && changeTab(i)" v-bind:class="{active: tab == i}">
        <i class="material-icons" :title="item.title">{{item.icon}}</i>
        <p>{{item.title}}</p>
      </div>
    </transition>
  </div>`,
  data: () => {
    return {
      lists: [
        { title: '메인', icon: 'home' },
        { title: '음악', icon: 'library_music' },
        { title: '재생목록', icon: 'playlist_play' },
        { title: '검색', icon: 'search' },
        { title: '지금 재생 중', icon: 'equalizer' }
      ]
    }
  },
  computed: {
    tab () {
      return this.$store.state.tab.current
    }
  },
  watch: {
    tab (v) {
      this.$el.parentNode.classList[v == 4 ? 'add' : 'remove']('hidden')
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 75 * Number(el.dataset.index) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    changeTab (id) {
      this.$store.commit('tab/changeTo', id)
    }
  }
})
