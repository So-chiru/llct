Vue.component('llct-menu', {
  template: `<div class="llct-menu-in" :class="{hidden: currentTab == 5}">
    <transition name="m-button" v-for="(item, i) in lists" appear @before-enter="beforeEnter" @after-enter="afterEnter">
      <div class="m-button" :data-index="i + 1" :tabindex="40 + (i + 1)" v-on:click="changeTab(i)" v-on:keypress="(ev) => ev.keyCode == 13 && changeTab(i)" v-bind:class="{active: currentTab == i}">
        <i class="material-icons" :title="item.title">{{item.icon}}</i>
        <p>{{item.title}}</p>
      </div>
    </transition>
  </div>`,
  data: () => {
    return {
      currentTab: 0,
      lists: [
        { title: '메인', icon: 'home' },
        { title: '음악', icon: 'library_music' },
        { title: '재생목록', icon: 'playlist_play' },
        { title: '검색', icon: 'search' },
        { title: '지금 재생 중', icon: 'equalizer' }
      ]
    }
  },
  watch: {
    currentTab (v) {
      this.$el.parentNode.classList[v == 4 ? 'add' : 'remove']('hidden')
    }
  },
  mounted () {
    this.$llctEvents.$on('changeTab', this.changeTabEvent)
  },
  beforeDestroy () {
    this.$llctEvents.$off('changeTab')
  },
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 75 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    },

    changeTab (id) {
      this.$root.changeTab(id)
    },

    changeTabEvent (id) {
      this.currentTab = id
    }
  }
})
