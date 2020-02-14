Vue.component('llct-toast', {
  template: `
  <transition name="llct-toast" appear>
    <div class="llct-toast" :class="{'error':this.$root.error}" :key="this.$root.id" v-show="this.$root.open">
      <div class="contents" v-on:click="this.$root.clickCb">
        <div class="text">
          <i class="material-icons">{{this.$root.icon}}</i>
          <p>{{this.$root.content}}</p>
        </div>
        <div class="button" v-on:click="this.$root.hide">
          <i class="material-icons">close</i>
        </div>
      </div>
    </div>
  </transition>
  `,
  methods: {
    click (ev) {
      this.$root.click(ev.target)
    }
  }
})

window.addEventListener('load', () => {
  let toast = new Vue({
    el: 'llct-toast',
    data: () => {
      return {
        title: '',
        id: 0,
        icon: 'info',
        content: '',
        clickCb: () => {},
        open: false,
        error: null,
        autoClose: null
      }
    },
    methods: {
      update (content, icon, error, autoClose, click) {
        this.content = content
        this.id = Math.random()
        this.icon = icon || 'info'
        this.error = error

        this.clickCb = typeof click === 'function' ? click : () => {}

        if ((typeof autoClose !== 'boolean' && !autoClose) || autoClose) {
          this.autoClose = setTimeout(
            this.hide,
            autoClose && typeof autoClose === 'number' ? autoClose : 5000
          )
        }
      },

      show () {
        this.open = true
      },

      hide () {
        this.open = false
      }
    }
  })

  window.showToast = (content, icon, error, autoClose, click) => {
    if (toast.autoClose) {
      clearTimeout(toast.autoClose)
    }

    toast.update(content, icon, error, autoClose, click)
    toast.show()
  }

  window.addEventListener('keydown', ev => {
    if (ev.keyCode == 27 && toast.open) modal.open = false
  })

  if (window) window.toast = toast

  window.showToast(
    '7센하를 지지하여 콜표 사이트 제작자를 도와주세요.',
    'favorite',
    false,
    8000
  )
})
