import Vue from 'vue'

import { LLCTTabPointer } from '../../store/modules/tab'

import LLCTSearch from '../tabs/search'
import LLCTChika from '../tabs/chika'
import LLCTAyumu from '../tabs/ayumu'
import LLCTKotori from '../tabs/kotori'
import LLCTPlayer from '../tabs/player'
import LLCTSetsuna from '../tabs/setsuna'

Vue.component('llct-app', {
  components: {
    LLCTSearch,
    LLCTChika,
    LLCTAyumu,
    LLCTKotori,
    LLCTPlayer,
    LLCTSetsuna
  },
  template: `<div class="llct-tabs">
    <div class="llct-tab-title" :class="{active: !tab.hide}">
      <div class="llct-tab-title-in">
        <transition name="llct-tab-title">
          <h1 :key="tab.title" :class="{hidden: tab.hide}">{{tab.title}}</h1>
        </transition>
      </div>
      <i class="material-icons" v-if="is('SETTINGS')" v-on:click="goBack()" tabindex="1" v-on:keypress="ev => ev.keyCode == 13 && goBack()">close</i>
      <i class="material-icons" v-if="!is('SETTINGS')" v-on:click="changeTab(5)" tabindex="2" v-on:keypress="ev => ev.keyCode == 13 && changeTab(5)">settings</i>
    </div>
    <!--<div class="llct-tab-margin" :class="{hidden: tab.hide}"></div>-->
    <transition-group name="llct-tabs" tag="div">
      <LLCTAyumu key="AyumuTab" v-show="is('MAIN')" :current="is('MAIN')"></LLCTAyumu>
      <LLCTChika key="ChikaTab" v-show="is('MUSIC')" :current="is('MUSIC')"></LLCTChika>
      <LLCTKotori key="KotoriTab" v-show="is('PLAYLIST')" :current="is('PLAYLIST')"></LLCTKotori>
      <LLCTSearch key="SearchTab" v-show="is('SEARCH')" :current="is('SEARCH')"></LLCTSearch>
      <LLCTPlayer key="PlayerTab" v-show="is('PLAYER')" :current="is('PLAYER')"></LLCTPlayer>
      <LLCTSetsuna key="SetsunaTab" v-show="is('SETTINGS')" :current="is('SETTINGS')"></LLCTSetsuna>
    </transition-group>
  </div>`,
  computed: {
    tab () {
      return this.$store.state.tab
    }
  },
  methods: {
    is (n) {
      return this.tab.current === LLCTTabPointer[n]
    },
    goBack () {
      this.$store.commit('tab/back')
    },
    changeTab (id) {
      this.$store.commit('tab/changeTo', id)
    }
  }
})
