import { v4 } from 'uuid'

const createUUID = (): string => {
  return v4()
}

export default class eventBus<T> implements LLCTEventBus<T> {
  lists: Map<keyof T, Map<string, (...args: any[]) => void>>

  constructor () {
    this.lists = new Map()
  }

  on<K extends keyof T> (
    event: K,
    callback: T[K] & ((...args: any[]) => void),
    id?: string
  ): string {
    if (!this.lists.has(event)) {
      this.lists.set(event, new Map())
    }

    const uuid = id || createUUID()

    const lists = this.lists.get(event)!

    if (!id && lists.has(uuid)) {
      return this.on(event, callback)
    }

    lists.set(uuid, callback)

    return uuid
  }

  off<K extends keyof T> (event: K, uuid: string) {
    if (!this.lists.has(event)) {
      return
    }

    return this.lists.get(event)!.delete(uuid)
  }

  run<K extends keyof T> (event: K, id: string, ...args: any[]) {
    if (!this.lists.has(event)) {
      return
    }

    const callback = this.lists.get(event)!.get(id)

    if (callback) {
      callback(...args)
    } else {
      throw new Error(`Given uuid is not exists in ${event} event.`)
    }
  }

  runAll<K extends keyof T> (event: K, ...args: any[]) {
    if (!this.lists.has(event)) {
      return
    }

    this.lists.get(event)!.forEach(callback => {
      callback(...args)
    })
  }
}
