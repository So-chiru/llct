Vue.component('llct-modal', {
  template: `
  <div class="llct-modal" :class="{'show':this.$root.open}">
    <transition name="llct-modal" appear>
      <div class="contents">
        <h3>{{this.$root.title}}</h3>
        <p>{{this.$root.content}}</p>
        <div class="more" :class="{error: this.$root.error}">
          <input v-for="(item, index) in this.$root.inputs" :data-index="index" v-on:click="inputClickCb" v-on:keyup="inputEnterCb" :type="item.type" :value="item.value || item.default" :data-limit="item.limit" :placeholder="item.placeholder" autofocus></input>
          <transition name="modal-error">
            <p class="error_text" :class="{show: this.$root.error}" :key="this.$root.errorShake"><i class="material-icons">warning</i> {{this.$root.error || ''}}</p>
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
    checkInput (ev) {
      let ori = this.$root.inputs[ev.target.dataset.index]
      let error = ori.check ? ori.check(ev.target.value) : null

      if (
        ev.target.dataset.limit &&
        ev.target.value.trim().length > Number(ev.target.dataset.limit)
      ) {
        error =
          '입력 값은 ' + ev.target.dataset.limit + '자를 넘을 수 없습니다.'
      } else if (ev.target.value.trim() === '') {
        error = '입력 값은 빈칸이 될 수 없습니다.'
      }

      return error
    },

    inputClickCb (ev) {
      if (ev.target.type == 'text') {
        return
      }

      let index = Number(ev.target.dataset.index)

      this.$root.inputCb(ev.target, index)
    },

    inputEnterCb (ev) {
      this.$root.error = this.checkInput(ev)

      this.$root.inputs[ev.target.dataset.index].value = ev.target.value

      if (!this.$root.error) {
        if (ev.keyCode !== 13) {
          return
        }

        let index = Number(ev.target.dataset.index)
        this.$root.inputCb(ev.target, index)
      } else {
        this.$root.errorShake = Math.random()
      }
    },

    accept () {
      this.$root.accept(
        (this.$el.querySelector('input[type="text"]') || {}).value
      )
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
        errorShake: Math.random(),
        inputs: [
          {
            type: 'button',
            default: 'Example Button',
            callback: null
          },
          {
            type: 'text',
            default: '',
            placeholder: 'Example Input',
            callback: v => {
              console.log(v)
            }
          }
        ]
      }
    },
    methods: {
      update (title, content, inputs, accept, close, confirm) {
        this.error = null
        this.enterDone = false

        this.title = title
        this.content = content
        this.inputs = inputs || []
        this.confirm = confirm || false

        this.acceptCb = typeof accept === 'function' ? accept : () => {}
        this.closeCb = typeof close === 'function' ? close : () => {}

        if (typeof accept === 'function' && !close) {
          this.acceptCb = () => {}
          this.closeCb = accept
        }
      },

      inputCb (el, index) {
        let input = this.inputs || {}

        if (!input[index] || this.enterDone) return false

        if (input[index].callback) {
          input[index].callback(el.type == 'text' ? el.value : el)
        }

        this.enterDone = true
        this.open = false
      },

      show () {
        this.open = true
      },

      accept (value) {
        if (!this.enterDone) {
          this.acceptCb(value)
        }

        this.enterDone = true
        this.open = false
      },

      hide () {
        if (!this.enterDone) {
          this.closeCb()
        }

        this.enterDone = true
        this.open = false
      }
    },

    computed: {
      acceptBtnNeed () {
        if (this.confirm) {
          return true
        }

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

  window.showModal = (title, content, inputs, accept, close, confirm) => {
    modal.update(title, content, inputs, accept, close, confirm)
    modal.show()
  }

  window.addEventListener('keydown', ev => {
    if (ev.keyCode == 27 && modal.open) modal.open = false
  })

  if (window) window.modal = modal
})
