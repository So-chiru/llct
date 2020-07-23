import Vue from 'vue'

let toast

Vue.component('llct-toast', {
  template: `
  <transition name="llct-toast" appear>
    <div class="llct-toast" :class="{hover: this.$root.clickCb}" :title="this.$root.content" :data-type="this.$root.type" :key="this.$root.id" v-show="this.$root.open">
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

window.addEventListener('DOMContentLoaded', () => {
  toast = new Vue({
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
})

window.addEventListener('keydown', ev => {
  if (ev.keyCode == 27 && toast.open) toast.open = false
})

/**
 * 토스트를 표시합니다.
 *
 * @param content 토스트의 내용
 * @param icon 토스트의 아이콘
 * @param type 토스트가 에러인지의 여부
 * @param autoClose 토스트가 자동으로 닫힐 시간
 * @param click 클릭하면 실행할 함수
 */
export const show = (
  content: String,
  icon: String,
  type: Boolean,
  autoClose: Number,
  click: Function
) => {
  if (toast.autoClose) {
    clearTimeout(toast.autoClose)
  }

  toast.update(content, icon, type, autoClose, click)
  toast.show()
}

export default toast
