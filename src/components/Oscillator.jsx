import { useEffect, useState } from "react";
import { allFrequencies } from '../data'

export default function Oscillator(props) {

  const context = props.context
  const oscillator10 = context.createOscillator();
  const gain10 = context.createGain()
  oscillator10.connect(gain10);
  gain10.connect(context.destination);
  gain10.gain.value = 0
  oscillator10.start(0);

  const waveShapes = [
    'sine',
    'sawtooth',
    'triangle',
    'square'
  ]

  const [minNoteLength,     setMinNoteLength    ] = useState(125);
  const [maxNoteLength,     setMaxNoteLength    ] = useState(125);
  const [minFrequency ,     setMinFrequency     ] = useState(20);
  const [maxFrequency ,     setMaxFrequency     ] = useState(20000);
  const [minVolume,         setMinVolume        ] = useState(0);
  const [maxVolume,         setMaxVolume        ] = useState(100);
  const [checked,           setChecked          ] = useState(false)
  const [activeKeys,        setActiveKeys       ] = useState([])
  const [activeNotes,       setActiveNotes      ] = useState([1, 3, 5, 6, 8, 10, 12, 13])
  const [activeScales,      setActiveScales     ] = useState([0,1,2,3,4,5,6,7,8,9,10,11])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')
  const [activeWaveShapes,  setActiveWaveShapes ] = useState(waveShapes)
  const [bpm,               setBpm              ] = useState(120)
  const [cycling,           setCycling          ] = useState(false)

  useEffect(() => {
    cycling ? start() : stop()
  }, [cycling])

  const getRandomFrequency = () => {
    const minFrequency = +document.getElementById('minFrequency').value
    const maxFrequency = +document.getElementById('maxFrequency').value
    const activeFrequencies = getActiveFrequencies() 
    let filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*filteredFrequencies.length)

    return filteredFrequencies[randomIndex]
  }

  const getActiveFrequencies = () => {

    let currentFrequencies = allFrequencies.filter((scale, i) => activeScales.includes(i))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, i) => activeNotes.includes(i+1))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const playNote = function(e) {
    console.log(cycling)

    if (cycling)  {

      const minLength = +document.getElementById('minLength').value
      const maxLength = +document.getElementById('maxLength').value
      const minVolume = +document.getElementById('minVolume').value
      const maxVolume = +document.getElementById('maxVolume').value
      const bpm       = +document.getElementById('bpm').value
      const noteLength = bpm ? 60000/bpm : minLength + (Math.random() * (maxLength - minLength))

      const waveShape = activeWaveShapes[Math.floor(Math.random() * activeWaveShapes.length)]
      oscillator10.type = waveShape

      const frequency = getRandomFrequency();

      try {
        oscillator10.frequency.value = frequency
      } catch (error) {
        console.log(error)
      }
      
      const level = (minVolume + Math.random() * (maxVolume - minVolume))/100
      gain10.gain.value = level

      setTimeout(stopNote, noteLength)
    } else {
      stop()
    }
  }

  const stopNote = () => {
    gain10.gain.value = 0
    playNote()
  }

  const start = () => {
    console.log('started')
    setCycleButtonLabel('Stop')
    context.resume()
    playNote()
  }

  const stop = () => {
    console.log('stopped')
    setCycleButtonLabel('Start')
    gain10.gain.value = 0
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

  const handleWaveShapeChange = (e) => {

    setChecked(!checked)
    const toggledWaveShape = e.target.value


    if (activeWaveShapes.includes(toggledWaveShape)) {
      const toggledWaveShapeIndex = activeWaveShapes.indexOf(toggledWaveShape)
      activeWaveShapes.splice(toggledWaveShapeIndex, 1)
    } else {
      activeWaveShapes.push(toggledWaveShape)
    }
  }

  const handleStartStop = () => {
    setCycling(!cycling)
  }


  const lengthInputs = [
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
    }
  ]

  const pitchInputs = [
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
  
  const volumeInputs = [
    {
      label: 'Min volume',
      id: 'minVolume',
      value:  minVolume,
      action: setMinVolume
    },  {
      label:  'Max volume',
      id: 'maxVolume',
      value:  maxVolume,
      action: setMaxVolume
    }
  ]

  const notes   = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  const scales  = [0,1,2,3,4,5,6,7,8,9,10]

  return <>
    <button 
      value="Start/Stop" 
      onClick={handleStartStop}
    >
      {cycleButtonLabel}
    </button>

    {
      <>
        <label>BPM</label>
        <input  
          id={'bpm'}
          type="number" 
          value={bpm}
          onChange={(e) => +e !== NaN && setBpm(+e.target.value)}
        />
      </>
      
    }
    <span>OR  {" "}</span>
    {
      lengthInputs.map(input => <>
        <label>{input.label}</label>
        <input
          id={input.id}
          type="number" 
          value={input.value}
          onChange={(e) => +e !== NaN && input.action(+e.target.value)}
        />
      </>)
    }
    <br /><br />
    {
      pitchInputs.map(input => <>
        <label>{input.label}</label>
        <input
          id={input.id}
          type="number" 
          value={input.value}
          onChange={(e) => +e !== NaN && input.action(+e.target.value)}
        />
      </>)
    }
    <br /><br />

    {
      volumeInputs.map(input => <>
        <label>{input.label}</label>
        <input
          id={input.id}
          type="number" 
          value={input.value}
          onChange={(e) => +e !== NaN && input.action(+e.target.value)}
          min={0}
          max={100}
        />
      </>)
    }      
    <br />
    <br />
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
    <br /><br />
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
    <br /><br />
    Wave Shapes
    <br />
    {
      waveShapes.map(waveShape => {
        return <>
          <label>{waveShape}</label>
          <input
            type="checkbox"
            value={waveShape}
            checked={activeWaveShapes.includes(waveShape)}
            onChange={handleWaveShapeChange}
          />
        </>
      }
      )
    }
    <br /><br />  
  </>
}