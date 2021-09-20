import '@/styles/components/dashboard/link.scss'
import { concatClass } from '@/utils/react'

interface LinkThumbnailProps {
  data: DashboardLinkComponent
}

export const LinkThumbnail = ({ data }: LinkThumbnailProps) => {
  const openPage = () => {
    window.open(data.link, '_blank')
  }

  return (
    <div
      className={concatClass('link-component', data.link && 'clickable')}
      onClick={() => openPage()}
      onKeyPress={ev => ev.code === 'Enter' && openPage()}
    >
      <div className='contents'>
        <p className='title'>{data.title}</p>
        <p className='description'>{data.description}</p>
      </div>
    </div>
  )
}

const DashboardLink = ({ data }: { data: DashboardLinkComponent[] }) => {
  return (
    <div className='dashboard-component link'>
      {data.map(v => (
        <LinkThumbnail key={`link-${v.title}`} data={v}></LinkThumbnail>
      ))}
    </div>
  )
}

export default DashboardLink
