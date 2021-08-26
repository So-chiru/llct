export const validateName = (name: unknown): name is string => {
  return typeof name === 'string' && name.length > 0 && name.length < 64
}

export const idify = (playlist: MusicPlaylist): MusicPlaylistData => {
  return {
    ...playlist,
    items: playlist.items.map(v => v.id)
  }
}

export const exportPlaylist = (playlist: MusicPlaylistData): string => {
  const { title, description, items } = playlist

  if (title.length > 256) {
    throw new Error('Length of title should be lesser than 256.')
  }

  if (description && description.length > 256) {
    throw new Error('Length of title should be lesser than 256.')
  }

  const bufferArray = []

  const version = 0x00
  bufferArray.push(version)

  const nameBuf = Buffer.from(title)
  bufferArray.push(nameBuf.length)

  let descriptionBuf
  if (typeof description !== 'undefined') {
    descriptionBuf = Buffer.from(description)

    bufferArray.push(descriptionBuf.length)
  } else {
    bufferArray.push(0x00)
  }

  bufferArray.push(...nameBuf)
  if (descriptionBuf) {
    bufferArray.push(...descriptionBuf)
  }

  const itemsBuf = Buffer.from([
    ...items.map(v => [Number(v[0]), Number(v.slice(1, v.length))]).flat()
  ])

  bufferArray.push(...itemsBuf)

  return Buffer.from(bufferArray).toString('base64')
}

const parsePlaylistString = (str: string) => {
  const a = Buffer.from(str, 'base64')
  const view = new Uint8Array(a)

  const version = view[0]

  // 과연 버전이 10 이상 올라갈까??
  if (version > 10) {
    throw new Error('올바르지 않은 플레이리스트 데이터입니다.')
  }

  if (version === 0x00) {
    const titleLength = view[1]
    const descriptionLength = view[2]
    let pointer = 3
    const title = Buffer.from(
      view.slice(pointer, pointer + titleLength)
    ).toString('utf8')

    pointer += titleLength

    let description
    if (descriptionLength) {
      description = Buffer.from(
        view.slice(pointer, pointer + descriptionLength)
      ).toString('utf8')
      pointer += descriptionLength
    }

    const itemsRaw = view.slice(pointer, view.length)
    const items = []

    for (let i = 0; i < itemsRaw.length / 2; i++) {
      const start = i * 2
      items.push(`${itemsRaw[start]}${itemsRaw[start + 1]}`)
    }

    return {
      version,
      titleLength,
      descriptionLength,
      title,
      description,
      items
    }
  } else throw new Error('Unsupported playlist data version.')
}

export const importPlaylist = (str: string): MusicPlaylistData => {
  const data = parsePlaylistString(str)

  if (data.version === 0x00) {
    return {
      title: data.title,
      description: data.description,
      lastEdit: new Date().toISOString(),
      items: data.items
    }
  } else throw new Error('Unsupported playlist data version.')
}

const newPlaylistData = (name: string): MusicPlaylistData => {
  return {
    title: name,
    lastEdit: new Date().toISOString(),
    items: []
  }
}

const checkExists = (state: LLCTPlaylistDataV1 | null, name: string) => {
  if (!state) {
    return false
  }

  for (let i = 0; i < state.playlists.length; i++) {
    if (state.playlists[i].title === name) {
      return true
    }
  }

  return false
}

const playlistUtils = {
  validateName,
  idify,
  newPlaylistData,
  checkExists,
  exportPlaylist,
  importPlaylist
}

export default playlistUtils
