export const addToQueue = (data: MusicMetadata) => {
  return {
    type: '@llct/player/addToQueue',
    data
  }
}

export const playNow = (data: MusicMetadata) => {
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
