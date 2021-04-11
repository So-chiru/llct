interface LLCTEventBus<T> {
  on: <K extends keyof T>(
    event: K,
    callback: T[K] & ((...args: any[]) => void),
    id?: string
  ) => string
  off: <K extends keyof T>(event: K, uuid: string) => void
  run: <K extends keyof T>(event: K, id: string, ...args: any[]) => void
  runAll: <K extends keyof T>(event: K, ...args: any[]) => void
}
