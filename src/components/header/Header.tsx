type props = {
  addNode         : React.MouseEventHandler<HTMLButtonElement>
  handleStartStop : React.MouseEventHandler<HTMLButtonElement>
  showStart       : Boolean
  cycleButtonLabel: Boolean
}

export default function Header(props: props) {

  const { 
    addNode,
    handleStartStop,
    showStart,
    cycleButtonLabel
  } = props

  return <>
    octopus{" "}
    
    <button onClick={addNode}>Add Node</button>

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