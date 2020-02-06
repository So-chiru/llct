const LLCTSettingCategory = ['UI', '플레이어', '미디어']
const llctSettingDefault = [
  {
    title: '다크모드 사용',
    id: 'useDarkMode',
    category: 0,
    default: false,
    check: () => {
      return [window.matchMedia('(prefers-color-scheme: dark)').matches, true]
    },
    func: () => {}
  }
]

class LLCTSetting {
  constructor () {
    this.lists = []
  }

  import (obj) {
    if (!obj.id || !obj.title) {
      throw new Error('ID or Title is not defined.')
    }

    if (!obj.category) {
      obj.category = 0
    }

    if (!this.lists[obj.category]) {
      this.lists[obj.category] = []
    }

    if (obj.check) {
      let res = obj.check()

      obj.disabled = res[1] || false
      obj.value = res[0]
    }

    this.lists[obj.category].push(obj)
  }

  get (id) {
    let arr = [].concat.apply([], this.lists)
    let arrIter = arr.length

    while (arrIter--) {
      if (arr[arrIter].id == id) return arr[arrIter].value
    }

    return null
  }
}

const initSetting = () => {
  window.LLCTSettings = new LLCTSetting()

  for (var i = 0; i < llctSettingDefault.length; i++) {
    LLCTSettings.import(llctSettingDefault[i])
  }
}
initSetting()
