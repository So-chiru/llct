import PlayerBannerComponent from './component'

interface PlayerBannerContainerProps {
  id: keyof LLCTCallMetadata['flags']
}

const BannerTitle: Record<keyof LLCTCallMetadata['flags'], string> = {
  singAlong: '따라 부르는 곡',
  notPerformed: '아직 연주되지 않은 곡',
  notAccurate: '정확하지 않을 수 있는 콜'
}

const BannerDescription: Record<keyof LLCTCallMetadata['flags'], string> = {
  singAlong: '가사 및 지시에 맞춰 따라 부르셔도 됩니다.',
  notPerformed: '아직 라이브에서 연주된 적이 없습니다.',
  notAccurate: '콜이 보편적으로 맞지 않을 수 있습니다.'
}

export const PlayerBannerContainer = ({ id }: PlayerBannerContainerProps) => {
  return (
    <PlayerBannerComponent
      title={BannerTitle[id]}
      description={BannerDescription[id]}
    ></PlayerBannerComponent>
  )
}

export default PlayerBannerContainer
