const LLCTSettingCategory = ['UI', '플레이어', '미디어']
const llctSettingDefault = [
  {
    title: '다크모드 사용',
    id: 'useDarkMode',
    category: 0,
    type: 'checkbox',
    default: false,
    check: () => {
      return [window.matchMedia('(prefers-color-scheme: dark)').matches, false]
    },
    func: v => {
      if (!document || !document.querySelector) return

      if (typeof v !== 'undefined') {
        document.querySelector('html').classList[v ? 'add' : 'remove']('dark')
      }

      let metaColor = document.querySelector('meta[name=theme-color]')
      metaColor.setAttribute('content', v ? '#151515' : '#fff')
    }
  },
  {
    title: '동작 줄이기',
    id: 'reduceMotion',
    category: 0,
    type: 'checkbox',
    default: false,
    check: () => {
      return [
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        false
      ]
    },
    func: v => {
      if (typeof v !== 'undefined' && document && document.querySelector) {
        document
          .querySelector('body')
          .classList[v ? 'add' : 'remove']('reduce-motion')
      }
    }
  },
  {
    title: '번역된 제목 표시',
    id: 'useTranslatedTitle',
    category: 0,
    type: 'checkbox',
    default: false
  },
  {
    title: '곡 플레이어 활성화',
    id: 'usePlayer',
    category: 1,
    type: 'checkbox',
    default: true,
    func: v => {
      if (!v && window && window.audio) {
        window.audio.stop()
      }
    }
  },
  {
    title: '가사 사용',
    id: 'useLyrics',
    category: 1,
    type: 'checkbox',
    default: true
  },
  {
    title: '타임 싱크 콜표대신 이미지 사용',
    id: 'useImageInstead',
    category: 1,
    type: 'checkbox',
    default: false
  },
  {
    title: '페이지 전반에 사용되는 이미지 활성화',
    id: 'useImages',
    category: 2,
    type: 'checkbox',
    default: true
  },
  {
    title: '오프라인 저장 사용 (현재 개발 중)',
    id: 'useOffline',
    category: 2,
    type: 'checkbox',
    default: false
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

    let storageGet = localStorage.getItem('LLCT.' + obj.id)

    if (storageGet) {
      obj.value = JSON.parse(storageGet).value
    }

    if (typeof obj.value === 'undefined') {
      obj.value = obj.default || null
    }

    this.lists[obj.category].push(obj)
  }

  get (id) {
    let arr = [].concat.apply([], this.lists)

    if (!id) {
      return arr
    }

    let arrIter = arr.length

    while (arrIter--) {
      if (!arr[arrIter]) continue

      if (arr[arrIter].id == id) {
        return arr[arrIter].value
      }
    }

    return null
  }

  set (id, value) {
    let done = false

    for (var i = 0; i < this.lists.length; i++) {
      let category = this.lists[i]

      if (!category) continue
      for (var z = 0; z < category.length; z++) {
        let item = category[z]

        if (item.id === id) {
          item.value = value

          if (item.func) {
            item.func(value)
          }

          this.save()

          done = true
          break
        }
      }

      if (done) {
        break
      }
    }
  }

  save () {
    let arr = this.get()
    let arrIter = arr.length

    while (arrIter--) {
      let item = arr[arrIter]

      if (!item) continue
      localStorage.setItem(
        'LLCT.' + item.id,
        JSON.stringify({ value: item.value })
      )
    }
  }
}

const initSetting = () => {
  window.LLCTSettings = new LLCTSetting()

  for (var i = 0; i < llctSettingDefault.length; i++) {
    LLCTSettings.import(llctSettingDefault[i])
  }
}
initSetting()
