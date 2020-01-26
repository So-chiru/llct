Vue.component('llct-app', {
  template: `<div class="llct-tabs">
    <div class="llct-tab-title">
      <transition name="llct-tab-title" appear>
        <h1 :key="this.$root.title">{{this.$root.title}}</h1>
      </transition>
      <transition name="llct-tab-title" appear>
        <h3 :key="this.$root.desc">{{this.$root.desc}}</h3>
      </transition>
    </div>
    <transition-group name="llct-tabs" appear tag="span">
      <llct-ayumu v-bind:key="0" v-if="this.$root.currentTab == 0"></llct-ayumu>
      <llct-chika v-bind:key="1" v-if="this.$root.currentTab == 1"></llct-chika>
      <llct-kotori v-bind:key="2" v-if="this.$root.currentTab == 2"></llct-kotori>
    </transition-group>
  </div>`
})