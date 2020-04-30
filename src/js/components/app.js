Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title" :class="{active: !this.$root.hide}">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title" :class="{hidden: this.$root.hide}">{{this.$root.title}}</h1>
      </transition>
      <i class="material-icons" v-if="SetsunaTab" v-on:click="goBack()" tabindex="1" v-on:keypress="ev => ev.keyCode == 13 && goBack()">close</i>
      <i class="material-icons" v-if="!SetsunaTab" v-on:click="changeTab(5)" tabindex="2" v-on:keypress="ev => ev.keyCode == 13 && changeTab(5)">settings</i>
    </div>
    <div class="llct-tab-margin" :class="{hidden: this.$root.hide}"></div>
    <transition-group name="llct-tabs" tag="div" mode="out-in">
      <llct-ayumu key="tab0" v-show="AyumuTab" :current="AyumuTab"></llct-ayumu>
      <llct-chika key="'tab1" v-show="ChikaTab" :current="ChikaTab"></llct-chika>
      <llct-kotori key="tab2" v-show="KotoriTab" :current="KotoriTab"></llct-kotori>
      <llct-search key="tab3" v-show="SearchTab" :current="SearchTab"></llct-search>
      <llct-player key="tab4" v-show="PlayerTab" :current="PlayerTab"></llct-player>
      <llct-setsuna key="tab5" v-show="SetsunaTab" :current="SetsunaTab"></llct-setsuna>
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
    SearchTab () {
      return this.currentTab == 3
    },
    PlayerTab () {
      return this.currentTab == 4
    },
    SetsunaTab () {
      return this.currentTab == 5
    }
  },
  methods: {
    goBack () {
      this.$root.goBackTab()
    },
    changeTab (id) {
      this.$root.changeTab(id)
    }
  },
  beforeCreate () {
    this.$llctEvents.$on('changeTab', id => {
      this.currentTab = id
    })
  }
})
