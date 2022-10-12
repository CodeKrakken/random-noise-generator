import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { scales } from './data';
import { allFrequencies } from './data'
// import SheetMusic from '@slnsw/react-sheet-music';

let cycling = false

function App() {

  const context = new AudioContext();

  const oscillator10 = context.createOscillator();
  const oscillator20 = context.createOscillator();


  const gain10 = context.createGain()
  const gain20 = context.createGain()

  oscillator10.connect(gain10);
  oscillator20.connect(gain20);


  gain10.connect(context.destination);
  gain20.connect(context.destination);


  gain10.gain.value = 0
  gain20.gain.value = 0

  oscillator10.start(0);
  oscillator20.start(0);

  const waveTypes = [
    'sine',
    'sawtooth',
    'triangle',
    'square'
  ]

  const [minNoteLength,     setMinNoteLength    ] = useState(125);
  const [maxNoteLength,     setMaxNoteLength    ] = useState(125);
  const [minFrequency ,     setMinFrequency     ] = useState(20);
  const [maxFrequency ,     setMaxFrequency     ] = useState(20000);
  const [checked,           setChecked          ] = useState(false)
  const [activeKeys,        setActiveKeys       ] = useState([])
  const [activeNotes,     setActiveNotes    ] = useState([1, 3, 5, 6, 8, 10, 12])
  const [activeScales,      setActiveScales     ] = useState([0,1,2,3,4,5,6,7,8,9,10,11])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')

  const getRandomFrequency = () => {
    const minFrequency = +document.getElementById('minFrequency').value
    const maxFrequency = +document.getElementById('maxFrequency').value
    const activeFrequencies = getActiveFrequencies() 
    let filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*filteredFrequencies.length)

    return filteredFrequencies[randomIndex]
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  const getActiveFrequencies = () => {

    let currentFrequencies = allFrequencies.filter((scale, i) => activeScales.includes(i))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, i) => activeNotes.includes(i+1))
    )

    return filteredFrequencies.flat(Infinity)
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

      try {
        oscillator10.frequency.value = frequency
      } catch (error) {
        console.log(error)
      }
      
      const level = Math.random()
      gain10.gain.value = level
      setTimeout(stopNote, noteLength)
    }
  }

  const start = () => {
    cycling = true
    setCycleButtonLabel('Stop')
    context.resume()
    playNote()
  }
  
  const startStop = () => {
    if (cycling) {
      gain10.gain.value = 0
      cycling = false
      setCycleButtonLabel('Start')
    } else {
      start()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleKeyChange = (e) => {

    setChecked(!checked)
    const toggledKey = e.target.value

    if (activeKeys.includes(toggledKey)) {
      const toggledKeyIndex = activeKeys.indexOf(toggledKey)
      activeKeys.splice(toggledKeyIndex, 1)
    } else {
      activeKeys.push(toggledKey)
    }
  }

  const handleNoteChange = (e) => {

    setChecked(!checked)
    const toggledNote = +e.target.value

    if (activeNotes.includes(toggledNote)) {
      const toggledNoteIndex = activeNotes.indexOf(toggledNote)
      activeNotes.splice(toggledNoteIndex, 1)
    } else {
      activeNotes.push(toggledNote)
    }
  }

  const handleScaleChange = (e) => {

    setChecked(!checked)
    const toggledScale = +e.target.value

    if (activeScales.includes(toggledScale)) {
      const toggledScaleIndex = activeScales.indexOf(toggledScale)
      activeScales.splice(toggledScaleIndex, 1)
    } else {
      activeScales.push(toggledScale)
    }
  }

  const inputs = [
    {
      label:  'Min length',
      id: 'minLength',
      value: minNoteLength,
      action: setMinNoteLength
    },  {
      label:  'Max length',
      id: 'maxLength',
      value: maxNoteLength,
      action: setMaxNoteLength
    },  
    {
      label: 'Min pitch',
      id: 'minFrequency',
      value:  minFrequency,
      action: setMinFrequency
    },  {
      label:  'Max pitch',
      id: 'maxFrequency',
      value:  maxFrequency,
      action: setMaxFrequency
    }
  ]

  const notes = [1,2,3,4,5,6,7,8,9,10,11,12]
  const scales = [0,1,2,3,4,5,6,7,8,9,10]

  return (
    <div>
      RANDOM NOISE GENERATOR
      <button value="Start/Stop" onClick={startStop}>{cycleButtonLabel}</button>
      <form onSubmit={handleSubmit}>
        {
          inputs.map(input => <>
            <label>{input.label}</label>
            <input
              id={input.id}
              type="number" 
              value={input.value}
              onChange={(e) => +e !== NaN && input.action(+e.target.value)}
            />
          </>)
        }
      </form>
      
      <br/>
      Notes
      <br />
      {
        notes.map(note => 
          <>
            <label>{note}</label>
            <input
              type="checkbox"
              value={note}
              checked={activeNotes.includes(note)}
              onChange={handleNoteChange}
            />
          </>
        )
      }
      <br/>
      Scales
      <br/>
      {
        scales.map(scale =>
          <>
            <label>{scale}</label>
            <input
              type="checkbox"
              value={scale}
              checked={activeScales.includes(scale)}
              onChange={handleScaleChange}
            />
          </>
        )
      }

      {/* <SheetMusic
      // Textual representation of music in ABC notation
      // The string below will show four crotchets in one bar
      notation="|EGBF|"
    /> */}
    </div>

    
  );
}

export default App;
