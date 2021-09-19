import '@/styles/components/home/birthday.scss'

interface BirthdayProps {
  data: DashboardBirthdayComponent
}

export const Birthday = ({ data }: BirthdayProps) => {
  return <BirthdayComponent data={data}></BirthdayComponent>
}

interface BirthdayComponentProps {
  data: DashboardBirthdayComponent
}

export const BirthdayComponent = ({ data }: BirthdayComponentProps) => {
  return (
    <div className='llct-dashboard-component'>
      <h1>{data.name}의 생일을 축하합니다!</h1>
    </div>
  )
}

export default Birthday
