Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title" v-if="!this.$root.hide">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title" v-bind:class="{hidden: this.$root.hide}">{{this.$root.title}}</h1>
      </transition>
      <transition name="llct-tab-title" appear>
        <h3 :key="this.$root.desc">{{this.$root.desc}}</h3>
      </transition>
    </div>
    <div class="llct-tab-margin" v-if="this.$root.hide"></div>
    <transition-group name="llct-tabs" appear tag="span">
      <llct-ayumu v-bind:key="0" v-if="this.$root.currentTab == 0"></llct-ayumu>
      <llct-chika v-bind:key="1" v-if="this.$root.currentTab == 1"></llct-chika>
      <llct-kotori v-bind:key="2" v-if="this.$root.currentTab == 2"></llct-kotori>
      <llct-player v-bind:key="3" v-if="this.$root.currentTab == 3"></llct-player>
    </transition-group>
  </div>`
})