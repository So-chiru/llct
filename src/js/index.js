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
            title: '음악',
            desc: ''
          },
          {
            title: '재생목록',
            desc: ''
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

        this.currentTab = id
      }
    },
    ready: () => {
      changeTab(0)
    }
  })

  var menu = new Vue({
    el: 'llct-menu',
    methods: {
      changeTab(id) {
        app.changeTab(id)
      }
    }
  })

  window.app = app
  window.menu = menu
}
