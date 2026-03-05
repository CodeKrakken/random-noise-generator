import { props } from './types'
import { title } from './data'

export default function Header(props: props) {

  const { 
    addNode,
    handleStartStop,
    showStart,
    cycleButtonLabel
  } = props

  return <>
    {title}{" "}
    
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