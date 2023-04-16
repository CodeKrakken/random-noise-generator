import { useState } from 'react';
import './App.css';
import { allFrequencies, waveShapes, intervals } from './content/data'
import snareFile  from './sounds/snare.wav';
import kickFile   from './sounds/kick.wav';
import Node from './components/Node';
import Header from './components/Header';

let cycling = false

function App() {

  const context = new AudioContext();

  // const oscillator = context.createOscillator()
  // const gain = context.createGain()
  // oscillator.connect(gain);
  // gain.connect(context.destination);
  // gain.gain.value = 0
  // oscillator.start(0);
  // const oscillator2 = context.createOscillator()
  // const gain2 = context.createGain()
  // oscillator2.connect(gain2);
  // gain2.connect(context.destination);
  // gain2.gain.value = 0
  // oscillator2.start(0);
  // const oscillator3 = context.createOscillator()
  // const gain3 = context.createGain()
  // oscillator3.connect(gain3);
  // gain3.connect(context.destination);
  // gain3.gain.value = 0
  // oscillator3.start(0);
  // const oscillator4 = context.createOscillator()
  // const gain4 = context.createGain()
  // oscillator4.connect(gain4);
  // gain4.connect(context.destination);
  // gain4.gain.value = 0
  // oscillator4.start(0);
  // const oscillator5 = context.createOscillator()
  // const gain5 = context.createGain()
  // oscillator5.connect(gain5);
  // gain5.connect(context.destination);
  // gain5.gain.value = 0
  // oscillator5.start(0);
  // const oscillator6 = context.createOscillator()
  // const gain6 = context.createGain()
  // oscillator6.connect(gain6);
  // gain6.connect(context.destination);
  // gain6.gain.value = 0
  // oscillator6.start(0);
  // const oscillator7 = context.createOscillator()
  // const gain7 = context.createGain()
  // oscillator7.connect(gain7);
  // gain7.connect(context.destination);
  // gain7.gain.value = 0
  // oscillator7.start(0);
  // const oscillator8 = context.createOscillator()
  // const gain8 = context.createGain()
  // oscillator8.connect(gain8);
  // gain8.connect(context.destination);
  // gain8.gain.value = 0
  // oscillator8.start(0);

  // const demo = [
  //   {
  //     label           : 'Bass',
  //     oscillator      : oscillator, 
  //     gain            : gain,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 60,
  //     minVolume       : 100,
  //     maxVolume       : 100,
  //     activeNotes     : [1, 4, 6, 8, 12, 13],
  //     activeScales    : [1,2],
  //     activeWaveShapes: ['square'],
  //     rest            : 0,
  //     activeIntervals : [1/4, 1/8],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 100,
  //     release         : 1000,
  //     sharpen         : 0
  //   },
  //   {
  //     label           : 'Chord',
  //     oscillator      : oscillator2, 
  //     gain            : gain2,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 50,
  //     maxVolume       : 50,
  //     activeNotes     : [1, 4, 6, 8, 12, 13],
  //     activeScales    : [3,4,5],
  //     activeWaveShapes: ['sine', 'triangle'],
  //     rest            : 0,
  //     activeIntervals : [1],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 1900,
  //     release         : 100,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Chord',
  //     oscillator      : oscillator3, 
  //     gain            : gain3,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 50,
  //     maxVolume       : 50,
  //     activeNotes     : [1, 4, 6, 8, 12, 13],
  //     activeScales    : [3,4,5],
  //     activeWaveShapes: ['sine', 'triangle'],
  //     rest            : 0,
  //     activeIntervals : [1],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 1900,
  //     release         : 100,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Chord',
  //     oscillator      : oscillator4, 
  //     gain            : gain4,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 50,
  //     maxVolume       : 50,
  //     activeNotes     : [1, 4, 6, 8, 12, 13],
  //     activeScales    : [3,4,5],
  //     activeWaveShapes: ['sine', 'triangle'],
  //     rest            : 0,
  //     activeIntervals : [1],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 1900,
  //     release         : 100,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Middle',
  //     oscillator      : oscillator5, 
  //     gain            : gain5,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 50,
  //     maxVolume       : 75,
  //     activeNotes     : [1, 3, 4, 6, 8, 9, 12, 13],
  //     activeScales    : [6,7],
  //     activeWaveShapes: ['triangle'],
  //     rest            : 50,
  //     activeIntervals : [1/2, 1/4],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 100,
  //     release         : 100,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Lead',
  //     oscillator      : oscillator6, 
  //     gain            : gain6,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 75,
  //     maxVolume       : 100,
  //     activeNotes     : [1, 3, 4, 6, 8, 9, 12, 13],
  //     activeScales    : [7,8,9],
  //     activeWaveShapes: ['sine'],
  //     rest            : 50,
  //     activeIntervals : [1/4, 1/8],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     attack          : 100,
  //     release         : 100,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Kick',
  //     oscillator      : oscillator7, 
  //     gain            : gain7,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 0,
  //     maxVolume       : 100,
  //     activeNotes     : [1, 3, 4, 6, 8, 9, 12, 13],
  //     activeScales    : [9],
  //     activeWaveShapes: ['kick'],
  //     rest            : 0,
  //     activeIntervals : [1/4, 1/8],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 0,
  //     sharpen          : 25

  //   },
  //   {
  //     label           : 'Snare',
  //     oscillator      : oscillator8, 
  //     gain            : gain8,
  //     minFrequency    : 20,
  //     maxFrequency    : 20000,
  //     bpm             : 120,
  //     minVolume       : 0,
  //     maxVolume       : 100,
  //     activeNotes     : [1, 3, 4, 6, 8, 9, 12, 13],
  //     activeScales    : [9],
  //     activeWaveShapes: ['snare'],
  //     rest            : 0,
  //     activeIntervals : [1/2],
  //     minNoteLength   : 100,
  //     maxNoteLength   : 100,
  //     offset          : 50,
  //     sharpen          : 25

  //   },
  // ]

  const [nodes,             setNodes            ] = useState([])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState('Start')


  const addOscillator = () => {

    const newOscillator = setUpOscillator()
    const newNodes = [nodes, newOscillator].flat()
    setNodes(newNodes)
  }

  const setUpOscillator = () => {
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, context.currentTime)
    oscillator.start(0);
    const bpm = nodes.length ? nodes[nodes.length-1].bpm : 120
    
    return {
      label           : 'New Oscillator',
      oscillator      : oscillator, 
      gain            : gain,
      minFrequency    : 20,
      maxFrequency    : 20000,
      bpm             : bpm,
      minVolume       : 100,
      maxVolume       : 100,
      activeNotes     : [1, 4, 6, 8, 11, 13],
      activeScales    : [0,1,2,3,4,5,6,7,8,9,10],
      activeWaveShapes: ['triangle', 'sine', 'sawtooth', 'square'],
      rest            : 0,
      activeIntervals : [1/2, 1/4, 1/8, 1/16],
      minNoteLength   : 0,
      maxNoteLength   : 100,
      offset          : 0,
      attack          : 100,
      release         : 1000,
      sharpen         : 0
    }
  }

  const setUpSample = (file) => {
    const sample = new Audio(file)
    const sound = context.createMediaElementSource(sample);
    sound.connect(context.destination)
    return sample
  }

  const snareSample = setUpSample(snareFile)
  const kickSample  = setUpSample(kickFile)
          
  

  


  const getRandomFrequency = (i) => {

    let activeFrequencies = getActiveFrequencies(i) 
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

  const playNote = (node, i) => {
    if (cycling)  {

      if (context.currentTime >= node.nextNoteAt) {
        playSound(node, i)
      } else {
        setTimeout(() => {playSound(node, i)}, (node.nextNoteAt - context.currentTime)*1000)
      }
    }
  }

  const sharpen = (frequency, i) => {
    const sharpen = +document.getElementById(`sharpen${i}`).value
    const ratio = 105.94637142137626184333
    const semitoneUp = frequency / 100 * ratio
    const hzDiff = semitoneUp - frequency
    return frequency + hzDiff / 100 * sharpen
  }

  const playSound = (node, i) => {

    const offset = +document.getElementById(`offset${i}`).value
    
    const bpm         = +document.getElementById(`bpm${i}`).value
    const liveIntervals = Array.from(document.getElementsByClassName(`interval${i}`)).filter(interval => interval.checked)
    const interval = +liveIntervals[Math.floor(Math.random() * liveIntervals.length)].value

    const intervalBpmAdjuster = 4
    const intervalLength  = 60000/bpm * interval * intervalBpmAdjuster
    node.nextNoteAt += intervalLength/1000

    const chanceOfRest        = +document.getElementById(`rest${i}`).value/100
    const diceRoll = Math.random()

    if (diceRoll >= chanceOfRest) {
      const minVolume   = +document.getElementById(`minVolume${i}`).value
      const maxVolume   = +document.getElementById(`maxVolume${i}`).value
      const minLength   = +document.getElementById(`minLength${i}`).value
      const maxLength   = +document.getElementById(`maxLength${i}`).value

      const liveWaves = Array.from(document.getElementsByClassName(`wave${i}`)).filter(wave => wave.checked)

      if (liveWaves) {
        setTimeout(() => {

          const waveShape   = liveWaves[Math.floor(Math.random() * liveWaves.length)].value
          node.oscillator.type   = waveShape
          const level       = ((minVolume + Math.random() * (maxVolume - minVolume))/100)/nodes.length
          let time = context.currentTime
          node.gain.gain.setValueAtTime(0, time)
          const attack  = +document.getElementById(`attack${i}`).value
          const release = +document.getElementById(`release${i}`).value

          node.gain.gain.linearRampToValueAtTime(level, time + attack/1000)

          const timeOfRelease = node.nextNoteAt - release/1000

          const timeToWait = (timeOfRelease - context.currentTime)*1000


          setTimeout(() => {
            const time = context.currentTime
            node.gain.gain.setValueAtTime(level, time)
            node.gain.gain.linearRampToValueAtTime(0, node.nextNoteAt)
          }, timeToWait)


          
          if (
            [
              'sine',
              'triangle',
              'sawtooth',
              'square',
            ]
            .includes(waveShape)
          ) {
            try {
              const frequency   = sharpen(getRandomFrequency(i), i)

              node.oscillator.frequency.value = frequency

              const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
              const noteLength = intervalLength / 100 * noteLengthPercentage

              if (noteLength < intervalLength) {

                setTimeout(() => {node.gain.gain.setValueAtTime(0, context.currentTime)}, noteLength)
          
              }
            } catch (error) {
              console.log(error)
            }
          } else {
            try {
              node.oscillator.frequency.value = 0
              if (waveShape === 'kick'  ) {kickSample.play()}
              if (waveShape === 'snare' ) {snareSample.play()}
            } catch (error) {
              console.log(error.message)
            }
          }
        }, offset / 100 * intervalLength)
      }
    } else {
      node.gain.gain.value = 0
    }
    setTimeout(() => {playNote(node, i)}, node.nextNoteAt - context.currentTime)
  }

  const start = () => {
    setCycleButtonLabel('Stop')
    context.resume()
    nodes.forEach((node, i) => {
      node.nextNoteAt = context.currentTime
      playNote(node, i)
    })
  }

  const stop = () => {
    setCycleButtonLabel('Start')
    nodes.forEach(node => {node.gain.gain.setValueAtTime(0, context.currentTime)})
  }

  const handleStartStop = () => {
    cycling = !cycling
    cycling ? start() : stop()
  }

  const handleDelete = (i, e) => {
    nodes[i].gain.gain.setValueAtTime(0, context.currentTime)
    setNodes(nodes.filter((node, j) => i !== j))
  }

  const notes   = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  const scales  = [0,1,2,3,4,5,6,7,8,9,10]

  return <>
    <div>
      <Header 
        handleStartStop   = {handleStartStop}
        cycleButtonLabel  = {cycleButtonLabel}
        addOscillator     = {addOscillator}
      />

      <br />
      
      {nodes.map((node, i) => 
        <Node 
          node={node} 
          i={i} 
          setNodes    = {setNodes} 
          nodes       = {nodes}
          notes       = {notes}
          scales      = {scales}
          waveShapes  = {waveShapes}
          intervals   = {intervals}
          handleDelete= {handleDelete}
        />
      )}
    </div>
  </>
}

export default App;
