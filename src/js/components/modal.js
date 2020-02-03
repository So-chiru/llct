Vue.component('llct-modal', {
  template: `
  <div class="llct-modal" :class="{'show':this.$root.open}">
    <transition name="llct-modal" appear>
      <div class="contents">
        <h3>{{this.$root.title}}</h3>
        <p>{{this.$root.content}}</p>
        <div class="more" :class="{error: this.$root.error}">
          <input v-for="(item, index) in this.$root.inputs" :data-index="index" v-on:click="inputClickCb" v-on:keyup="inputEnterCb" :type="item.type" :value="item.default" :placeholder="item.placeholder" autofocus></input>
          <transition name="modal-error">
            <p class="error_text" v-if="this.$root.error"><i class="material-icons">warning</i> {{this.$root.error}}</p>
          </transition>
        </div>
        <div class="buttons_list">
          <div class="button_wrap">
            <div class="button" v-if="this.$root.acceptBtnNeed" v-on:click="accept">확인</div>
            <div class="button" v-on:click="this.$root.hide">닫기</div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="llct-modal-bg" appear>
      <div class="bg-layer" v-on:click="this.$root.hide"></div>
    </transition>
  </div>
  `,
  methods: {
    inputClickCb (ev) {
      if (ev.target.type == 'text') {
        return
      }

      let index = Number(ev.target.dataset.index)

      this.$root.inputCb(ev.target, index)
    },

    inputEnterCb (ev) {
      if (ev.target.value.trim() === '') {
        this.$root.error = '입력 값은 빈칸이 될 수 없습니다.'
        return true
      } else {
        this.$root.error = null
      }

      if (ev.keyCode !== 13) {
        return
      }

      let index = Number(ev.target.dataset.index)
      this.$root.inputCb(ev.target, index)
    },

    accept () {
      let txt = this.$el.querySelector('input[type="text"]')

      if (txt) {
        this.$root.accept(txt.value)
      }
    }
  }
})

window.addEventListener('load', () => {
  let modal = new Vue({
    el: 'llct-modal',
    data: () => {
      return {
        title: '',
        content: '',
        callback: () => {},
        open: false,
        error: null,
        inputs: [
          {
            type: 'button',
            default: '어느 버튼',
            callback: null
          },
          {
            type: 'text',
            default: '',
            placeholder: '여기에 텍스트 입력...',
            callback: v => {
              console.log(v)
            }
          }
        ]
      }
    },
    methods: {
      update (title, content, inputs, accept, close) {
        this.error = null

        this.title = title
        this.content = content
        this.inputs = inputs || []

        this.acceptCb = typeof accept === 'function' ? accept : () => {}
        this.closeCb = typeof close === 'function' ? close : () => {}

        if (typeof accept === 'function' && typeof close !== 'function') {
          this.acceptCb = () => {}
          this.closeCb = typeof accept === 'function' ? accept : () => {}
        }
      },

      inputCb (el, index) {
        let input = this.inputs || {}

        if (!input[index]) return false

        if (input[index].callback) {
          input[index].callback(el.type == 'text' ? el.value : el)
        }

        this.open = false
      },

      show () {
        this.open = true
      },

      accept (value) {
        this.open = false
        this.acceptCb(value)
      },

      hide () {
        this.open = false
        this.closeCb()
      }
    },

    computed: {
      acceptBtnNeed () {
        let inputLen = this.inputs.length
        if (!inputLen) {
          return false
        }

        for (var i = 0; i < inputLen; i++) {
          if (this.inputs[i].type == 'text') return true
        }

        return false
      }
    }
  })

  window.showModal = (title, content, inputs, callback) => {
    modal.update(title, content, inputs, callback)
    modal.show()
  }

  if (window) window.modal = modal
})
