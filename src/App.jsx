import { useEffect, useState } from 'react';
import './App.css';
import { allFrequencies, waveShapes, intervals } from './content/data'
import snareFile  from './sounds/snare.wav';
import kickFile   from './sounds/kick.wav';
import Node from './components/Node';
import Header from './components/Header';
import RangeSliderComponent from './components/Slider';

let cycling = false

function App() {

  // console.log('App Starting')

  const context = new AudioContext();
  context.resume()

  const [nodes,             setNodes            ] = useState([])
  const [cycleButtonLabel,  setCycleButtonLabel ] = useState(false)

  const addNode = () => {
    // console.log('Adding Node')
    setNodes((nodes) => [nodes, setUpNode()].flat())
  }

  useEffect(() => {
    // console.log('Using Effect')
    if (!active(nodes).length) {
      cycling = false
      setCycleButtonLabel(false)
    }
  }, [nodes])

  const active = (array) => {
    return array.filter(item => item !== 'deleted')
  }

  const setUpNode = () => {
    // console.log('Setting Up Node')
    
    const clonedNode = active(nodes).reverse()[0]

    return {
      label           : clonedNode?.label+1 || 1,
      nextInterval    : 0,
      bpm             : clonedNode?.bpm               ??  120,
      minLevel        : clonedNode?.minLevel          ??  100,
      maxLevel        : clonedNode?.maxLevel          ??  100,
      activeNotes     : clonedNode?.activeNotes       ??  [1,3,5,6,8,10,12,13],
      activeScales    : clonedNode?.activeScales      ??  [4],
      activeWaveShapes: clonedNode?.activeWaveShapes  ??  ['sine'],
      rest            : clonedNode?.rest              ??  0,
      activeIntervals : clonedNode?.activeIntervals   ??  [1/2],
      minNoteLength   : clonedNode?.minNoteLength     ??  100,
      maxNoteLength   : clonedNode?.maxNoteLength     ??  100,
      minOffset       : clonedNode?.minOffset         ??  0,  
      maxOffset       : clonedNode?.maxOffset         ??  0,
      minDetune       : clonedNode?.minDetune         ??  0,
      maxDetune       : clonedNode?.maxDetune         ??  0,
      minFadeIn       : clonedNode?.minFadeIn         ??  100,
      maxFadeIn       : clonedNode?.maxFadeIn         ??  100,
      minFadeOut      : clonedNode?.minFadeOut        ??  100,
      maxFadeOut      : clonedNode?.maxFadeOut        ??  100,
    }
  }

  const setUpSample = (file) => {
    // console.log('Setting Up Sample')
    const sample = new Audio(file)
    const sound = context.createMediaElementSource(sample);
    sound.connect(context.destination)
    return sample
  }

  const snareSample = setUpSample(snareFile)
  const kickSample  = setUpSample(kickFile)

  const handleStartStop = () => {
    // console.log('Handling Start Stop')
    cycling = !cycling
    cycling ? start() : stop()
  }

  const start = () => {
    // console.log('Starting')
    setCycleButtonLabel(true)
    nodes.forEach((node, i) => {
      if (node !== 'deleted') {

        const oscillator  = context.createOscillator()
        const gain        = context.createGain()
    
        oscillator.connect(gain);
        gain.connect(context.destination);
        gain.gain.setValueAtTime(0, 0)
        oscillator.start(0);

        node.oscillator = oscillator
        node.gain       = gain

        node.nextInterval = context.currentTime
        newInterval(i)
      }
    })
  }

  const stop = async () => {
    // console.log('Stopping')
    setCycleButtonLabel(false)
    await active(nodes).map(node => {
      node.gain.gain.setValueAtTime(0, context.currentTime)
      node.oscillator.stop()
    })
    // setNodes((nodes) => nodes.filter(node => node !== 'deleted'))

  }

  const newInterval = (i) => {

    if (cycling && document.getElementsByClassName(`interval${i}`))  {
      if (context.currentTime >= nodes[i].nextInterval) {
        console.log('Running Interval')
        const intervalLength = getIntervalLength(i)

        nodes[i].thisInterval = nodes[i].nextInterval
        nodes[i].nextInterval += intervalLength
        const liveWaves = Array.from(document.getElementsByClassName(`wave${i}`)).filter(wave => wave.checked)

        if (isRest(i) || !liveWaves) {
          nodes[i].gain.gain.setValueAtTime(0,0)

        } else {
          
          const minLevel   = +document.getElementById(`minLevel${i}`)?.value
          const maxLevel   = +document.getElementById(`maxLevel${i}`)?.value
          const minLength   = +document.getElementById(`minLength${i}`)?.value
          const maxLength   = +document.getElementById(`maxLength${i}`)?.value

          const offset = getRangeValue('offset', i)
          let noteLength = intervalLength

          setTimeout(async () => {
            const waveShape       = liveWaves[Math.floor(Math.random() * liveWaves.length)]?.value

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
                noteLength = intervalLength / 100 * noteLengthPercentage

                const fadeInPercentage  = getRangeValue('fade in' , i)
                const fadeOutPercentage = getRangeValue('fade out', i)
                const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0

                const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/nodes.filter(node => node.nextInterval).length
                
                if (noteLength < intervalLength) {
                  setTimeout(() => {nodes[i].gain.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
                }

                if (cycling) {
                  const fadeInDuration  = noteLength  / 100 * fadeInPercentage
                  const fadeOutDuration = noteLength  / 100 * fadeOutPercentage

                  const endOfFadeIn     = nodes[i].thisInterval + fadeInDuration
                  const startOfFadeOut  = nodes[i].nextInterval - fadeOutDuration
                  const peakPoint       = nodes[i].thisInterval + noteLength * peakPercentage / 100

                  if (endOfFadeIn <= startOfFadeOut) {
                    nodes[i].gain.gain.setValueAtTime(nodes[i].gain.gain.value, 0)
                    nodes[i].gain.gain.linearRampToValueAtTime(level, endOfFadeIn)
                    nodes[i].gain.gain.setValueAtTime(level, startOfFadeOut)
                    nodes[i].gain.gain.linearRampToValueAtTime(0,     nodes[i].nextInterval)
                  } else {
                    nodes[i].gain.gain.setValueAtTime(nodes[i].gain.gain.value, 0)
                    nodes[i].gain.gain.linearRampToValueAtTime(level, peakPoint)
                    nodes[i].gain.gain.setValueAtTime(level, peakPoint)
                    nodes[i].gain.gain.linearRampToValueAtTime(0,     nodes[i].nextInterval)
                  }

                }

              } catch (error) {
                console.log(error.message)
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
            
          }, offset * 10 * intervalLength)

        }

        if (document.getElementById(`node${i}`)) {
          setTimeout(() => {newInterval(i)}, (nodes[i].nextInterval - context.currentTime)*1000)
        }
      } else {
        setTimeout(() => {newInterval(i)}, (nodes[i].nextInterval - context.currentTime)*1000)
      }
    }
  }

  const getIntervalLength = (i) => {
    // console.log('Getting interval length')
    const liveIntervals = Array.from(document.getElementsByClassName(`interval${i}`)).filter(interval => interval.checked)
    const interval = +liveIntervals[Math.floor(Math.random() * liveIntervals.length)]?.value
    const intervalBpmAdjuster = 4
    const bpm             = +document.getElementById(`bpm${i}`)?.value
    const intervalLength  = 60000/bpm * interval * intervalBpmAdjuster
    return intervalLength/1000
  }
       
  const isRest = (i) => {
    // console.log('Determining Rest')
    const chanceOfRest        = +document.getElementById(`rest${i}`)?.value/100
    const diceRoll = Math.random()
    return diceRoll < chanceOfRest
  }

  const getRangeValue = (key, i) => {
    // console.log('Getting Range Value')
    const minValue = +document.getElementById(`min ${key}${i}`)?.value    
    const maxValue = +document.getElementById(`max ${key}${i}`)?.value    
    return minValue + (Math.random() * (maxValue - minValue))
  }

  const detune = (frequency, i) => {
    // console.log('Getting Detune Value')
    const detune = getRangeValue('detune', i)
    const ratio = 105.94637142137626184333
    const semitoneUp = frequency / 100 * ratio
    const hzDiff = semitoneUp - frequency
    return frequency + hzDiff / 100 * detune
  }

  const getRandomFrequency = (i) => {
    // console.log('Getting Random Frequency')
    let activeFrequencies = getActiveFrequencies(i) 
    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)

    return activeFrequencies[randomIndex]
  }

  const getActiveFrequencies = (i) => {
    // console.log('Getting Active Frequencies')
    const activeScales  = Array.from(document.getElementsByClassName(`scale${i}`)).filter(scale => scale.checked).map(scale => { return +scale.value})
    const activeNotes   = Array.from(document.getElementsByClassName(`note${i}` )).filter(note  =>  note.checked).map(note => { return +note.value})

    let currentFrequencies = allFrequencies.filter((scale, j) => activeScales.includes(j))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, j) => activeNotes.includes(j+1))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const handleDelete = (i) => {
    // console.log('Deleting Node')
    nodes[i].gain.gain.setValueAtTime(0, 0)
    nodes[i].oscillator.stop()

    setNodes(nodes.map((node, j) => i !== j ? node : 'deleted'))
  }

  const notes   = [1,2,3,4,5,6,7,8,9,10,11,12,13]
  const scales  = [0,1,2,3,4,5,6,7,8,9,10]

  return <>
    <div>
      <Header 
        handleStartStop   = {handleStartStop}
        cycleButtonLabel  = {cycleButtonLabel}
        addNode           = {addNode}
        showStart         = {Boolean(active(nodes).length)}
      />

      <br />
      
      {nodes.map((node, i) => 
        node !== 'deleted' &&
        <Node 
          node        = {node} 
          i           = {i} 
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
