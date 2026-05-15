type props = {
  handleAddVoice         : React.MouseEventHandler<HTMLButtonElement>
  handleStartStop : React.MouseEventHandler<HTMLButtonElement>
  showStart       : Boolean
  cycleButtonLabel: Boolean
}

export default function Header(props: props) {

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