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
      <llct-ayumu v-bind:key="0" v-show="currentTab == 0" :current="currentTab == 0"></llct-ayumu>
      <llct-chika v-bind:key="1" v-show="currentTab == 1" :current="currentTab == 1"></llct-chika>
      <llct-kotori v-bind:key="2" v-show="currentTab == 2" :current="currentTab == 2"></llct-kotori>
      <llct-player v-bind:key="3" v-show="currentTab == 3" :current="currentTab == 3"></llct-player>
    </transition-group>
  </div>`,
  data: () => {
    return {
      currentTab: 0
    }
  },
  mounted() {
    this.$llctEvents.$on('changeTab', id => {
      this.currentTab = id
    })
  }
})