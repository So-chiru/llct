import React from 'react'

import Waves from '../waves/component'

interface HomeProps {
  refresh: () => void
  songs: LLCTSongDataV1
}

const Home = ({ refresh }: HomeProps) => {
  return (
    <div className='llct-app'>
      <div onClick={() => refresh()}>목록 새로고침</div>
      <Waves></Waves>
    </div>
  )
}

export default Home
