import Vue from 'vue'
import Vuex from 'vuex'

import { tabModule } from './modules/tab'
import { playerModule } from './modules/player'
import { dataModule } from './modules/data'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    tab: tabModule,
    player: playerModule,
    data: dataModule
  }
})
