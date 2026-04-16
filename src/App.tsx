import { useEffect, useState } from 'react';
import './App.css';
import { allFrequencies, waveShapes, intervals } from './content/data'
import snareFile  from './sounds/snare.wav';
import kickFile   from './sounds/kick.wav';
import Node from './components/node/Node';
import Header from './components/header/Header';
import { node } from './types/node'

let cycling = false

type OscillatorSource = {
  kind: "oscillator"
  wave: OscillatorType
}

type SampleSource = {
  kind: "sample"
  name: "kick" | "snare"
  buffer: AudioBuffer
}

export type SoundSource = OscillatorSource | SampleSource

function App() {

  const [context] = useState(() => new AudioContext())

  context.resume()

  const [nodes,             setNodes            ] = useState<node[]>([])
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

  const active = (nodes: node[]) => {
    return nodes.filter(node => node.isActive)
  }

  const setUpNode = () => {
    // console.log('Setting Up Node')
    
    const clonedNode = active(nodes).reverse()[0]

    return {
      isActive          : true,
      label           : clonedNode?.label+1           || 1,
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

  const setUpSample = (file: string) => {
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
      if (node.isActive) {

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
    await active(nodes).forEach(node => {
      node.gain?.gain.setValueAtTime(0, context.currentTime)
      node.oscillator?.stop()
    })

  }

  const newInterval = (i: number) => {
    const node = nodes[i]

    if (cycling && document.getElementsByClassName(`interval${i}`))  {
      if (context.currentTime >= nodes[i].nextInterval) {
        console.log('Running Interval')
        const intervalLength = getIntervalLength(i)

        nodes[i].thisInterval = nodes[i].nextInterval
        nodes[i].nextInterval += intervalLength

        const liveWaves = Array.from(document.getElementsByClassName(`wave${i}`)).filter(
          (wave): wave is HTMLInputElement => wave instanceof HTMLInputElement && wave.checked
        )

        if (isRest(i) || !liveWaves) {
          nodes[i].gain?.gain.setValueAtTime(0,0)

        } else {          

          const minLevel  = +document.querySelector<HTMLInputElement>(`#minLevel${i}`)?.value!
          const maxLevel  = +document.querySelector<HTMLInputElement>(`#maxLevel${i}`)?.value!
          const minLength = +document.querySelector<HTMLInputElement>(`#minLength${i}`)?.value!
          const maxLength = +document.querySelector<HTMLInputElement>(`#maxLength${i}`)?.value!

          const offset = getRangeValue('offset', i)
          let noteLength = intervalLength

          setTimeout(async () => {
            const randomWave = liveWaves[Math.floor(Math.random() * liveWaves.length)]

            const waveShape = randomWave.value

            if (node.oscillator) node.oscillator.type = waveShape as OscillatorType

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
                const randomFrequency = getRandomFrequency(i)
                const frequency   = detune(randomFrequency as number, i)

                if (node.oscillator) node.oscillator.frequency.value = frequency

                const noteLengthPercentage  = (minLength + Math.random() * (maxLength - minLength))
                noteLength = intervalLength / 100 * noteLengthPercentage

                const fadeInPercentage  = getRangeValue('fade in' , i)
                const fadeOutPercentage = getRangeValue('fade out', i)
                const peakPercentage    = (fadeInPercentage/(fadeInPercentage+fadeOutPercentage)) * 100 ||  0

                const level       = ((minLevel + Math.random() * (maxLevel - minLevel))/100)/nodes.filter(node => node.nextInterval).length
                
                if (noteLength < intervalLength) {
                  setTimeout(() => {nodes[i].gain?.gain.setValueAtTime(0, context.currentTime)}, noteLength*1000)
                }

                if (cycling) {
                  const fadeInDuration  = noteLength  / 100 * fadeInPercentage
                  const fadeOutDuration = noteLength  / 100 * fadeOutPercentage
                  const startOfFadeOut  = nodes[i].nextInterval - fadeOutDuration
                  const endOfFadeIn     = node.thisInterval ? node.thisInterval + fadeInDuration : fadeInDuration

                  const peakPoint       = node.thisInterval ? 
                                          node.thisInterval + noteLength * peakPercentage / 100 : 
                                          noteLength * peakPercentage / 100

                  if (endOfFadeIn <= startOfFadeOut) {

                    node.gain?.gain.setValueAtTime(node.gain.gain.value, 0)
                    nodes[i].gain?.gain.linearRampToValueAtTime(level, endOfFadeIn)
                    nodes[i].gain?.gain.setValueAtTime(level, startOfFadeOut)
                    nodes[i].gain?.gain.linearRampToValueAtTime(0, nodes[i].nextInterval)

                  } else {

                    node.gain?.gain.setValueAtTime(node.gain.gain.value, 0)
                    nodes[i].gain?.gain.linearRampToValueAtTime(level, peakPoint)
                    nodes[i].gain?.gain.setValueAtTime(level, peakPoint)
                    nodes[i].gain?.gain.linearRampToValueAtTime(0, nodes[i].nextInterval)

                  }
                }
              } catch (error: unknown) {

                console.error(error instanceof Error ? error.message : "Unknown error", error)
                
              }
            } else {
              try {

                if (node.oscillator) node.oscillator.frequency.value = 0
                if (waveShape === 'kick'  ) {kickSample.play()}
                if (waveShape === 'snare' ) {snareSample.play()}

              } catch (error: unknown) {

                console.error(error instanceof Error ? error.message : "Unknown error", error)

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

  const getIntervalLength = (i: number) => {
    // console.log('Getting interval length')
    const liveIntervals = Array.from(document.getElementsByClassName(`interval${i}`)).filter(
      (interval): interval is HTMLInputElement => interval instanceof HTMLInputElement && interval.checked
    )
    const interval = +liveIntervals[Math.floor(Math.random() * liveIntervals.length)]?.value
    const intervalBpmAdjuster = 4
    const bpm  = +document.querySelector<HTMLInputElement>(`#bpm${i}`)?.value!
    const intervalLength  = 60000/bpm * interval * intervalBpmAdjuster
    return intervalLength/1000
  }
       
  const isRest = (i: number) => {
    // console.log('Determining Rest')
    const chanceOfRest  = +document.querySelector<HTMLInputElement>(`#rest${i}`)?.value!/100

    const diceRoll = Math.random()
    return diceRoll < chanceOfRest
  }

  const getRangeValue = (key: string, i:number) => {
    // console.log('Getting Range Value')
    const minEl = document.getElementById(`min ${key}${i}`)
    const maxEl = document.getElementById(`max ${key}${i}`)
    const minValue = minEl instanceof HTMLInputElement ? +minEl.value : 0
    const maxValue = maxEl instanceof HTMLInputElement ? +maxEl.value : 100
    return minValue + (Math.random() * (maxValue - minValue))
  }

  const detune = (frequency: number, i: number) => {
    // console.log('Getting Detune Value')
    const detune = getRangeValue('detune', i)
    const ratio = 105.94637142137626184333
    const semitoneUp = frequency / 100 * ratio
    const hzDiff = semitoneUp - frequency
    return frequency + hzDiff / 100 * detune
  }

  const getRandomFrequency = (i: number) => {
    // console.log('Getting Random Frequency')
    let activeFrequencies = getActiveFrequencies(i) 
    const randomIndex = Math.floor(Math.random()*activeFrequencies.length)

    return activeFrequencies[randomIndex]
  }

  const getActiveFrequencies = (i: number) => {
    // console.log('Getting Active Frequencies')
    
    const activeScales  = Array.from(document.getElementsByClassName(`scale${i}`)).filter(
      (scale): scale is HTMLInputElement => scale instanceof HTMLInputElement && scale.checked    
    ).map(scale => { return +scale.value})
    
    const activeNotes   = Array.from(document.getElementsByClassName(`note${i}` )).filter(
      (note): note is HTMLInputElement => note instanceof HTMLInputElement && note.checked
    ).map(note => { return +note.value})

    let currentFrequencies = allFrequencies.filter((scale, j) => activeScales.includes(j))
    
    let filteredFrequencies = currentFrequencies.map(scale =>
      scale.filter((note, j) => activeNotes.includes(j+1))
    )

    return filteredFrequencies.flat(Infinity)
  }

  const handleDelete = (i: number) => {
    // console.log('Deleting Node')
    nodes[i].gain?.gain.setValueAtTime(0, 0)
    nodes[i].oscillator?.stop()

    setNodes(nodes.map((node, j) => i !== j ? node : {...node, isActive: false}))
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
        node.isActive &&
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
