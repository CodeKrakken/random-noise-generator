import { HeaderProps } from "./Header.types"

export default function Header(props: HeaderProps) {

  const { 
    handleAddVoice,
    handleStartStop,
    showStart,
    running
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
        {running ? 'Stop' : 'Start'}
      </button>
    }
  </>
}