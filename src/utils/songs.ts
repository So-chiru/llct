import { groupColors } from '@/styles/colors'

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

  if (!obj.color) {
    obj.color = groupColors[group]
  }

  // 저장된 데이터에 image 필드가 없을 경우 추가함
  if (!obj.image) {
    obj.image = coverImageURL(group, index)
  }

  return obj
}

/**
 * 주어진 ID를 파싱하여 [그룹, 노래 인덱스] 형식의 값을 반환합니다.
 *
 * @param id 파싱할 ID 문자열
 */
export const parseId = (id: string): [number, number] => {
  return [Number(id[0]), Number(id.slice(1, id.length))]
}

/**
 * 주어진 store에서 해당하는 ID를 가진 MusicMetadata 객체를 찾아 적절히 처리한 후 반환합니다.
 * @param id 곡의 ID (최소 2자리)
 * @param store
 */
export const searchById = (
  id: string,
  store: LLCTSongDataV2
): MusicMetadataWithID | null => {
  if (id.length < 2) {
    throw new TypeError('id length should greater than 1 letter.')
  }

  if (!store.groups || !store.songs) {
    throw new Error('Store is not ready.')
  }

  const parsedId = parseId(id)

  const group = parsedId[0]
  const songId = parsedId[1]

  if (!store.groups[group]) {
    return null
  }

  if (!store.songs[group][songId - 1]) {
    return null
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
    return []
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

    if (typeof id !== 'undefined') {
      const parsedId = parseId(id)
      group = parsedId[0]
      index = parsedId[1]
    }

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
    const foundItem = searchById(`${group}${index}`, store)

    if (!foundItem) {
      return null
    }

    result = makeParsable(foundItem, store, group, index)
  }

  return result
}

export const songsByIdRange = (store: LLCTSongDataV2, ...ids: string[]) => {
  return ids.map(id => searchById(id, store))
}

export const songsDuration = (args: (MusicMetadata | null)[]): number => {
  return (
    args
      .map(v => v && v.metadata?.length)
      .reduce((p, c) => (p ?? 0) + (c ?? 0), 0) || 0
  )
}
