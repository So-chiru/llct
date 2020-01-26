Vue.component('llct-chika', {
  template: `<div class="llct-tab" id="1">
    <div></div>
  </div>
  `,
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 75 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    }
  }
})
