import { v4 } from 'uuid'

const createUUID = (): string => {
  return v4()
}

interface IEventBus<T extends Record<keyof T, (...args: any[]) => unknown>> {
  on: <K extends keyof T>(event: K, callback: T[K], id?: string) => string
  off: <K extends keyof T>(event: K, uuid: string) => void
  run: <K extends keyof T>(
    event: K,
    id: string,
    ...args: Parameters<T[K]>
  ) => void
  runAll: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => void
}

export default class eventBus<
  T extends Record<keyof T, (...args: any[]) => unknown>
> implements IEventBus<T> {
  lists: Map<keyof T, Map<string, (...args: any[]) => void>>

  constructor () {
    this.lists = new Map()
  }

  on<K extends keyof T> (event: K, callback: T[K], id?: string): string {
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

  run<K extends keyof T> (event: K, id: string, ...args: Parameters<T[K]>) {
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

  runAll<K extends keyof T> (event: K, ...args: Parameters<T[K]>) {
    if (!this.lists.has(event)) {
      return
    }

    this.lists.get(event)!.forEach(callback => {
      callback(...args)
    })
  }
}
