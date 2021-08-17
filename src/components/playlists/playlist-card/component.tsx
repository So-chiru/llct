import MusicCardContainer from '@/components/music-card/container'
import '@/styles/components/playlists/playlist-card.scss'
import { concatClass } from '@/utils/react'
import { songsDuration } from '@/utils/songs'

interface PlaylistCardComponentProps {
  item?: MusicPlaylist
  skeleton?: boolean
  foldable?: boolean
  folded?: boolean
  onFoldStateChange?: () => void
}

interface PlaylistCardImageGroupProps {
  items: MusicMetadataWithID[]
}

const MAX_IMAGE_DISPLAY = 3

const PlaylistCardImageGroup = ({ items }: PlaylistCardImageGroupProps) => {
  return (
    <div className='llct-playlist-image-group'>
      {items.slice(0, MAX_IMAGE_DISPLAY).map((v, i) => (
        <img key={v.id + i} src={v.image} style={{ zIndex: 1000 - i }}></img>
      ))}
      <span className='text'>
        {items.length > MAX_IMAGE_DISPLAY &&
          `+${items.length - MAX_IMAGE_DISPLAY}`}
      </span>
    </div>
  )
}

export const PlaylistCardComponent = ({
  item,
  skeleton = false,
  folded = true,
  foldable = true,
  onFoldStateChange
}: PlaylistCardComponentProps) => {
  if (skeleton || !item) {
    return <div className='llct-playlist-card skeleton'></div>
  }

  return (
    <div
      className='llct-playlist-card'
      onClick={() => foldable && onFoldStateChange && onFoldStateChange()}
      data-folded={folded}
    >
      <div className='summary'>
        <div className='brief-summary'>
          <h3 className='title'>{item.title}</h3>
          <span className='description'>{item.description}</span>
        </div>
        <div className='rich-summary'>
          <div className='section length'>
            <span>총 {(songsDuration(item.items) / 60).toFixed(1)}분</span>
          </div>
          {folded && (
            <div className='section musics'>
              <PlaylistCardImageGroup
                items={item.items}
              ></PlaylistCardImageGroup>
            </div>
          )}
        </div>
      </div>
      <div className={concatClass('contents', !folded && 'show')}>
        <div className='card-lists'>
          {item.items.map((v, i) => (
            <MusicCardContainer
              key={`${i}-${v.id}`}
              music={v}
              id={v.id}
            ></MusicCardContainer>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlaylistCardComponent
