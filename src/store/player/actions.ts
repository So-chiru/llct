import { MusicPlayerState } from '@/@types/state'

export const addToQueue = (data: MusicMetadataWithID) => {
  return {
    type: '@llct/player/addToQueue',
    data
  }
}

export const playNow = (data: MusicMetadataWithID) => {
  return {
    type: '@llct/player/playNow',
    data
  }
}

export const setPointer = (data: number) => {
  return {
    type: '@llct/player/setPointer',
    data
  }
}

export const setPlayState = (number: MusicPlayerState) => {
  return {
    type: '@llct/player/setState',
    data: number
  }
}

export const setInstance = (data: LLCTAudioStack) => {
  return {
    type: '@llct/player/setInstance',
    data
  }
}
