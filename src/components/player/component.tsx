import '@/styles/components/player/player.scss'

interface PlayerComponentProps {
  show: boolean
  clickOut: () => void
}

const PlayerComponent = ({ show, clickOut }: PlayerComponentProps) => {
  return (
    <>
      <div
        className={'llct-player-background' + (show ? ' show' : '')}
        onClick={clickOut}
      ></div>
      <div className={'llct-player' + (show ? ' show' : '')}>
        <div className='contents'>
          <h1>player</h1>
        </div>
      </div>
    </>
  )
}

export default PlayerComponent
