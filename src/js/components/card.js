Vue.component('llct-card', {
  template: `
    <div class="llct-card" data-clickable="true">
      <transition name="llct-card" appear @before-enter="beforeEnter" @after-enter="afterEnter">
        <div class="llct-card-content" :data-index="index"> 
          <h3>{{subtitle}}</h3>
          <h1>{{title}}</h1>
        </div>
      </transition>
      <div class="llct-card-bg-layer"></div>
      <div class="llct-card-bg">
        <llct-image v-bind:src="url"></llct-image>
      </div>
    </div>
  `,
  props: ['index', 'title', 'subtitle', 'url'],
  methods: {
    beforeEnter (el) {
      el.style.transitionDelay = 45 * parseInt(el.dataset.index, 10) + 'ms'
    },

    afterEnter (el) {
      el.style.transitionDelay = ''
    }
  }
})