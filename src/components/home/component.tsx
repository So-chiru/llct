import React from 'react'

import Waves from '../waves/component'

import '../../styles/components/home/home.scss'

interface HomeProps {
  refresh: () => void
  songs: LLCTSongDataV1
}

const Home = ({ refresh }: HomeProps) => {
  return (
    <div className='llct-app'>
      <div onClick={() => refresh()}>목록 새로고침</div>
      <img className="llct-icon" src="/images/logo/Icon.svg"></img>
      <Waves></Waves>
    </div>
  )
}

export default Home
