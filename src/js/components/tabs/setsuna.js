Vue.component('llct-setsuna', {
  template: `<div class="llct-tab" id="tab4">
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
      <div class="setsuna-section" v-for="(categoryList, categoryIndex) in settings.lists">
        <h3>{{category[categoryIndex]}}</h3>
        <div class="setsuna-options">
          <div class="setsuna-option" v-for="(item, index) in categoryList">
            <p>{{item.title}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  props: ['current'],
  data: () => {
    return {
      settings: window.LLCTSettings,
      category: window.LLCTSettingCategory
    }
  },
  methods: {
    open (link) {
      window.open(link, '_blank')
    }
  }
})
