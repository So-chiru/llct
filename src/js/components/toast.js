Vue.component('llct-toast', {
  template: `
  <transition name="llct-toast" appear>
    <div class="llct-toast" :class="{hover: this.$root.clickCb}" :data-type="this.$root.type" :key="this.$root.id" v-show="this.$root.open">
      <div class="contents" v-on:click="click">
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
      if (this.$root.clickCb) {
        this.$root.clickCb(ev.target)
      }
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
        clickCb: null,
        open: false,
        type: null,
        autoClose: null
      }
    },
    methods: {
      update (content, icon, type, autoClose, click) {
        this.content = content
        this.id = Math.random()
        this.icon = icon || 'info'
        this.type = typeof type === 'boolean' ? (type ? 'error' : 'info') : type
        this.clickCb = click

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

  window.showToast = (content, icon, type, autoClose, click) => {
    if (toast.autoClose) {
      clearTimeout(toast.autoClose)
    }

    toast.update(content, icon, type, autoClose, click)
    toast.show()
  }

  window.addEventListener('keydown', ev => {
    if (ev.keyCode == 27 && toast.open) modal.open = false
  })

  if (window) window.toast = toast
})
