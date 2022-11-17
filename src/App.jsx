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
    const newBpm = bpms.length ? bpms[bpms.length-1] : 120
    const newBpms = [bpms, newBpm].flat()
    setBpms(newBpms)

    return {
      oscillator  : oscillator, 
      gain        : gain,
      minFrequency: 20,
      maxFrequency: 20000
    }
  }

  const [minNoteLength,     setMinNoteLength    ] = useState(125);
  const [maxNoteLength,     setMaxNoteLength    ] = useState(125);
  const [minVolume,         setMinVolume        ] = useState(0);
  const [maxVolume,         setMaxVolume        ] = useState(100);
  const [checked,           setChecked          ] = useState(false)
  const [activeNotes,       setActiveNotes      ] = useState([1, 3, 5, 6, 8, 10, 12, 13])
  const [activeScales,      setActiveScales     ] = useState([0,1,2,3,4,5,6,7,8,9,10,11])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')
  const [activeWaveShapes,  setActiveWaveShapes ] = useState(waveShapes)
  const [bpms,               setBpms            ] = useState([])
  const [nodes,             setNodes            ] = useState([])

  const getRandomFrequency = (i) => {
    const minFrequency = +document.getElementById(`minFrequency${i}`).value
    const maxFrequency = +document.getElementById(`maxFrequency${i}`).value
    const activeFrequencies = getActiveFrequencies() 
    const filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
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
        console.log(`Latency: ${Date.now() - node.nextNoteAt} ms`)
        const minLength   = +document.getElementById('minLength').value
        const maxlength   = +document.getElementById('maxlength').value
        const bpm         = +document.getElementById(`bpm${i}`).value
        const noteLength  = bpm ? 60000/bpm : minLength + (Math.random() * (maxlength - minLength))
        const minVolume   = +document.getElementById('minVolume').value
        const maxVolume   = +document.getElementById('maxVolume').value

        const waveShape   = activeWaveShapes[Math.floor(Math.random() * activeWaveShapes.length)]
        node.oscillator.type   = waveShape

        const frequency   = getRandomFrequency(i);

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
        nodes.map((node, i) => {
          
          return <div className="node">
            <div className="row">
              <div className="column">
                <input  
                  title="BPM"
                  id={`bpm${i}`}
                  type="number" 
                  value={bpms[i]}
                  onChange={(e) => setBpms([bpms.slice(0,i), +e.target.value, bpms.slice(i+1)].flat())}
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

                <input
                  title='Min pitch'
                  id={`minFrequency${i}`}
                  type="number" 
                  value={node.minFrequency}
                  onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minFrequency: +e.target.value}, nodes.slice(i+1)].flat())}
                  maxlength={5}
                  min={0}
                  max={100000}
                />

                <input
                  title='Max pitch'
                  id={`maxFrequency${i}`}
                  type="number" 
                  value={node.maxFrequency}
                  onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxFrequency: +e.target.value}, nodes.slice(i+1)].flat())}
                  maxlength={5}
                  min={0}
                  max={100000}
                />

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
          </div>
        })
      }
    </div>
  </>
}

export default App;
