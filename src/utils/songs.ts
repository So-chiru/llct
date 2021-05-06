export const makeParsable = (
  obj: MusicMetadata,
  store: LLCTSongDataV2 | null,
  group: number,
  index: number
): MusicMetadata => {
  if (!store || !store.groups || !store.groups[group]) {
    return obj
  }

  if (typeof obj.artist === 'object') {
    obj.artist = (obj.artist as number[])
      .map((v: number) => store.groups && store.groups[group].artists[v])
      .join(', ')
  }

  // obj.artist가 숫자인 경우 store.groups 에서 그룹을 가져와 아티스트 이름 적용
  if (typeof obj.artist === 'number') {
    obj.artist = store.groups[group].artists[obj.artist]
  }

  // 저장된 데이터에 image 필드가 없을 경우 추가함
  if (!obj.image) {
    obj.image = coverImageURL(group, index)
  }

  return obj
}

/**
 * 주어진 store에서 해당하는 ID를 가진 MusicMetadata 객체를 찾아 적절히 처리한 후 반환합니다.
 * @param id 곡의 ID (최소 2자리)
 * @param store
 */
export const searchById = (
  id: string,
  store: LLCTSongDataV2
): MusicMetadataWithID => {
  if (id.length < 2) {
    throw new TypeError('id length should greater than 1 letter.')
  }

  if (!store.groups || !store.songs) {
    throw new Error('Store is not ready.')
  }

  const group = Number(id[0])
  const songId = Number(id.slice(1, id.length))

  if (!store.groups[group]) {
    throw new Error("Id's group field is not valid.")
  }

  const parsable = makeParsable(
    store.songs[group][songId - 1],
    store,
    group,
    songId
  )

  return {
    ...parsable,
    id
  }
}

export const coverImageURL = (group?: number, index?: number) => {
  if (typeof group === 'undefined' || typeof index === 'undefined') {
    return `${process.env.API_SERVER}/cover/empty`
  }

  return `${process.env.API_SERVER}/cover/${group}${index}`
}

export const audioURL = (id: string) => {
  return `${process.env.API_SERVER}/audio/${id}`
}

export const randomSongs = (store: LLCTSongDataV2, counts = 1) => {
  if (!store.songs) {
    return
  }

  const results: string[] = []
  const songs = ((store.songs as unknown) as MusicMetadataWithID[][])
    .map((group, groupIndex) => {
      return group.map((song, songIndex) => {
        song.id = `${groupIndex}${songIndex + 1}`

        return song
      })
    })
    .flat(1)

  for (let i = 0; i < counts; i++) {
    const item = songs[Math.floor(Math.random() * songs.length)].id

    if (counts < songs.length && results.filter(v => v === item).length) {
      i--
      continue
    }

    results.push(item)
  }

  return results
}

export const searchFromGivenArguments = (
  store: LLCTSongDataV2,
  music?: MusicMetadata,
  id?: string,
  group?: number,
  index?: number
): MusicMetadata | null => {
  let result = null

  if (music) {
    result = music

    if (typeof index !== 'undefined' && typeof group !== 'undefined') {
      result = makeParsable(music, store, group, index)
    }
  } else if (store && id) {
    result = searchById(id, store)
  } else if (
    store &&
    typeof index !== 'undefined' &&
    typeof group !== 'undefined'
  ) {
    result = makeParsable(
      searchById(`${group}${index}`, store),
      store,
      group,
      index
    )
  }

  return result
}