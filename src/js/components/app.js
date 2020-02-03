Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title" :class="{active: !this.$root.hide}">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title" :class="{hidden: this.$root.hide}">{{this.$root.title}}</h1>
      </transition>
    </div>
    <div class="llct-tab-margin" :class="{hidden: this.$root.hide}"></div>

    <transition-group name="llct-tabs" tag="div" mode="out-in">
      <llct-ayumu key="tab0" v-show="AyumuTab" :current="AyumuTab"></llct-ayumu>
      <llct-chika key="'tab1" v-show="ChikaTab" :current="ChikaTab"></llct-chika>
      <llct-kotori key="tab2" v-show="KotoriTab" :current="KotoriTab"></llct-kotori>
      <llct-kotori-detail key="tab4" v-show="KotoriDetailTab" :current="KotoriDetailTab"></llct-kotori-detail>
      <llct-player key="tab3" v-show="PlayerTab" :current="PlayerTab"></llct-player>
    </transition-group>
  </div>`,
  data: () => {
    return {
      currentTab: 0
    }
  },
  computed: {
    AyumuTab () {
      return this.currentTab == 0
    },
    ChikaTab () {
      return this.currentTab == 1
    },
    KotoriTab () {
      return this.currentTab == 2
    },
    PlayerTab () {
      return this.currentTab == 3
    },
    KotoriDetailTab () {
      return this.currentTab == 4
    }
  },
  beforeCreate () {
    this.$llctEvents.$on('changeTab', id => {
      this.currentTab = id
    })
  }
})
