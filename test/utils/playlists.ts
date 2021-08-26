import 'mocha'

import { expect } from 'chai'
import playlistUtils from '../../src/utils/playlists'

describe('Utils/playlists', () => {
  const testItems = [
    '11',
    '22',
    '33',
    '219',
    '321',
    '1129',
    '1130',
    '190',
    '090'
  ]

  const encodedStringFirst = 'AAQAdGVzdAEBAgIDAwITAxUBgQGCAVoAWg=='
  const encodedStringSecond =
    'AAkT7YWM7Iqk7Yq47YWM7Iqk7Yq47J6F64uI64ukLgEBAgIDAwITAxUBgQGCAVoAWg=='

  describe('exportPlaylist', () => {
    it('should return valid string #1', () => {
      const name = 'test'
      const playlist = playlistUtils.newPlaylistData(name)

      playlist.items = testItems
      const exported = playlistUtils.exportPlaylist(playlist)

      expect(exported).to.be.equal(encodedStringFirst)
    })

    it('should return valid string #2', () => {
      const exported = playlistUtils.exportPlaylist({
        title: '테스트',
        description: '테스트입니다.',
        lastEdit: new Date().toISOString(),
        items: testItems
      })

      expect(exported).to.be.equal(encodedStringSecond)
    })
  })

  describe('importPlaylist', () => {
    it('should return valid MusicPlaylistData #1', () => {
      const imported = playlistUtils.importPlaylist(encodedStringFirst)

      expect(imported.title).to.be.equal('test')
      expect(imported.description).to.be.equal(undefined)
      expect(imported.items).to.have.ordered.members(testItems)
    })

    it('should return valid MusicPlaylistData #2', () => {
      const imported = playlistUtils.importPlaylist(encodedStringSecond)

      expect(imported.title).to.be.equal('테스트')
      expect(imported.description).to.be.equal('테스트입니다.')
      expect(imported.items).to.have.ordered.members(testItems)
    })
  })
})
