import * as store from '@/core/store'

import { toggleDarkMode } from '@/utils/darkmode'

const SettingsDefault: Record<
  keyof Settings,
  LLCTSetting<Settings[keyof Settings]>
> = {
  useDarkMode: {
    name: '다크모드 사용',
    description: '옵션을 켜면 화면이 어두워져요.',
    type: 'checkbox',
    default: false,
    value: false,
    disabled: false,
    enable: (state: typeof SettingsDefault) => {
      return !state.matchSystemAppearance.value
    },
    onInitial: value => {
      document.documentElement.classList.add('no-transition')

      toggleDarkMode(value as boolean)

      requestAnimationFrame(() => {
        document.documentElement.classList.remove('no-transition')
      })
    }
  },
  matchSystemAppearance: {
    name: '다크모드 - 시스템 설정에 따르기',
    description: '시스템 설정에 따라 화면을 어둡게 할 지 결정해요.',
    type: 'checkbox',
    default: true,
    value: true
  },
  usePlayerColor: {
    name: '플레이어 색상 사용',
    description:
      '플레이어의 배경 색상을 앨범 이미지의 색상에 맞춰 바꿀지를 결정해요.',
    type: 'checkbox',
    default: false,
    value: false
  },
  useAutoScroll: {
    name: '자동 스크롤 사용',
    description: '현재 들리고 있는 가사 부분으로 자동으로 스크롤해요.',
    type: 'checkbox',
    default: true,
    value: true
  },
  useLyrics: {
    name: '가사 사용',
    description: '가능하면 한국어 번역이 적힌 가사를 표시해요.',
    type: 'checkbox',
    default: true,
    value: true
  },
  useTranslatedTitle: {
    name: '번역 제목 사용',
    description: '가능하면 원어 제목 대신에 번역 제목을 사용해요.',
    type: 'checkbox',
    default: false,
    value: false
  },
  useAlbumCover: {
    name: '앨범 커버 사용',
    description:
      '노래 카드와 플레이어에서 앨범 커버를 사용해요. 이 옵션이 꺼져 있으면 데이터가 절약돼요.',
    type: 'checkbox',
    default: true,
    value: true
  },
  audioStack: {
    name: '오디오 스택',
    description:
      '오디오를 재생할 때 사용할 구현 방식이에요. 현재 Advanced 옵션은 불안정하니 Native 옵션 사용을 추천해요.',
    type: 'lists',
    default: 'native',
    lists: [
      {
        name: 'Native',
        id: 'native'
      },
      {
        name: 'Advanced',
        id: 'advanced'
      }
    ],
    value: 'native'
  },
  useServiceWorker: {
    name: '서비스 워커 사용',
    description:
      '브라우저가 지원하는 경우 오프라인 상태에서도 다운받은 콜표를 볼 수 있도록 해주는 서비스 워커 기능을 사용해요.',
    type: 'checkbox',
    enable: () => {
      return 'serviceWorker' in navigator
    },
    default: true,
    value: true
  }
}
;(() => {
  Object.keys(SettingsDefault).forEach(id => {
    const item = SettingsDefault[id as keyof Settings]
    const value = store.get<Settings[keyof Settings]>(id, item.default)

    SettingsDefault[
      id as keyof Settings
    ].value = value as Settings[keyof Settings]

    if (item.onInitial) {
      item.onInitial(value as Settings[keyof Settings])
    }
  })
})()

const SettingsReducer = (
  state = SettingsDefault,
  action: SettingsReducerAction
): typeof SettingsDefault => {
  if (action.type === '@llct/settings/update' && SettingsDefault[action.name]) {
    const item = SettingsDefault[action.name]

    if (typeof item.enable !== 'undefined' && !item.enable(state)) {
      return Object.assign(state, {})
    }

    store.set(action.name, action.data)

    if (item.onChange) {
      item.onChange(action.data)
    }

    const assign = state
    assign[action.name].value = action.data

    return {
      ...assign
    }
  }

  return state
}

export default SettingsReducer
