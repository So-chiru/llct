import '@/styles/components/dashboard/birthday.scss'
import MusicCardContainer from '../music-card/container'

interface BirthdayProps {
  data: DashboardBirthdayComponent
}

export const DashboardBirthday = ({ data }: BirthdayProps) => {
  return <BirthdayComponent data={data}></BirthdayComponent>
}

interface BirthdayComponentProps {
  data: DashboardBirthdayComponent
}

export const BirthdayComponent = ({ data }: BirthdayComponentProps) => {
  const date = new Date(data.date)

  return (
    <div className='dashboard-component birthday'>
      <div className='title-wrap'>
        <h1 className='title'>
          <span>
            {date.getMonth() + 1}월 {date.getDate()}일,
          </span>
          <br></br>
          <span className='member-color' style={{ color: data.color }}>
            {data.name}
          </span>
          의 생일을 축하합니다!
        </h1>
      </div>
      <div className='card-wrap'>
        {data.musics.length && (
          <MusicCardContainer
            id={data.musics[Math.floor(Math.random() * data.musics.length)]}
          ></MusicCardContainer>
        )}
      </div>
    </div>
  )
}

export default DashboardBirthday
