import ButtonComponent from "../controls/button/component"

interface CallEditorComponentProps {
  id: string
}

export const CallEditorComponent = ({ id }: CallEditorComponentProps) => {
  const openButton = () => {
    window.open(`https://editor.lovelivec.kr/?id=${id}`, 'about:blank')
  }

  return (
    <div className='llct-open-editor-wrapper'>
      <p>이 곡의 콜표 작업을 도와주세요!</p>
      <ButtonComponent onClick={openButton}>
        에디터 열기 (외부 사이트)
      </ButtonComponent>
    </div>
  )
}