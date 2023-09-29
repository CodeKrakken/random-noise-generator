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
      label           : `Oscillator ${nodes.length+1}`,
      oscillator      : oscillator, 
      gain            : gain,
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
      minOffset       : 0,  
      maxOffset       : 0,
      minDetune       : 0,
      maxDetune       : 0,
      minAttack       : 100,
      maxAttack       : 100,
      minRelease      : 1000,
      maxRelease      : 1000,
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

  const newInterval = (i) => {
    if (cycling)  {

      if (context.currentTime >= nodes[i].intervalEnd) {
        runInterval(i)
      } else {
        setTimeout(() => {runInterval(i)}, (nodes[i].intervalEnd - context.currentTime)*1000)
      }
    }
  }

  const getRangeValue = (key, i) => {
    const minValue = +document.getElementById(`min ${key}${i}`).value    
    const maxValue = +document.getElementById(`max ${key}${i}`).value    
    return minValue + (Math.random() * (maxValue - minValue))

  }

  const detune = (frequency, i) => {
    const detune = getRangeValue('detune', i)
    const ratio = 105.94637142137626184333
    const semitoneUp = frequency / 100 * ratio
    const hzDiff = semitoneUp - frequency
    return frequency + hzDiff / 100 * detune
  }

  const getIntervalLength = (i) => {
    const liveIntervals = Array.from(document.getElementsByClassName(`interval${i}`)).filter(interval => interval.checked)
    const interval = +liveIntervals[Math.floor(Math.random() * liveIntervals.length)].value
    const intervalBpmAdjuster = 4
    const bpm             = +document.getElementById(`bpm${i}`).value
    const intervalLength  = 60000/bpm * interval * intervalBpmAdjuster
    return intervalLength/1000
  }

  const isRest = (i) => {
    const chanceOfRest        = +document.getElementById(`rest${i}`).value/100
    const diceRoll = Math.random()
    return diceRoll < chanceOfRest
  }

  const runInterval = (i) => {

    const intervalLength = getIntervalLength(i)
    
    nodes[i].intervalEnd += intervalLength
    const liveWaves = Array.from(document.getElementsByClassName(`wave${i}`)).filter(wave => wave.checked)

    if (isRest(i) || !liveWaves) {

      nodes[i].gain.gain.value = 0

    } else {
      
      const minVolume   = +document.getElementById(`minVolume${i}`).value
      const maxVolume   = +document.getElementById(`maxVolume${i}`).value
      const minLength   = +document.getElementById(`minLength${i}`).value
      const maxLength   = +document.getElementById(`maxLength${i}`).value

      const offset = getRangeValue('offset', i)

      setTimeout(async () => {

        const waveShape       = liveWaves[Math.floor(Math.random() * liveWaves.length)].value
        nodes[i].oscillator.type  = waveShape

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
            const frequency   = detune(getRandomFrequency(i), i)

            nodes[i].oscillator.frequency.value = frequency

            const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
            const noteLength = intervalLength / 100 * noteLengthPercentage

            if (noteLength < intervalLength) {

              setTimeout(() => {nodes[i].gain.gain.setValueAtTime(0, context.currentTime)}, noteLength)
        
            }

            const attackPercentage  = 100 // getRangeValue('attack', i)
            // const release = getRangeValue('release', i)

            const endOfAttack = intervalLength / 100 * attackPercentage
            const level       = ((minVolume + Math.random() * (maxVolume - minVolume))/100)/nodes.length
            let timeSinceStart = context.currentTime

            console.log(nodes[i].gain.gain.setValueAtTime)
            await nodes[i].gain.gain.setValueAtTime(0, 0)
            console.log(nodes[i].gain.gain.value)
            nodes[i].gain.gain.linearRampToValueAtTime(level, context.currentTime + endOfAttack)

            // const timeOfRelease = nodes[i].intervalEnd - intervalLength/1000/100*release
            // const timeToWait = (timeOfRelease - context.currentTime)*1000

            // setTimeout(() => {
            //   const timeSinceStart = context.currentTime
            //   nodes[i].gain.gain.setValueAtTime(level, timeSinceStart)
            //   nodes[i].gain.gain.linearRampToValueAtTime(0, nodes[i].intervalEnd)
            // }, timeToWait)
          } catch (error) {
            console.log(error)
          }
        } else {
          try {
            nodes[i].oscillator.frequency.value = 0
            if (waveShape === 'kick'  ) {kickSample.play()}
            if (waveShape === 'snare' ) {snareSample.play()}
          } catch (error) {
            console.log(error.message)
          }
        }
        
      }, offset / 100 * intervalLength)
    }
    setTimeout(() => {newInterval(i)}, nodes[i].intervalEnd - context.currentTime)
  }

  const start = () => {
    setCycleButtonLabel('Stop')
    context.resume()
    nodes.forEach((node, i) => {
      node.intervalEnd = context.currentTime
      newInterval(i)
    })
  }

  const stop = () => {
    setCycleButtonLabel('Start')
    nodes.map(node => {node.gain.gain.setValueAtTime(0, context.currentTime)})
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
        showStart         = {Boolean(nodes.length)}
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
