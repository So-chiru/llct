import '@/styles/components/dashboard/live.scss'
import { concatClass } from '@/utils/react'
import PlaylistCard from '../playlists/playlist-card/container'

import { searchById } from '@/utils/songs'
import playerActions from '@/store/player/actions'
import { useDispatch } from 'react-redux'
import { showPlayer } from '@/store/ui/actions'

export const LiveThumbnail = ({ data }: { data: DashboardLiveComponent }) => {
  const openPage = () => {
    window.open(data.url, '_blank')
  }

  return (
    <div
      className={concatClass('live-component', data.url && 'clickable')}
      title={`${new Date(data.start).toLocaleString()}에 시작`}
      onClick={() => openPage()}
      onKeyPress={ev => ev.code === 'Enter' && openPage()}
    >
      <div className='background'></div>
      <div className='contents'>
        <span className='day'>
          {`D-` +
            (new Date(
              new Date(data.start).getTime() - new Date().getTime()
            ).getDate() -
              1)}
        </span>
      </div>
    </div>
  )
}

const playlistTitle = {
  predict: '예측 플레이리스트',
  actual: '공연 플레이리스트',
}

const playlistDescription = {
  predict: '무슨 곡이 나오는지 알 수는 없지만 예측해보는 플레이리스트입니다.',
  actual: '실제 공연에 나온 곡들입니다. 공연이 진행되면 업데이트됩니다.',
}

const LivePlaylists = ({
  data,
  songs,
}: {
  data: DashboardLiveComponent
  songs: LLCTSongDataV2 | null
}) => {
  const dispatch = useDispatch()

  const playPlaylist = (item: MusicPlaylist) => {
    dispatch(playerActions.playPlaylist(item))
    dispatch(showPlayer(true))
  }

  return (
    <div
      className={concatClass(
        'live-playlist-component',
        data.url && 'clickable'
      )}
      title={`${new Date(data.start).toLocaleString()}에 시작`}
    >
      {data.playlists.map((v, i) => {
        const item: MusicPlaylist = {
          title:
            (v.template && playlistTitle[v.template]) ||
            v.title ||
            '알 수 없는 플레이리스트',
          description:
            (v.template && playlistDescription[v.template]) ||
            v.description ||
            '무슨 플레이리스트가 이래?',
          lastEdit: new Date().toISOString(),
          items:
            (songs &&
              (v.musics
                .map(id => searchById(id, songs))
                .filter(v => v !== null) as MusicMetadataWithID[])) ||
            [],
        }

        if (!v.musics.length) {
          return <></>
        }

        return (
          <PlaylistCard
            editable={false}
            key={`${data.title}-${i}-playlist`}
            item={item}
            onPlay={item => playPlaylist(item)}
          ></PlaylistCard>
        )
      })}
    </div>
  )
}

const DashboardLive = ({
  data,
  songs,
}: {
  data: DashboardLiveComponent
  songs: LLCTSongDataV2 | null
}) => {
  return (
    <div className='dashboard-component live'>
      <LiveThumbnail data={data}></LiveThumbnail>
      <LivePlaylists data={data} songs={songs}></LivePlaylists>
    </div>
  )
}

export default DashboardLive
