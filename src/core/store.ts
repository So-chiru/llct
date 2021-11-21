const NAME_SPACE = '@llct/'

export const set = (
  scope: string,
  data: string | number | boolean | { [index: string]: unknown } | unknown
) => {
  let toSet = data

  if (typeof toSet === 'object') {
    toSet = '$O' + JSON.stringify(toSet)
  } else if (typeof toSet === 'boolean') {
    toSet = '$B' + toSet
  } else if (typeof toSet === 'number') {
    toSet = '$N' + toSet
  }

  localStorage.setItem(`${NAME_SPACE}${scope}`, toSet as string)
}

export const get = <T>(scope: string, defaults?: T) => {
  const data = localStorage.getItem(`${NAME_SPACE}${scope}`)

  if (data !== null && data.indexOf('$O') === 0) {
    return JSON.parse(data.slice(2))
  } else if (data !== null && data.indexOf('$B') === 0) {
    return data.slice(2) === 'true'
  } else if (data !== null && data.indexOf('$N') === 0) {
    return Number(data.slice(2))
  }

  if (data === null && typeof defaults !== 'undefined') {
    return defaults
  }

  return data
}

export const remove = (scope: string) => localStorage.removeItem(scope)

export default {
  set,
  get,
  remove,
}
