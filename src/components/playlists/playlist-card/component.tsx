import MusicCardContainer from '@/components/music-card/container'
import '@/styles/components/playlists/playlist-card.scss'
import playlistUtils from '@/utils/playlists'
import { concatClass } from '@/utils/react'
import { songsDuration } from '@/utils/songs'

interface PlaylistCardComponentProps {
  item?: MusicPlaylist
  skeleton?: boolean
  editMode?: boolean
  foldable?: boolean
  folded?: boolean
  onFoldStateChange?: () => void
  onEditStateChange?: () => void
  onDeleteClick?: () => void
  onValueChange?: (name: string, value: unknown) => void
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

const validateClickEvent = (ev: React.MouseEvent<HTMLDivElement>) => {
  return (
    (ev.target as HTMLElement).tagName !== 'svg' &&
    (ev.target as HTMLElement).tagName !== 'path' &&
    (ev.target as HTMLElement).tagName !== 'INPUT'
  )
}

const EditIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M12.9 6.858l4.242 4.243L7.242 21H3v-4.243l9.9-9.9zm1.414-1.414l2.121-2.122a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414l-2.122 2.121-4.242-4.242z' />
  </svg>
)

const DeleteIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm-8 5v6h2v-6H9zm4 0v6h2v-6h-2zM9 4v2h6V4H9z' />
  </svg>
)

const ExportIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    width='24'
    height='24'
  >
    <path fill='none' d='M0 0h24v24H0z' />
    <path d='M3 19h18v2H3v-2zm10-5.828L19.071 7.1l1.414 1.414L12 17 3.515 8.515 4.929 7.1 11 13.17V2h2v11.172z' />
  </svg>
)

const printExport = (item: MusicPlaylist) => {
  const str = playlistUtils.exportPlaylist(playlistUtils.idify(item))

  if ('share' in navigator) {
    navigator.share({
      text: str
    })

    return
  }

  prompt(
    '아래 문자를 복사하고 다른 기기에서 플레이리스트 불러오기 버튼을 눌러 플레이리스트를 복사할 수 있습니다.',
    str
  )
}

export const PlaylistCardComponent = ({
  item,
  skeleton = false,
  editMode = false,
  folded = true,
  foldable = true,
  onFoldStateChange,
  onEditStateChange,
  onDeleteClick,
  onValueChange
}: PlaylistCardComponentProps) => {
  if (skeleton || !item) {
    return <div className='llct-playlist-card skeleton'></div>
  }

  return (
    <div
      className='llct-playlist-card'
      onClick={ev =>
        foldable &&
        validateClickEvent(ev) &&
        onFoldStateChange &&
        onFoldStateChange()
      }
      data-folded={folded}
    >
      <div className='summary'>
        <div className='brief-summary'>
          <h3 className='title'>
            {editMode ? (
              <input
                type='text'
                value={item.title}
                onChange={ev =>
                  onValueChange && onValueChange('title', ev.target.value)
                }
              ></input>
            ) : (
              item.title
            )}
          </h3>
          <span className='description'>
            {editMode ? (
              <input
                type='text'
                value={item.description}
                onChange={ev =>
                  onValueChange && onValueChange('description', ev.target.value)
                }
              ></input>
            ) : (
              item.description
            )}
          </span>
        </div>
        <div className='rich-summary'>
          <div className='section length'>
            <span>총 {(songsDuration(item.items) / 60).toFixed(1)}분</span>
          </div>
          <div
            className='section button'
            onClick={() => onEditStateChange && onEditStateChange()}
          >
            <span>{EditIcon}</span>
          </div>
          <div
            className='section button'
            onClick={() => onDeleteClick && onDeleteClick()}
          >
            <span>{DeleteIcon}</span>
          </div>
          <div className='section button' onClick={() => printExport(item)}>
            <span>{ExportIcon}</span>
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
