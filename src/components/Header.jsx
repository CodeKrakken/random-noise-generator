export default function Header(props) {

  const { handleStartStop, cycleButtonLabel, addOscillator } = props
  return <div>
    octopus{" "}
    <button 
      value="Start/Stop" 
      onClick={handleStartStop}
    >
      {cycleButtonLabel}
    </button>
    {" "}
    <button onClick={addOscillator}>Add Oscillator</button>
  </div>
}