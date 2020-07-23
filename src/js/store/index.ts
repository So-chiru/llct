import Vue from 'vue'
import Vuex from 'vuex'

import { tabModule } from './modules/tab.ts'
import { playerModule } from './modules/player.ts'
import { dataModule } from './modules/data.ts'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    tab: tabModule,
    player: playerModule,
    data: dataModule
  }
})
