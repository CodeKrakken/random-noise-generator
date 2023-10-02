export default function Header(props) {

  const { handleStartStop, cycleButtonLabel, addNode, showStart } = props
  return <div>
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
  </div>
}