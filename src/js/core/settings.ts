if (!window.settings) {
  window.settings = {}
}

interface SettingsObject {
  title: string
  id: string
  desc: string
  category: Number
  check?: Function
  type: string
  disableAt?: string
  disableAtFunc?: Function
  default: Boolean
  func?: Function
}

const llctSettingDefault: Array<SettingsObject> = [
  {
    title: '다크모드 사용',
    desc: '사이트를 어둡게 만듭니다.',
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
    desc: '사이트의 모든 전환 효과를 비활성화합니다.',
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
    desc: '음악 카드, 음악 정보에서 일본어 제목 대신 한글을 표시합니다.',
    id: 'useTranslatedTitle',
    category: 0,
    type: 'checkbox',
    default: false,
    func: v => {
      if (window.app) {
        window.app['$llctDatas'].useTranslatedTitle = v
      }
    }
  },
  {
    title: '사이트 알림 받기',
    desc:
      '가능한 경우 라이브 알림, 다운로드 상태 등을 시스템 알림으로 받습니다.',
    id: 'useNotification',
    category: 0,
    type: 'checkbox',
    disableAtFunc: () => {
      return !('Notification' in window)
    },
    default: false
  },
  {
    title: '곡 플레이어 활성화',
    desc:
      '곡 플레이어를 사용합니다. 비활성화시 노래를 로딩하지 않고 콜만 표시합니다.',
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
    desc: '가사 음 밑에 한글 뜻이 적힌 가사를 표시합니다.',
    id: 'useLyrics',
    category: 1,
    type: 'checkbox',
    default: true
  },
  {
    title: '타임 싱크 콜표 대신 이미지 사용',
    desc:
      '시간에 맞춰 가사가 표시되는 콜표 대신 기존 이미지 방식을 사용합니다.',
    id: 'useImageInstead',
    category: 1,
    type: 'checkbox',
    default: false
  },
  {
    title: '노래 재생시 가감속 효과 사용',
    desc:
      '노래 재생 / 멈춤시 볼륨이 점점 커지거나 작아지는 효과를 사용합니다. (Native에서 사용 불가)',
    id: 'useFadeInOut',
    category: 1,
    disableAt: 'useNativeMode',
    type: 'checkbox',
    default: true,
    func: v => {
      if (window && window.audio) {
        window.audio.useFadeInOut = v
      }
    }
  },
  {
    title: 'Native 플레이어 모드',
    desc:
      'Audio API 대신 기본 HTML5 플레이어를 사용합니다. 자세한 내용은 <a href="https://www.notion.so/lovelivec/4c5a0ae6b02b48a4b37d53b52fbd94a0">LLCT 사용법</a>에서 참고하세요.',
    id: 'useNativeMode',
    category: 1,
    type: 'checkbox',
    default: false,
    func: v => {
      window.location.reload()
    }
  },
  {
    title: '페이지 전반에 사용되는 이미지 활성화',
    desc:
      '노래 카드의 이미지를 표시합니다. 끄면 데이터 절약에 도움이 될 수 있습니다.',
    id: 'useImages',
    category: 2,
    type: 'checkbox',
    default: true,
    func: v => {
      if (window.app) {
        window.app['$llctDatas'].useImages = v
      }
    }
  },
  {
    title: '청색약/맹 모드',
    desc: '색맹 사용자를 위해 가사의 색상을 구분 가능하게 조정 합니다.',
    id: 'useTritanomaly',
    disableAt: 'useMonochromacy',
    category: 2,
    type: 'checkbox',
    default: false,
    func: v => {
      if (!document || !document.querySelector) return

      if (typeof v !== 'undefined') {
        document
          .querySelector('html')
          .classList[v ? 'add' : 'remove']('tritanomaly')
      }
    }
  },
  {
    title: '완전 색맹 모드',
    desc: '색맹 사용자를 위해 가사의 색상을 구분 가능하게 조정 합니다.',
    id: 'useMonochromacy',
    category: 2,
    type: 'checkbox',
    disableAt: 'useTritanomaly',
    default: false,
    func: v => {
      if (!document || !document.querySelector) return

      if (typeof v !== 'undefined') {
        document
          .querySelector('html')
          .classList[v ? 'add' : 'remove']('monochromacy')
      }
    }
  },
  {
    title: '캐시 비우기',
    desc: '사이트에서 사용 중인 캐시 (콜표 이미지, 콜표 텍스트) 를 지웁니다.',
    id: 'clearSiteCache',
    category: 2,
    type: 'button',
    default: false,
    func: () => {
      window.clearCaches()
    }
  }
]

class LLCTSetting {
  lists: Array<Array<SettingsObject>>
  categories: Array<String>

  constructor () {
    this.lists = []
    this.categories = ['UI', '플레이어', '미디어']

    for (var i = 0; i < llctSettingDefault.length; i++) {
      this.import(llctSettingDefault[i])
    }
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

    if (obj.disableAt) {
      if (typeof obj.disableAt === 'function') {
        obj.disabled = obj.disableAt()
      }
    }

    let storageGet = localStorage.getItem('LLCT.' + obj.id)

    if (storageGet) {
      obj.value = JSON.parse(storageGet).value
    }

    if (typeof obj.value === 'undefined') {
      obj.value = obj.default || null
    }

    window.settings[obj.id] = obj.value
    this.lists[obj.category].push(obj)
  }

  get (id?) {
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

  find (id) {
    for (var i = 0; i < this.lists.length; i++) {
      let category = this.lists[i]
      if (!category) continue

      for (var z = 0; z < category.length; z++) {
        if (category[z].id === id) {
          return category[z]
        }
      }
    }

    return null
  }

  set (id, value) {
    let item = this.find(id)
    item['value'] = value

    if (item.func) {
      item.func(value)
    }

    if (item.type !== 'button') {
      window.settings[item.id] = value
      this.save()
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

export default new LLCTSetting()
