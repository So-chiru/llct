import React from 'react'

import Waves from './waves/component'

const Home: React.FC = (...args) => {
  console.log(args)

  return (
    <div className='llct-app'>
      <Waves></Waves>
    </div>
  )
}

export default Home
