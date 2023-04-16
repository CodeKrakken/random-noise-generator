export default function Header(props) {

  const { handleStartStop, cycleButtonLabel, addOscillator, showStart } = props
  return <div>
    octopus{" "}
    
    <button onClick={addOscillator}>Add Oscillator</button>

    {
      showStart &&
      <button 
        value="Start/Stop" 
        onClick={handleStartStop}
      >
        {cycleButtonLabel}
      </button>
    }
  </div>
}