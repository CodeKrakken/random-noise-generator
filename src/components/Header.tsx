type props = {
  addNode         : React.MouseEventHandler<HTMLButtonElement>
  handleStartStop : React.MouseEventHandler<HTMLButtonElement>
  cycleButtonLabel: Boolean
  showStart       : Boolean
}

export default function Header(props: props) {

  const { handleStartStop, cycleButtonLabel, addNode, showStart } = props
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