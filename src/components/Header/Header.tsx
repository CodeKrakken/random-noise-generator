import { ButtonHTMLAttributes, DetailedHTMLProps, MouseEventHandler, useEffect, useState } from 'react'
import { title, addLabel }                        from '../../content/data'
import { VoiceType }                              from '../shared.types'
import { Hit } from '../../Synth/Synth.types'

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

  return <div className="centred row">{letterArray.map(letter => letter)}</div>
}

export default function Header ({

  handleAddVoice,
  handleImprov,
  improvising,
  replaying,
  voices,
  loadVoices,
  handlePlayback,
  recordedHits

} : {

  handleAddVoice  : React.MouseEventHandler<HTMLButtonElement>
  handleImprov    : React.MouseEventHandler<HTMLButtonElement>
  improvising     : Boolean
  replaying       : Boolean
  voices          : VoiceType[]
  loadVoices      : MouseEventHandler<HTMLButtonElement>,
  handlePlayback  : MouseEventHandler<HTMLButtonElement>
  recordedHits    : Hit[]
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
        onClick   : handleImprov,
        disabled  : disableButtons as boolean || replaying,
        className : "header-button"
      },
      label: letterImages(improvising ? 'Stop' : 'Start', buttonLabelHeight)
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
    },
    {
      props: {
        onClick   : handlePlayback,
        className : "header-button",
        disabled  : improvising || !recordedHits.length
      },
      label: letterImages(replaying ? 'Stop' : 'Replay', buttonLabelHeight)
    }
  ]

  return (
    <div id="header">
      <div id="title">
        {letterImages(title, '50px')}
      </div>
    
      <div className="centred">
        {
          buttons.map((button, i) => 
            <button 
              {
                ...button.props as DetailedHTMLProps<
                  ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement
                >
              } 
              key={`${button.label} ${i}`}
            >
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