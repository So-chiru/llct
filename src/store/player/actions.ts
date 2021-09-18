import { MusicPlayerState, PlayerLoadState } from '@/@types/state'

export const addToQueue = (data: MusicMetadataWithID) => {
  return {
    type: '@llct/player/addToQueue',
    data
  }
}

export const play = (
  data: MusicMetadataWithID | null,
  pointer?: number | null
) => {
  return {
    type: '@llct/player/play',
    data,
    pointer
  }
}

export const skip = (skip: number) => {
  return {
    type: '@llct/player/both',
    skip
  }
}

export const playPlaylist = (
  data: MusicPlaylist | null,
  pointer?: number | null
) => {
  return {
    type: '@llct/player/playPlaylist',
    data,
    pointer
  }
}

export const setPlayState = (number: MusicPlayerState) => {
  return {
    type: '@llct/player/setState',
    data: number
  }
}

export const setLoadState = (number: PlayerLoadState) => {
  return {
    type: '@llct/player/setLoadState',
    data: number
  }
}

export const setInstance = (data: LLCTAudioStack) => {
  return {
    type: '@llct/player/setInstance',
    data
  }
}

export const setAlbumColor = (data: LLCTColorV2 | null) => {
  return {
    type: '@llct/player/setColor',
    data
  }
}

const playerActions = {
  playPlaylist
}

export default playerActions
