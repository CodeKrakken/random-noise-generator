import { HeaderProps } from "./types"

export default function Header(props: HeaderProps) {

  const { 
    handleAddVoice,
    handleStartStop,
    showStart,
    cycleButtonLabel
  } = props

  return <>
    octopus{" "}
    <br />
    <br />
    <button 
      value="Add Voice"
      onClick={handleAddVoice}
    >
      Add Voice
    </button>
    
    {
      showStart &&
      <button 
        value="Start/Stop" 
        onClick={handleStartStop}
      >
        {cycleButtonLabel ? 'Stop' : 'Start'}
      </button>
    }
  </>
}