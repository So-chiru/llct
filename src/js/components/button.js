export default {
  template: `<div class="llct-button" :data-id="id" v-on:click="clickHandler" v-text="text"></div>`,
  props: {
    click: {
      type: Function
    },
    text: {
      type: String,
      required: true
    },
    id: {
      type: String
    }
  },
  methods: {
    clickHandler (ev) {
      this.click(ev)
    }
  }
}
