export const load = (id: string) => {
  return {
    type: '@llct/api_call/request',
    id
  }
}
