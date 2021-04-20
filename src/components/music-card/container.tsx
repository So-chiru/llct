import { RootState } from '@/store'
import React, { memo } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import MusicCardComponent from './component'

import * as songs from '@/utils/songs'
import { useHistory } from 'react-router-dom'

import recents from '@/store/recents/actions'

import * as player from '@/store/player/actions'
interface MusicCardContainerProps {
  id?: string
  music?: MusicMetadata
  index?: number
  ref?: () => unknown
  group?: number
  skeleton?: boolean
}

// TODO : songs 모듈로 리펙토링 : search(id)
const getMusicFromStore = (
  store: RootState['songs']['items'],
  music?: MusicMetadata,
  id?: string,
  group?: number,
  index?: number
): MusicMetadata | null => {
  let result = null

  if (music) {
    result = music

    if (typeof index !== 'undefined' && typeof group !== 'undefined') {
      result = songs.makeParsable(music, store, group, index)
    }
  } else if (store && id) {
    result = songs.searchById(id, store)
  } else if (
    store &&
    typeof index !== 'undefined' &&
    typeof group !== 'undefined'
  ) {
    result = songs.makeParsable(
      songs.searchById(`${group}${index}`, store),
      store,
      group,
      index
    )
  }

  return result
}

const MusicCardContainer = ({
  id,
  music,
  index,
  group,
  skeleton
}: MusicCardContainerProps) => {
  const instance = useSelector((state: RootState) => state.playing.instance)
  const data = useSelector((state: RootState) => state.songs)
  const history = useHistory()
  const dispatch = useDispatch()

  if (skeleton) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  const selectedMetadata = getMusicFromStore(
    data.items,
    music,
    id,
    group,
    index
  )

  if (!selectedMetadata) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  const clickHandler = () => {
    if (!data.items) {
      return
    }

    const playId = id || `${group}${index}`

    const musicObject = songs.searchById(playId, data.items)

    dispatch(player.play(musicObject))
    dispatch(recents.addPlayed(musicObject.id))

    if (instance) {
      instance.play()
    }

    history.push(`/play/${playId}`, musicObject)
  }

  return (
    <MusicCardComponent
      music={selectedMetadata}
      group={group}
      index={index}
      onClick={clickHandler}
    ></MusicCardComponent>
  )
}

export default memo(MusicCardContainer)
