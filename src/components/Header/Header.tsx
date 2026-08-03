import { MouseEventHandler, useEffect, useState } from 'react'
import { title, addLabel }                        from '../../content/data'
import { VoiceType }                              from '../shared.types'

const letterImages = (string: string, height: string = "40px") => {

  const letterArray = string.split('').map((letter, i) => 

    /^[A-Z0-9]*$/.test(letter.toUpperCase()) ? (
      <img 
        alt     = {letter} 
        src     = {require(`../../content/letter-images/${letter.toUpperCase()}.png`)} 
        height  = {height} 
        key     = {`${letter}-${i}`} 
      />
    )
      : 
    letter
  )

  return <div className="centred">{letterArray.map(letter => letter)}</div>
}

export default function Header ({

  handleAddVoice,
  handleStartStop,
  running,
  voices,
  loadVoices

} : {

  handleAddVoice  : React.MouseEventHandler<HTMLButtonElement>
  handleStartStop : React.MouseEventHandler<HTMLButtonElement>
  running         : Boolean
  voices          : VoiceType[]
  loadVoices      : MouseEventHandler<HTMLButtonElement>
}) {

  const [disableLoad, setDisableLoad] = useState(false)

  useEffect(() => { setDisableLoad(localStorage.voices ? false : true) }, [])

  

  const handleSave = () => {
    setDisableLoad(false)
    localStorage.voices = JSON.stringify(voices)
  }

  const buttonLabelHeight = "20px"

  const disableButtons = Boolean(voices.length === 0)

  const buttons = [
    { 
      props: {
        onClick   : handleStartStop,
        disabled  : disableButtons as boolean,
        className : "header-button"
      },
      label: letterImages(running ? 'Stop' : 'Start', buttonLabelHeight)
    },
    {
      props: {
        value: addLabel,
        onClick: handleAddVoice,
        className: "header-button"
      },
      label: letterImages('Add', buttonLabelHeight)
    },
    {
      props: {
        onClick   : handleSave,
        disabled  : disableButtons as boolean,
        className : "header-button"
      },
      label: letterImages('Save', buttonLabelHeight)
    },
    {
      props: {
        onClick   : loadVoices,
        disabled  : disableLoad as boolean,
        className : "header-button"
      },
      label: letterImages('Load', buttonLabelHeight)
    }
  ]

  return (
    <div 
      className="column" 
      id="header"
    >
      <div id="title">
        {letterImages(title, '50px')}
      </div>
    
      <div className="centred section">
        {
          buttons.map((button, i) => 
            <button {...button.props} key={`${button.label} ${i}`}>
              {button.label}
            </button>
          )
        }
      </div>
    </div>
  )
}

export {
  letterImages
}