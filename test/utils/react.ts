import 'mocha'

import { expect } from 'chai'
import { concatClass } from '../../src/utils/react'

describe('Utils/react', () => {
  describe('concatClass', () => {
    it('should return valid string', () => {
      expect(
        concatClass('test', undefined && 'test1', false && 'test2')
      ).to.equal('test')
    })
  })
})
