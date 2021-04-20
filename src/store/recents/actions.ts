export const addPlayed = (id: string) => {
  return {
    type: '@llct/recents/addPlayed',
    id
  }
}

export default {
  addPlayed
}