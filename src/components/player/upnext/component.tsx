interface UpNextComponentProps {
  music: MusicMetadataWithID
  current: boolean
  index: number
  click: (current: boolean, index: number) => void
}

import '@/styles/components/player/upnext.scss'

const UpNextComponent = ({
  music,
  current,
  click,
  index
}: UpNextComponentProps) => {
  return (
    <div
      className='upnext-music'
      key={music.id}
      onClick={() => click(current, index)}
      data-current={current}
    >
      <img className='cover' src={music.image + '?s=75'}></img>
      <div className='info'>
        <p
          className='music-title'
          title={
            music.title + (music['title.ko'] ? ` (${music['title.ko']})` : '')
          }
        >
          {index + 1}. {music.title}
        </p>
        <span className='music-artist' title={music.artist as string}>
          {music.artist}
        </span>
      </div>
    </div>
  )
}

export default UpNextComponent
