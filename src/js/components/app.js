Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title" :class="{active: !this.$root.hide}">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title" :class="{hidden: this.$root.hide}">{{this.$root.title}}</h1>
      </transition>
      <transition name="llct-tab-title" appear>
        <h3 :key="this.$root.desc">{{this.$root.desc}}</h3>
      </transition>
    </div>
    <div class="llct-tab-margin" :class="{hidden: this.$root.hide}"></div>

    <transition-group name="llct-tabs" appear tag="span">
      <llct-ayumu v-bind:key="'tab' + 0" v-show="AyumuTab" :current="currentTab == 0"></llct-ayumu>
      <llct-chika v-bind:key="'tab' + 1" v-show="ChikaTab" :current="currentTab == 1"></llct-chika>
      <llct-kotori v-bind:key="'tab' + 2" v-show="KotoriTab" :current="currentTab == 2"></llct-kotori>
      <llct-player v-bind:key="'tab' + 3" v-show="PlayerTab" :current="currentTab == 3"></llct-player>
    </transition-group>
  </div>`,
  data: () => {
    return {
      currentTab: 0
    }
  },
  computed: {
    AyumuTab() {
      return this.currentTab == 0
    },
    ChikaTab() {
      return this.currentTab == 1
    },
    KotoriTab() {
      return this.currentTab == 2
    },
    PlayerTab() {
      return this.currentTab == 3
    }
  },
  beforeCreate() {
    this.$llctEvents.$on('changeTab', id => {
      this.currentTab = id
    })
  }
})