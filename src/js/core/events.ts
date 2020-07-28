class eventBus {
  events: Object

  /**
   * 이벤트 목록 선언
   */
  constructor () {
    this.events = {}
  }

  /**
   * 이벤트가 실행되면 콜백을 실행할 함수를 등록합니다.
   * @param name 콜백을 등록할 이벤트의 이름
   * @param cb 이벤트 콜백 함수
   * @param key 이벤트 키. 주어진 키가 이벤트 목록 중에 중복되어 있으면 추가를 그만둡니다.
   */
  on (name: string, cb: Function, key?: string) {
    if (!this.events[name]) {
      this.events[name] = []
    }

    var i = this.events[name].length

    while (key && i--) {
      if (this.events[name][i].key == key) return false
    }

    return this.events[name].push({ key, cb })
  }

  /**
   * 이벤트 콜백을 제거합니다.
   * @param name 제거할 이벤트의 이름
   */
  off (name) {
    this.events[name] = {}
  }

  /**
   *
   * @param name 등록된 이벤트 콜백들을 실행합니다.
   * @param params
   */
  run (name: string, ...params: any) {
    if (!this.events[name]) return
    let i = this.events[name].length

    while (i--) {
      this.events[name][i].cb(...params)
    }
  }
}

module.exports = eventBus
