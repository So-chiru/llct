Vue.component('llct-searchbox', {
  template: `
  <transition name="llct-searchbox" appear>
    <div class="llct-searchbox">
      <div class="icon_wrap">
        <i class="material-icons search_icon">search</i>
      </div>
      <input type="text" :placeholder="placeholder" tabindex="10"></input>
      <div class="enter_wrap" tabindex="11" v-on:keypress="ev => ev.keyCode == 13 && enter(this.$el.querySelector('input').value)" v-on:click="() => enter(this.$el.querySelector('input').value)">
        <i class="material-icons">keyboard_return</i>
      </div>
      <transition name="llct-card">
        <div class="extra-text" :key="'searchbox_' + extraText" v-show="extraText && extraText.length">
          <p>{{extraText || ''}}</p>
        </div>
       </transition>
    </div>
  </transition>
  `,
  props: {
    placeholder: String,
    type: {
      type: Function,
      required: false
    },
    enter: {
      type: Function,
      required: true
    },
    extraText: {
      type: String,
      required: false
    }
  },
  mounted () {
    let v = this.$el.querySelector('input')

    v.addEventListener('input', () => {
      if (this.type) {
        this.type(v.value)
      }
    })

    v.addEventListener('change', () => {
      if (this.enter) {
        this.enter(v.value)
      }
    })
  }
})
