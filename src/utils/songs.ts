export const makeParsable = (
  obj: MusicMetadata,
  store: LLCTSongDataV2 | null,
  group: number,
  index: number
): MusicMetadata => {
  if (!store || !store.groups || !store.groups[group]) {
    return obj
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
): MusicMetadata => {
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

  return makeParsable(store.songs[group][songId - 1], store, group, songId)
}

export const coverImageURL = (group?: number, index?: number) => {
  if (typeof group === 'undefined' || typeof index === 'undefined') {
    return `${process.env.API_SERVER}/cover/empty`
  }

  return `${process.env.API_SERVER}/cover/${group}${index}`
}
