import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { allFrequencies } from './data'

// import SheetMusic from '@slnsw/react-sheet-music';

let cycling = false

function App() {

  const addOscillator = (bpm) => {
    const newOscillator = setUpOscillator(bpm)
    const newNodes = [nodes, newOscillator].flat()
    setNodes(newNodes)
  }

  const waveShapes = [
    'sine',
    'triangle',
    'sawtooth',
    'square'
  ]

  const context = new AudioContext();

  const setUpOscillator = (bpm) => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.value = 0
    oscillator.start(0);
    const newBpm = nodes.length ? nodes[nodes.length-1].bpm : 120
    
    return {
      oscillator      : oscillator, 
      gain            : gain,
      minFrequency    : 20,
      maxFrequency    : 20000,
      bpm             : bpm ?? newBpm,
      minNoteLength   : 500,
      maxNoteLength   : 500,
      minVolume       : 0,
      maxVolume       : 100,
      activeNotes     : [1, 3, 5, 6, 8, 10, 12, 13],
      activeScales    : [0,1,2,3,4,5,6,7,8,9,10,11],
      activeWaveShapes: waveShapes
    }
  }
  

  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')
  const [nodes,             setNodes            ] = useState([])

  const getRandomFrequency = (i) => {
    const minFrequency = +document.getElementById(`minFrequency${i}`).value
    const maxFrequency = +document.getElementById(`maxFrequency${i}`).value
    const activeFrequencies = getActiveFrequencies(nodes[i]) 
    const filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*filteredFrequencies.length)

    return filteredFrequencies[randomIndex]
  }

  const getActiveFrequencies = (node) => {

    let currentFrequencies = allFrequencies.filter((scale, i) => node.activeScales.includes(i))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, i) => node.activeNotes.includes(i+1))
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
        const minLength   = +document.getElementById(`minLength${i}`).value
        const maxLength   = +document.getElementById(`maxLength${i}`).value
        const bpm         = +document.getElementById(`bpm${i}`).value
        const noteLength  = bpm ? 60000/bpm : minLength + (Math.random() * (maxLength - minLength))
        const minVolume   = +document.getElementById(`minVolume${i}`).value
        const maxVolume   = +document.getElementById(`maxVolume${i}`).value

        const waveShape   = node.activeWaveShapes[Math.floor(Math.random() * node.activeWaveShapes.length)]
        node.oscillator.type   = waveShape
        const frequency   = getRandomFrequency(i);

        try {
          node.oscillator.frequency.value = frequency
        } catch (error) {
          console.log(error)
        }
        
        const level = (minVolume + Math.random() * (maxVolume - minVolume))/100
        console.log(level)
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
  
  // const handleWaveShapeChange = (e) => {

  //   const toggledWaveShape = e.target.value

  //   if (activeWaveShapes.includes(toggledWaveShape)) {
  //     const toggledWaveShapeIndex = activeWaveShapes.indexOf(toggledWaveShape)
  //     activeWaveShapes.splice(toggledWaveShapeIndex, 1)
  //   } else {
  //     activeWaveShapes.push(toggledWaveShape)
  //   }
  // }

  const handleStartStop = () => {
    cycling = !cycling
    cycling ? start() : stop()
    
  }

  const notes   = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  const scales  = [0,1,2,3,4,5,6,7,8,9,10]

  useEffect(() => {
    setUpSample()
  }, [])

  const setUpSample = async () => {
    addOscillator(64)
  }

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
                  value={node.bpm}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], bpm: +e.target.value}, nodes.slice(i+1)].flat())}
                  maxlength={5}
                  min={0}
                  max={60000}
                />
                  
                <span>{" "}OR{" "}</span>
                
                <input
                  title={'min length'}
                  id={`minLength${i}`}
                  type="number" 
                  value={node.minNoteLength}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], minNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
                />
                ...
                <input
                  title={'max length'}
                  id={`maxLength${i}`}
                  type="number" 
                  value={node.maxNoteLength}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], maxNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
                />
                
                
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

                <input
                  title={'Min volume'}
                  id={`minVolume${i}`}
                  type="number" 
                  value={node.minVolume}
                  onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minVolume: +e.target.value}, nodes.slice(i+1)].flat())}
                  min={0}
                  max={100}
                  maxlength={3}
                />

                ...

                <input
                  title={'Max volume'}
                  id={`maxVolume${i}`}
                  type="number" 
                  value={node.maxVolume}
                  onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxVolume: +e.target.value}, nodes.slice(i+1)].flat())}
                  min={0}
                  max={100}
                  maxlength={3}
                />
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
                        checked={node.activeNotes?.includes(note)}
                        onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeNotes: node.activeNotes.includes(+e.target.value) ? node.activeNotes.filter(note => note !== +e.target.value) : [node.activeNotes, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
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
                        checked={node.activeScales.includes(scale)}
                        onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeScales: node.activeScales.includes(+e.target.value) ? node.activeScales.filter(note => note !== +e.target.value) : [node.activeScales, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
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
                        checked={node.activeWaveShapes.includes(waveShape)}
                        onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeWaveShapes: node.activeWaveShapes.includes(e.target.value) ? node.activeWaveShapes.filter(waveShape => waveShape !== e.target.value) : [node.activeWaveShapes, e.target.value].flat()}, nodes.slice(i+1)].flat())}
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
