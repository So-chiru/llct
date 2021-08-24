interface UpNextComponentProps {
  playlist?: boolean
  music: MusicMetadataWithID
  current: boolean
  index: number
  click: (current: boolean, index: number, playlist?: boolean) => void
}

import { RootState } from '@/store'
import '@/styles/components/player/upnext.scss'
import { useSelector } from 'react-redux'

const UpNextComponent = ({
  playlist,
  music,
  current,
  click,
  index
}: UpNextComponentProps) => {
  const useTranslatedTitle = useSelector(
    (state: RootState) => state.settings.useTranslatedTitle.value
  )

  const availableTitleText =
    useTranslatedTitle && music['title.ko'] ? music['title.ko'] : music.title

  return (
    <div
      className='upnext-music'
      key={music.id}
      onClick={() => click(current, index, playlist)}
      data-current={current}
    >
      <img className='cover' src={music.image + '?s=75'}></img>
      <div className='info'>
        <p className='music-title' title={availableTitleText}>
          {index + 1}. {availableTitleText}
        </p>
        <span className='music-artist' title={music.artist as string}>
          {music.artist}
        </span>
      </div>
    </div>
  )
}

export default UpNextComponent
