import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { allFrequencies } from './data'

// import SheetMusic from '@slnsw/react-sheet-music';

let cycling = false

function App() {

  const addOscillator = () => {
    const newOscillator = setUpOscillator()
    const newNodes = [nodes, newOscillator].flat()
    setNodes(newNodes)
  }

  const waveShapes = [
    'sine',
    'sawtooth',
    'triangle',
    'square'
  ]

  const context = new AudioContext();

  const setUpOscillator = () => {
    const oscillator = context.createOscillator();
    const gain = context.createGain()
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0
    oscillator.start(0);
    setBpms([bpms, 120].flat())

    return {
      oscillator  : oscillator, 
      gain        : gain
    }
  }

  const [minNoteLength,     setMinNoteLength    ] = useState(125);
  const [maxNoteLength,     setMaxNoteLength    ] = useState(125);
  const [minFrequency ,     setMinFrequency     ] = useState(20);
  const [maxFrequency ,     setMaxFrequency     ] = useState(20000);
  const [minVolume,         setMinVolume        ] = useState(0);
  const [maxVolume,         setMaxVolume        ] = useState(100);
  const [checked,           setChecked          ] = useState(false)
  const [activeNotes,       setActiveNotes      ] = useState([1, 3, 5, 6, 8, 10, 12, 13])
  const [activeScales,      setActiveScales     ] = useState([0,1,2,3,4,5,6,7,8,9,10,11])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')
  const [activeWaveShapes,  setActiveWaveShapes ] = useState(waveShapes)
  const [bpms,               setBpms            ] = useState([])
  const [nodes,             setNodes            ] = useState([])
  // // const [cycling,           setCycling          ] = useState(false)
  
  // // useEffect(() => {
  // //   cycling ? start() : stop()
  // // }, [cycling])

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

  const newNote = () => {
    nodes.map((node, i) => {
      const startTime = Date.now()
      node.nextNoteAt = startTime
      playNote(node, i)
    })
  }

  const playNote = (node, i) => {
    
    if (cycling)  {
      if (Date.now() >= node.nextNoteAt) {
        console.log('node')
        console.log(Date.now() - node.nextNoteAt)
        const minLength   = +document.getElementById('minLength').value
        const maxlength   = +document.getElementById('maxlength').value
        const bpm         = +document.getElementById(`bpm${i}`).value
        const noteLength  = bpm ? 60000/bpm : minLength + (Math.random() * (maxlength - minLength))
        const minVolume   = +document.getElementById('minVolume').value
        const maxVolume   = +document.getElementById('maxVolume').value

        const waveShape   = activeWaveShapes[Math.floor(Math.random() * activeWaveShapes.length)]
        node.oscillator.type   = waveShape

        const frequency   = getRandomFrequency();

        try {
          node.oscillator.frequency.value = frequency
        } catch (error) {
          console.log(error)
        }
        
        const level = (minVolume + Math.random() * (maxVolume - minVolume))/100
        node.gain.gain.value = level
        node.nextNoteAt += noteLength

      }
      setTimeout(() => {playNote(node, i)}, 1)

    } else {
      stop()
    }

  }

  const start = () => {
    setCycleButtonLabel('Stop')
    context.resume()
    newNote()
  }

  const stop = () => {
    setCycleButtonLabel('Start')
    nodes.map(node => {node.gain.gain.value = 0})
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
    cycling = !cycling
    cycling ? start() : stop()
    
  }

  const lengthInputs = [
    {
      label:  'min length',
      id: 'minLength',
      value: minNoteLength,
      action: setMinNoteLength
    },  {
      label:  'max length',
      id: 'maxlength',
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

  return (
    <div>
      RANDOM NOISE GENERATOR{" "}
      <button 
        value="Start/Stop" 
        onClick={handleStartStop}
      >
        {cycleButtonLabel}
      </button>
      {" "}
      <button onClick={addOscillator}>Add Oscillator</button>

      <br />
      {
        nodes.map((node, i) => <div className="node">
          <div className="row">
            <div className="column">
              <input  
                title="BPM"
                id={`bpm${i}`}
                type="number" 
                value={bpms[i]}
                onChange={(e) => +e !== NaN && setBpms(+e.target.value)}
                maxlength={5}
                min={0}
                max={60000}

              />
                
              <span>{" "}OR{" "}</span>
              {
                lengthInputs.map((input, i) => <>
                  <input
                    title={input.label}
                    id={input.id}
                    type="number" 
                    value={input.value}
                    onChange={(e) => +e !== NaN && input.action(+e.target.value)}
                  />
                  {!i && ' ... '}
                </>)
              }
              <br />
              {
                pitchInputs.map(input => <>
                  <input
                    title={input.label}
                    id={input.id}
                    type="number" 
                    value={input.value}
                    onChange={(e) => +e !== NaN && input.action(+e.target.value)}
                    maxlength={5}
                    min={0}
                    max={100000}
                  />
                </>)
              }

              <br />

              {
                volumeInputs.map(input => <>
                  <input
                    title={input.label}
                    id={input.id}
                    type="number" 
                    value={input.value}
                    onChange={(e) => +e !== NaN && input.action(+e.target.value)}
                    min={0}
                    max={100}
                    maxlength={3}
                  />
                </>)
              }

            </div>

            <div className="column">
              Notes
              {
                notes.map(note => 
                  <>
                    <input
                      title={note}
                      type="checkbox"
                      value={note}
                      checked={activeNotes.includes(note)}
                      onChange={handleNoteChange}
                    />
                  </>
                )
              }
              <br />
              Scales
              {
                scales.map(scale =>
                  <>
                    <input
                      title={scale}
                      type="checkbox"
                      value={scale}
                      checked={activeScales.includes(scale)}
                      onChange={handleScaleChange}
                    />
                  </>
                )
              }
              <br />
              Wave Shapes
              { 
                waveShapes.map(waveShape => {
                  return <>
                    <input
                      title={waveShape}
                      type="checkbox"
                      value={waveShape}
                      checked={activeWaveShapes.includes(waveShape)}
                      onChange={handleWaveShapeChange}
                    />
                  </>
                }
                )
              }
            </div>
          </div>
        </div>)
      }
    </div>
  );
}

export default App;
