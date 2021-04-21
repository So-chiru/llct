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

  if (skeleton || !data.items) {
    return <MusicCardComponent skeleton={true}></MusicCardComponent>
  }

  const selectedMetadata = songs.searchFromGivenArguments(
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

  const contextHandler = (ev: MouseEvent) => {
    if (!data.items) {
      return
    }

    const playId = id || `${group}${index}`

    const musicObject = songs.searchById(playId, data.items)

    dispatch(player.addToQueue(musicObject))

    ev.preventDefault()
  }

  return (
    <MusicCardComponent
      music={selectedMetadata}
      group={group}
      index={index}
      onClick={clickHandler}
      onContext={contextHandler}
    ></MusicCardComponent>
  )
}

export default memo(MusicCardContainer)
