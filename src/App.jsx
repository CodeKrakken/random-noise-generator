import { useState } from 'react';
import './App.css';
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

  const intervals = [1, 1/2, 1/4, 1/8, 1/16]

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
      oscillator        : oscillator, 
      gain              : gain,
      minFrequency      : 20,
      maxFrequency      : 20000,
      bpm               : typeof bpm === 'number' ? bpm : newBpm,
      minNoteLength     : 500,
      maxNoteLength     : 500,
      minVolume         : 0,
      maxVolume         : 100,
      activeNotes       : [1, 4, 6, 8, 11, 13],
      activeScales      : [0,1,2,3,4,5,6,7,8,9,10,11],
      activeWaveShapes  : waveShapes,
      rest              : 50,
      activeIntervals : [1, 1/2, 1/4, 1/8, 1/16]
    }
  }

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.connect(gain);
  gain.connect(context.destination);
  gain.gain.value = 0
  oscillator.start(0);
  const oscillator2 = context.createOscillator()
  const gain2 = context.createGain()
  oscillator2.connect(gain2);
  gain2.connect(context.destination);
  gain2.gain.value = 0
  oscillator2.start(0);
  const oscillator3 = context.createOscillator()
  const gain3 = context.createGain()
  oscillator3.connect(gain2);
  gain3.connect(context.destination);
  gain3.gain.value = 0
  oscillator3.start(0);
  const oscillator4 = context.createOscillator()
  const gain4 = context.createGain()
  oscillator4.connect(gain2);
  gain4.connect(context.destination);
  gain4.gain.value = 0
  oscillator4.start(0);
  const oscillator5 = context.createOscillator()
  const gain5 = context.createGain()
  oscillator5.connect(gain2);
  gain5.connect(context.destination);
  gain5.gain.value = 0
  oscillator5.start(0);
  const oscillator6 = context.createOscillator()
  const gain6 = context.createGain()
  oscillator6.connect(gain2);
  gain6.connect(context.destination);
  gain6.gain.value = 0
  oscillator6.start(0);
  const oscillator7 = context.createOscillator()
  const gain7 = context.createGain()
  oscillator7.connect(gain2);
  gain7.connect(context.destination);
  gain7.gain.value = 0
  oscillator7.start(0);

  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')
  const [nodes,             setNodes            ] = useState([{
    oscillator      : oscillator, 
    gain            : gain,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 75,
    maxVolume       : 75,
    activeNotes     : [1, 4, 6, 8, 11, 13],
    activeScales    : [1,2],
    activeWaveShapes: ['sine'],
    rest            : 25,
    activeIntervals : [1/4, 1/8]

  },
  {
    oscillator      : oscillator2, 
    gain            : gain2,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 50,
    maxVolume       : 50,
    activeNotes     : [1, 4, 6, 8, 11, 13],
    activeScales    : [3,4,5],
    activeWaveShapes: ['sine', 'triangle'],
    rest            : 0,
    activeIntervals : [1]


  },
  {
    oscillator      : oscillator3, 
    gain            : gain3,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 50,
    maxVolume       : 50,
    activeNotes     : [1, 4, 6, 8, 11, 13],
    activeScales    : [3,4,5],
    activeWaveShapes: ['sine', 'triangle'],
    rest            : 0,
    activeIntervals : [1]


  },
  {
    oscillator      : oscillator4, 
    gain            : gain4,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 50,
    maxVolume       : 50,
    activeNotes     : [1, 4, 6, 8, 11, 13],
    activeScales    : [3,4,5],
    activeWaveShapes: ['sine', 'triangle'],
    rest            : 0,
    activeIntervals : [1]
  },
  {
    oscillator      : oscillator5, 
    gain            : gain5,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 50,
    maxVolume       : 75,
    activeNotes     : [1, 3, 4, 6, 8, 9, 11, 13],
    activeScales    : [6,7],
    activeWaveShapes: ['triangle'],
    rest            : 50,
    activeIntervals : [1/2, 1/4]


  },
  {
    oscillator      : oscillator6, 
    gain            : gain6,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 75,
    maxVolume       : 100,
    activeNotes     : [1, 3, 4, 6, 8, 9, 11, 13],
    activeScales    : [7,8,9],
    activeWaveShapes: ['sine'],
    rest            : 50,
    activeIntervals : [1/4, 1/8]


  },
  {
    oscillator      : oscillator7, 
    gain            : gain7,
    minFrequency    : 20,
    maxFrequency    : 20000,
    bpm             : 128,
    minNoteLength   : 500,
    maxNoteLength   : 500,
    minVolume       : 0,
    maxVolume       : 100,
    activeNotes     : [1, 3, 4, 6, 8, 9, 11, 13],
    activeScales    : [9],
    activeWaveShapes: ['sine', 'triangle'],
    rest            : 50,
    activeIntervals : [1/8, 1/16]
  },
])

  const getRandomFrequency = (i) => {
    // const minFrequency = +document.getElementById(`minFrequency${i}`).value
    // const maxFrequency = +document.getElementById(`maxFrequency${i}`).value
    let activeFrequencies = getActiveFrequencies(i) 
    // activeFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)

    return activeFrequencies[randomIndex]
  }

  const getActiveFrequencies = (i) => {

    const activeScales  = Array.from(document.getElementsByClassName(`scale${i}`)).filter(scale => scale.checked).map(scale => { return +scale.value})
    const activeNotes   = Array.from(document.getElementsByClassName(`note${i}` )).filter(note  =>  note.checked).map(note => { return +note.value})

    let currentFrequencies = allFrequencies.filter((scale, j) => activeScales.includes(j))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, j) => activeNotes.includes(j+1))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const newNote = () => {
    nodes.forEach((node, i) => {
      const startTime = Date.now()
      node.nextNoteAt = startTime
      playNote(node, i)
    })
  }

  const playNote = (node, i) => {
    if (cycling)  {
      if (Date.now() >= node.nextNoteAt) {
        // const minLength   = +document.getElementById(`minLength${i}`).value
        // const maxLength   = +document.getElementById(`maxLength${i}`).value
        const bpm         = +document.getElementById(`bpm${i}`).value
        const liveIntervals = Array.from(document.getElementsByClassName(`interval${i}`)).filter(interval => interval.checked)
        const interval = +liveIntervals[Math.floor(Math.random() * liveIntervals.length)].value

        const intervalBpmAdjuster = 4
        const noteLength  = 60000/bpm * interval * intervalBpmAdjuster

        const minVolume   = +document.getElementById(`minVolume${i}`).value
        const maxVolume   = +document.getElementById(`maxVolume${i}`).value

        const liveWaves = Array.from(document.getElementsByClassName(`wave${i}`)).filter(wave => wave.checked)

        const waveShape   = liveWaves[Math.floor(Math.random() * liveWaves.length)].value
        node.oscillator.type   = waveShape

        const chanceOfRest        = +document.getElementById(`rest${i}`).value/100
        const diceRoll = Math.random()
        const frequency   = diceRoll >= chanceOfRest ? getRandomFrequency(i) : 0;

        try {
          node.oscillator.frequency.value = frequency
        } catch (error) {
          console.log(error)
        }
        
        const level = (minVolume + Math.random() * (maxVolume - minVolume))/100
        node.gain.gain.value = level/nodes.length
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
    nodes.forEach(node => {node.gain.gain.value = 0})
  }

  const handleStartStop = () => {
    cycling = !cycling
    cycling ? start() : stop()
    
  }

  const handleDelete = (i, e) => {
    setNodes([
      nodes.slice(0, i), 
      {...nodes[i], gain: {...gain, gain: 0}}, 
      nodes.slice(i+1
    )].flat())
    setNodes(nodes.filter((node, j) => i !== j))
  }

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
                <div className="row inner-row">BPM</div>
                <div className="row inner-row">Min lev</div>
                <div className="row inner-row">Max lev</div>
                <div className="row inner-row">Rest %</div>

              </div>

              <div className="column">
                <div className="row inner-row">
                  <input
                    className='textbox'  
                    title="BPM"
                    id={`bpm${i}`}
                    type="number" 
                    value={node.bpm}
                    onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], bpm: +e.target.value}, nodes.slice(i+1)].flat())}
                    maxlength={5}
                    min={0}
                    max={60000}
                  />
                    
                {/* <span>{" "}OR{" "}</span>
                <label></label>

                <input
                  className='textbox'  
                  title={'min length'}
                  id={`minLength${i}`}
                  type="number" 
                  value={node.minNoteLength}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], minNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
                />
                ...
                <input
                  className='textbox'
                  title={'max length'}
                  id={`maxLength${i}`}
                  type="number" 
                  value={node.maxNoteLength}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], maxNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
                /> */}
                
                
                {/* <br />

                <input
                  className='textbox'
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
                  className='textbox'
                  title='Max pitch'
                  id={`maxFrequency${i}`}
                  type="number" 
                  value={node.maxFrequency}
                  onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxFrequency: +e.target.value}, nodes.slice(i+1)].flat())}
                  maxlength={5}
                  min={0}
                  max={100000}
                /> */}

                </div>
                <div className="row inner-row">
                  <input
                    className='textbox'
                    title={'Min volume'}
                    id={`minVolume${i}`}
                    type="number" 
                    value={node.minVolume}
                    onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minVolume: +e.target.value}, nodes.slice(i+1)].flat())}
                    min={0}
                    max={100}
                    maxlength={3}
                  />
                </div>
                <div className="row inner-row">
                  <input
                    className='textbox'
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
                <div className="row inner-row">
                  <input
                    className='textbox'
                    title={'Rest %'}
                    id={`rest${i}`}
                    type="number" 
                    value={node.rest}
                    onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], rest: +e.target.value}, nodes.slice(i+1)].flat())}
                    min={0}
                    max={100}
                    maxlength={3}
                  />
                </div>
              </div>

              <div className="column">
                <div className="row inner-row">
                  Notes
                </div>
                <div className="row inner-row">
                  Scales
                </div>
                <div className="row inner-row">
                  Waves
                </div>
                <div>
                  Intervals
                </div>
              </div>
              <div className="column">
                <div className="row inner-row">
                  {
                    notes.map(note => 
                      <>
                        <input
                          className={`note${i}`}
                          title={note}
                          type="checkbox"
                          value={note}
                          checked={node.activeNotes?.includes(note)}
                          onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeNotes: node.activeNotes.includes(+e.target.value) ? node.activeNotes.filter(note => note !== +e.target.value) : [node.activeNotes, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                        />
                      </>
                    )
                  }
                </div>
                <div className="row inner-row">
                  {
                    scales.map(scale =>
                      <>
                        <input
                          className={`scale${i}`}
                          title={scale}
                          type="checkbox"
                          value={scale}
                          checked={node.activeScales.includes(scale)}
                          onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeScales: node.activeScales.includes(+e.target.value) ? node.activeScales.filter(note => note !== +e.target.value) : [node.activeScales, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                        />
                      </>
                    )
                  }
                </div>
                <div className="row inner-row">
                  { 
                    waveShapes.map(waveShape => {
                      return <>
                        <input
                          title={waveShape}
                          className={`wave${i}`}
                          type="checkbox"
                          value={waveShape}
                          checked={node.activeWaveShapes.includes(waveShape)}
                          onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeWaveShapes: node.activeWaveShapes.includes(e.target.value) ? node.activeWaveShapes.filter(waveShape => waveShape !== e.target.value) : [node.activeWaveShapes, e.target.value].flat()}, nodes.slice(i+1)].flat())}
                        />
                      </>
                    })
                  }
                </div>
                <div className="row inner-row">
                  { 
                    intervals.map(interval => {
                      return <>
                        <input
                          className={`interval${i}`}
                          title={interval}
                          type="checkbox"
                          value={interval}
                          checked={node.activeIntervals.includes(interval)}
                          onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeIntervals: node.activeIntervals.includes(+e.target.value) ? node.activeIntervals.filter(interval => interval !== +e.target.value) : [node.activeIntervals, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                        />
                      </>
                    })
                  }
                </div>
              </div>
              <div className="column">
                <button 
                  id={`delete-node${i}`} 
                  onClick={(e) => handleDelete(i, e)}
                >X</button>
              </div>
            </div>
          </div>
          
        })
      }
    </div>
  </>
}

export default App;
