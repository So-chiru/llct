Vue.component('llct-modal', {
  template: `
  <div class="llct-modal" :class="{'show':this.$root.open}">
    <transition name="llct-modal" appear>
      <div class="contents">
        <h3>{{this.$root.title}}</h3>
        <p>{{this.$root.content}}</p>
        <div class="buttons_list">
          <div class="button" v-on:click="this.$root.hide">닫기</div>
        </div>
      </div>
    </transition>
    <transition name="llct-modal-bg" appear>
      <div class="bg-layer" v-on:click="this.$root.hide"></div>
    </transition>
  </div>
  `
})

window.addEventListener('load', () => {
  let modal = new Vue({
    el: 'llct-modal',
    data: () => {
      return {
        title: '',
        content: '',
        open: false
      }
    },
    methods: {
      update(title, content) {
        this.title = title
        this.content = content
      },

      show() {
        this.open = true
      },

      hide() {
        this.open = false
      }
    }
  })

  window.showModal = (title, content) => {
    modal.update(title, content)
    modal.show()
  }

  if (window) window.modal = modal
})
