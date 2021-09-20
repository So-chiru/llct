import '@/styles/components/dashboard/live.scss'
import { concatClass } from '@/utils/react'

interface LiveThumbnailProps {
  data: DashboardLiveComponent
}

export const LiveThumbnail = ({ data }: LiveThumbnailProps) => {
  const openPage = () => {
    window.open(data.url, '_blank')
  }

  return (
    <div
      className={concatClass('live-component', data.url && 'clickable')}
      title={`${new Date(data.start).toLocaleString()}에 시작`}
      onClick={() => openPage()}
      onKeyPress={ev => ev.code === 'Enter' && openPage()}
    >
      <div className='background'></div>
      <div className='contents'>
        <span className='day'>
          {`D-` +
            (new Date(
              new Date(data.start).getTime() - new Date().getTime()
            ).getDate() -
              1)}
        </span>
      </div>
    </div>
  )
}

const DashboardLive = ({ data }: { data: DashboardLiveComponent }) => {
  return (
    <div className='dashboard-component live'>
      <LiveThumbnail data={data}></LiveThumbnail>
    </div>
  )
}

export default DashboardLive
