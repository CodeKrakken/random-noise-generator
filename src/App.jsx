import { useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { scales } from './data';

function App() {

  const context = new AudioContext();

  const oscillator10 = context.createOscillator();

  const gain10 = context.createGain()

  oscillator10.connect(gain10);

  gain10.connect(context.destination);

  gain10.gain.value = 0

  oscillator10.start(0);

  let cycling = false

  let i = 0

  const waveTypes = [
    'sine',
    'sawtooth',
    'triangle',
    'square'
  ]

  const [minNoteLength, setMinNoteLength] = useState(125);
  const [maxNoteLength, setMaxNoteLength] = useState(125);
  const [minFrequency , setMinFrequency ] = useState(20);
  const [maxFrequency , setMaxFrequency ] = useState(20000);
  const [checked,       setChecked      ] = useState(false)
  const [activeKeys,    setActiveKeys   ] = useState([])

  const getRandomFrequency = () => {
    const minFrequency = +document.getElementById('minFrequency').value
    const maxFrequency = +document.getElementById('maxFrequency').value
    const activeFrequencies = getActiveFrequencies() 

    let filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*filteredFrequencies.length)

    return filteredFrequencies[randomIndex]
  }

const getActiveFrequencies = () => {

  const activeScales = {}

  activeKeys.map(key => {
    activeScales[key] = scales[key]
  })

  console.log(activeScales)

  // console.log(scales)
  // console.log(activeScales)
  
  const frequencyArray = Object.keys(activeScales).map(key => scales[key].major).flat(Infinity)

  return frequencyArray
}

  const stopNote = () => {
    gain10.gain.value = 0
    playNote()
  }

  const playNote = function(e) {
    if (cycling)  {
      const minLength = +document.getElementById('minLength').value
      const maxLength = +document.getElementById('maxLength').value
      const noteLength = minLength + (Math.random() * (maxLength - minLength))
      const waveType = waveTypes[Math.floor(Math.random() * 4)]
      oscillator10.type = waveType
      const frequency = getRandomFrequency();
      console.log(frequency)
      oscillator10.frequency.value = frequency
      const level = Math.random()
      gain10.gain.value = level
      setTimeout(stopNote, noteLength)
    }
  }

  const start = () => {
    cycling = true
    context.resume()
    playNote()
  }
  
  const startStop = () => {
    if (cycling) {
      gain10.gain.value = 0
      cycling = false
    } else {
      start()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleChange = (e) => {

    setChecked(!checked)
    const toggledKey = e.target.value

    if (activeKeys.includes(toggledKey)) {
      const toggledKeyIndex = activeKeys.indexOf(toggledKey)
      activeKeys.splice(toggledKeyIndex, 1)
    } else {
      activeKeys.push(toggledKey)
    }
  }

  const inputs = [
    {
      id: 'minLength',
      value: minNoteLength,
      action: setMinNoteLength
    },  {
      id: 'maxLength',
      value: maxNoteLength,
      action: setMaxNoteLength
    },  {
      id: 'minFrequency',
      value:  minFrequency,
      action: setMinFrequency
    },  {
      id: 'maxFrequency',
      value:  maxFrequency,
      action: setMaxFrequency
    }
  ]

  return (
    <div>
      RANDOM NOISE GENERATOR
      <button value="Start/Stop" onClick={startStop}>Start/Stop</button>
      <form onSubmit={handleSubmit}>
        {
          inputs.map(input => 
            <input
              id={input.id}
              type="number" 
              value={input.value}
              onChange={(e) => +e !== NaN && input.action(+e.target.value)}
            />
          )
        }
      </form>
      <input 
        type="checkbox"
        value="C"
        checked={checked}
        onChange={handleChange}
      />
    </div>
  );
}

export default App;
