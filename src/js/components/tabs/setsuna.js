import LLCTCheckbox from '../checkbox'
import LLCTButton from '../button'
import settings from '../../core/settings'

export default {
  components: {
    LLCTCheckbox,
    LLCTButton
  },
  template: `<div class="llct-tab" id="tab5">
    <div class="setsuna-info">
      <div class="header">
        <h1>LLCT</h1>
        <h3>LoveLive Call Table</h3>
      </div>
      <div class="bottom">
        <p class="mute">© 2010-2020 by PL!, PL!S, PL!N, BUSHI, SUNRISE, KLabGames. Not related with this site / project.</p>
        <br>
        <p>Open source project with <i class="material-icons">favorite</i></p>
        <p class="link" v-on:click="open('https://github.com/So-chiru/LLCT')">Github Repository <i class="material-icons">exit_to_app</i></p>
        <p class="link" v-on:click="open('https://github.com/So-chiru/LLCT/blob/master/LICENSE')">Site Code License <i class="material-icons">exit_to_app</i></p>
      </div>
    </div>
    <div class="setsuna-in">
      <div class="setsuna-section" v-for="(categoryList, categoryIndex) in settings.categories">
        <h3>{{settings.categories[categoryIndex]}}</h3>
        <div class="setsuna-options">
          <div class="setsuna-option" v-for="(item, index) in settings.lists[categoryIndex]">
            <div class="info">
              <p>{{item.title}}</p>
              <p class="muted" v-html="item.desc"></p>
            </div>
            <div class="control">
              <LLCTCheckbox v-if="item.type == 'checkbox'" :id="item.id" :disabled="item.disabled || item.disableAt ? settings.get(item.disableAt) : false" :checked="item.value" :onChange="update"></LLCTCheckbox>
              <LLCTButton v-if="item.type == 'button'" :id="item.id" :disabled="item.disabled || item.disableAt ? settings.get(item.disableAt) : false" :click="update" :text="item.title"></LLCTButton>
              <input type="text" v-if="item.type == 'text'" :data-id="item.id" :disabled="item.disabled || item.disableAt ? settings.get(item.disableAt) : false" :value="item.value" v-on:change="update"></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  props: ['current'],
  computed: {
    settings () {
      return settings
    }
  },
  watch: {
    settings (v) {
      this.update(v)
    }
  },
  methods: {
    update (ev) {
      if (!ev.target) {
        return
      }

      settings.set(
        ev.target.dataset.id,
        ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
      )
    },

    open (link) {
      window.open(link, '_blank')
    }
  }
}
