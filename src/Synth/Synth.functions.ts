import { VoiceType, RangeKey }                                                    from '../components/shared.types'
import { Hit, VoicesRef }                                                              from './Synth.types'
import { allFrequencies, extrema, oneMinute, samples, sampleFolders, waveforms }  from '../content/data';


type OscGain = {
  oscillator  : OscillatorNode
  gainNode    : GainNode
}

let masterCompressor: DynamicsCompressorNode
  
const getContext = (
  setup: {
    context: undefined | AudioContext,
    masterGain: undefined | GainNode
  }
) => {  

  let { context, masterGain } = setup

  if (!context) { context = new AudioContext() }
  if (!masterGain) { masterGain = context.createGain() }

  if (context.state === 'suspended') { context.resume() }  
  
  if (!masterCompressor) {  
    masterCompressor = context.createDynamicsCompressor()  
    masterCompressor.threshold.value  = -6   // dBFS — starts compressing at -6 dB  
    masterCompressor.knee.value       = 3   // soft knee  
    masterCompressor.ratio.value      = 20  // 20:1 ≈ hard limiter  
    masterCompressor.attack.value     = 0.001  
    masterCompressor.release.value    = 0.1  
    masterCompressor.connect(masterGain).connect(context.destination)  
  }  
  
  loadSamples(context)  
  
  return {masterGain, context}  
}

const runInterval = (

  voice         : VoiceType, 
  voicesRef     : VoicesRef, 
  context       : AudioContext,
  recordedHits  : Hit[]

) => {

  voice.thisInterval = voice.nextInterval
  const thisInterval = voice.thisInterval

  if (isTimeFor(thisInterval, context)) {
    
    const intervalLength = getIntervalLength(voice)
    voice.nextInterval += intervalLength
  
    if (!isRest(voice)) makeSound(voice, intervalLength, context, recordedHits)
  } 

  if (!voice.isActive) return

  setTimeout(() => {
    runInterval(voice, voicesRef, context, recordedHits)
  }, (voice.nextInterval - context.currentTime)*1000)    
}

const playBack = (hitToPlay: Hit, context: AudioContext) => {

  const currentTime = context.currentTime

  const sound     = hitToPlay.sound as OscillatorType
  const level     = hitToPlay.level as number
  const frequency = hitToPlay.frequency as number

  const startTime = hitToPlay.startTime as number + currentTime
  const peakStart = hitToPlay.peakStart as number + currentTime
  const peakEnd   = hitToPlay.peakEnd   as number + currentTime
  const endTime   = hitToPlay.endTime   as number + currentTime

  if (waveforms.includes(sound)) {
    const oscGain = setUpOscillator(context)
    oscGain.oscillator.type = sound
    oscGain.oscillator.frequency.value = frequency

    const gain = oscGain.gainNode.gain
    gain.setValueAtTime(0, startTime)
    gain.linearRampToValueAtTime(level, peakStart)
    gain.setValueAtTime(level, peakEnd)
    gain.linearRampToValueAtTime(0, endTime)

  } else {
    
  }


}

// test helper

const resetSampleState = () => {
  samplesLoading = false;
};

// private functions

const buffers: Record<string, { 

  buffer            : AudioBuffer; 
  detectedFrequency : number | null 
  nearestFrequency  : number | null
  octave            : number | null
  note              : number | null

}> = {}  

let samplesLoading = false  

const noteNameToIndex: Record<string, number> = {  
  C:0, Db:1, D:2, Eb:3, E:4, F:5, Gb:6, G:7, Ab:8, A:9, Bb:10, B:11  
}  
  
const parseNoteFromKey = (key: string) => {  
  
  const match = key.match(/[/_]([A-G][b#]?)(\d+)(?:_|\.|$)/)
  
  if (!match) return null  

  const noteName = match[1]  
  const octave   = parseInt(match[2], 10)  
  const note     = noteNameToIndex[noteName]  

  if (
    note === undefined || 
    octave < 0 || 
    octave >= allFrequencies.length
  ) return null  

  return { octave, note, frequency: allFrequencies[octave][note] }  
}

const detectPitch = (buffer: AudioBuffer, sampleRate: number) => {  

  const data = buffer.getChannelData(0);
  const size = 4096;

  let startSample = 0;

  for (let i = 0; i < data.length - size; i++) {
    if (Math.abs(data[i]) > 0.05) {
      startSample = i;
      break;
    }
  }

  const slice = data.slice(startSample, startSample + size);
  const halfSize = size / 2  
  
  // Compute autocorrelation for all offsets up to halfSize  

  const r0 = slice.slice(0, halfSize).reduce((sum, x) => sum + x * x, 0)  
  if (r0 === 0) return null  
  
  const correlations = []  

  for (let offset = 0; offset < halfSize; offset++) {  
    let sum = 0  
    for (let i = 0; i < halfSize; i++) sum += slice[i] * slice[i + offset]  
    correlations.push(sum / r0)  
  }  
  
  // Find the first zero crossing (autocorrelation goes negative)  

  let firstZeroCrossing = -1  
  
  for (let i = 1; i < halfSize; i++) {  
    if (correlations[i - 1] > 0 && correlations[i] <= 0) {  
      firstZeroCrossing = i  
      break  
    }  
  }  

  if (firstZeroCrossing === -1) return null  // no zero crossing = no clear pitch  
  
  const maxOffset = Math.floor(sampleRate / 27)  // min ~27 Hz, covers full piano range  
  const searchEnd = Math.min(maxOffset, halfSize - 1)  
    
  // Pass 1: find the global max correlation in the search range  

  let globalMax = 0  

  for (let offset = firstZeroCrossing; offset < searchEnd; offset++) {  
    if (correlations[offset] > globalMax) globalMax = correlations[offset]  
  }  
    
  // Pass 2: find the FIRST local peak above the threshold  

  const threshold = 0.5  // tune between 0.85–0.93 if needed  
  let bestOffset = -1  
  let bestCorrelation = 0  

  for (let offset = firstZeroCrossing; offset < searchEnd; offset++) {  

    if (  
      correlations[offset] > correlations[offset - 1] &&  
      correlations[offset] > correlations[offset + 1] &&  
      correlations[offset] >= threshold * globalMax  
    ) {  
      bestCorrelation = correlations[offset]  
      bestOffset = offset  
      break  // first significant peak = fundamental  
    }  
  }

  if (bestOffset !== -1) {

    ({ bestOffset, bestCorrelation } = refineFundamental(
      correlations,
      firstZeroCrossing,
      bestOffset,
      bestCorrelation
    ));
  }  

  return getDetectedFrequency(
    slice,
    sampleRate,
    bestOffset,
    bestCorrelation
  );
}

const getDetectedFrequency = (
  slice: Float32Array,
  sampleRate: number,
  bestOffset: number,
  bestCorrelation: number
) => {
  if (shouldUseFFTFallback(bestOffset, bestCorrelation)) {
    return detectPitchFFT(slice, sampleRate);
  }

  return sampleRate / bestOffset;
};

const refineFundamental = (
  correlations: number[],
  firstZeroCrossing: number,
  bestOffset: number,
  bestCorrelation: number
) => {

  const originalCorrelation = bestCorrelation;

  for (const divisor of [2, 3, 4, 5, 6, 7, 8, 10, 12, 16]) {

    const candidateOffset = Math.round(bestOffset / divisor);
    if (candidateOffset <= firstZeroCrossing) break;

    const c     = correlations[candidateOffset]     ?? -Infinity;
    const cPrev = correlations[candidateOffset - 1] ?? -Infinity;
    const cNext = correlations[candidateOffset + 1] ?? -Infinity;

    if (
      c > cPrev &&
      c > cNext &&
      c >= 0.9 * originalCorrelation
    ) {
      bestOffset      = candidateOffset;
      bestCorrelation = c;
    }
  }

  return { bestOffset, bestCorrelation };
};

const detectPitchFFT = (slice: Float32Array, sampleRate: number) => {  

  const N = slice.length  
  let bestFreq = -1  
  let bestMag = 0  
  const minBin = Math.floor(27 * N / sampleRate)   // 27 Hz floor  
  const maxBin = Math.floor(8000 * N / sampleRate) // 8000 Hz ceiling  
  
  for (let k = minBin; k < maxBin; k++) {  

    let re = 0, im = 0  

    for (let n = 0; n < N; n++) {  

      const angle = (2 * Math.PI * k * n) / N  
      re += slice[n] * Math.cos(angle)  
      im -= slice[n] * Math.sin(angle)  
    }  

    const mag = Math.sqrt(re * re + im * im)  
    if (mag > bestMag) { bestMag = mag; bestFreq = k * sampleRate / N }  
  }  
  return bestFreq > 0 ? bestFreq : null  
}

const shouldUseFFTFallback = (
  bestOffset: number,
  bestCorrelation: number
) => bestOffset === -1 || bestCorrelation < 0.3;

const findNearestNote = (frequency: number) => {  

  let bestOctave = 0  
  let bestNote = 0  
  let bestCentsDiff = Infinity  
  
  allFrequencies.forEach((octave, octaveIndex) => {  
    octave.forEach((noteFreq, noteIndex) => {  

      if (noteIndex === 12) return  // skip duplicate boundary note  

      const centsDiff = Math.abs(1200 * Math.log2(frequency / noteFreq))  

      if (centsDiff < bestCentsDiff) {  

        bestCentsDiff = centsDiff  
        bestOctave    = octaveIndex  
        bestNote      = noteIndex  
      }  
    })  
  })
  
  return {  
    octave: bestOctave,  
    note: bestNote,  
    frequency: allFrequencies[bestOctave][bestNote]  
  }  
}

const findNearestSampleInFolder = ( 

  folder: string,  
  targetOctave: number,  
  targetNote: number  

) => {  

  const keys = sampleFolders[folder]  
  if (!keys?.length) return null  
  
  let bestKey = null  
  let bestDistance = Infinity  
  
  for (const key of keys) {  

    const buf = buffers[key]  
    if (!buf || buf.octave === null || buf.note === null) continue  

    const distance = (
      Math.abs(targetNote - buf.note) + 
      Math.abs(targetOctave - buf.octave) * 12  
    )

    if (distance < bestDistance) {  
      bestDistance = distance  
      bestKey = key  
    }  
  }  
  
  return bestKey  
}
  
const loadSamples = (context: AudioContext) => {  

  if (samplesLoading) return  Promise.resolve();
  samplesLoading = true  

  return Promise.all(  
    Object.entries(samples).map(async ([name, url]) => {  

      try {  
        const response    = await fetch(url as string)  
        const arrayBuffer = await response.arrayBuffer()  
        const decoded     = await context.decodeAudioData(arrayBuffer)  

        const parsed = parseNoteFromKey(name)
        let detected = null  
        let nearest
          
        if (parsed) {  
          detected = parsed.frequency  
          nearest  = parsed  
        } else {  
          detected = detectPitch(decoded, context.sampleRate)  
          nearest  = detected ? findNearestNote(detected) : null  
        }
  
        buffers[name] = {  
          buffer            : decoded,  
          detectedFrequency : detected,  
          nearestFrequency  : nearest?.frequency ?? null,  
          octave            : nearest?.octave ?? null,  
          note              : nearest?.note ?? null,  
        }
      } catch (e) {  

        console.error('Failed to load sample:', name, e)  
      }  
    })  
  )  
}


const isTimeFor = (timeCode: number, context: AudioContext) => context.currentTime >= timeCode

const getIntervalLength = (voice: VoiceType) => {

  const { activeIntervals, bpm } = voice

  const interval = randomOneFrom(activeIntervals) || '0.5'
  const intervalLength  = oneMinute / bpm * parseFloat(interval)

  return intervalLength
}

const isRest = (voice: VoiceType) => {  
  const { restChance, activeOctaves, activeNotes, activeSounds } = voice    
  if (!activeOctaves.length || !activeNotes.length || !activeSounds.length) return true    
  const diceRoll = Math.random()  

  return diceRoll < restChance / 100  
}

const makeSound = (

  voice           : VoiceType, 
  intervalLength  : number, 
  context         : AudioContext,
  recordedHits    : Hit[],

) => {


  const { activeSounds, thisInterval } = voice

  const offsetTime = getRangeValue('Offset', voice) / 100 * intervalLength

  try {
    const randomSound = randomOneFrom(activeSounds) as OscillatorType
    const level = calculateLevel(voice)
    voice.offsetInterval = thisInterval! + offsetTime

    const hitToPopulate: Hit = {
      sound: randomSound
    }

    if (waveforms.includes(randomSound)) {

      const oscGain = setUpOscillator(context)
      oscGain.oscillator.type = randomSound
      oscGain.oscillator.frequency.value = randomOneFrom(voice.activeFrequencies)
      oscGain.oscillator.detune.value = getRangeValue('Detune', voice)
      
      hitToPopulate.frequency = oscGain.oscillator.frequency.value + oscGain.oscillator.detune.value
            
      shapeNote(oscGain.gainNode, voice, intervalLength, level, hitToPopulate)
      setTimeout(() => removeOscillator(oscGain), (intervalLength+offsetTime)*1000)
    } else {
      playSample(randomSound, level, context, voice.offsetInterval, hitToPopulate, voice)
    }

    recordedHits.push(hitToPopulate)

  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error", error)
  }            
}

const setUpOscillator = (context: AudioContext) => {

  const oscillator  = context.createOscillator()
  const gain        = context.createGain()

  oscillator.connect(gain);
  gain.gain.setValueAtTime(0, 0)
  gain.connect(masterCompressor!)  
  oscillator.start(0);

  return {oscillator, gainNode: gain}
}

const removeOscillator = (oscGain: OscGain) => {
  const { oscillator, gainNode } = oscGain

  oscillator.stop()
  oscillator.disconnect()
  gainNode.disconnect()
}

const playSample = (  

  name          : string,  
  level         : number,  
  context       : AudioContext,  
  time          : number,  
  hitToPopulate : Hit,
  voice         : VoiceType,
) => {  
  
  let targetNote      : number | null = null  
  let targetOctave    : number | null = null
  let targetInterval  : number | null = null  
  
  if (
    voice.activeNotes.length > 0 && 
    voice.activeOctaves.length > 0 && 
    voice.activeIntervals.length > 0
  ) {  
    targetNote     = +randomOneFrom(voice.activeNotes)  
    targetOctave   = +randomOneFrom(voice.activeOctaves)  
    targetInterval = +randomOneFrom(voice.activeIntervals)
  }
  
    
  // Resolve which buffer to actually play  

  let bufferKey = name  

  if (sampleFolders[name]) {  

    if (targetNote !== null && targetOctave !== null) {  
      bufferKey = findNearestSampleInFolder(name, targetOctave, targetNote) ?? name  
    } else {  
      bufferKey = randomOneFrom(sampleFolders[name])  
    }  
  }  

  const buf = buffers[bufferKey]  

  if (!buf?.buffer) {  
    console.warn('Buffer not ready for:', bufferKey)  
    return  
  }  
  
  const source = context.createBufferSource()  
  source.buffer = buf.buffer  
  const gain = context.createGain()  

  shapeNote(gain, voice, targetInterval!, level, hitToPopulate)
  
  
  source.connect(gain)  
  gain.connect(masterCompressor!)  
  
  const detune = getRangeValue('Detune', voice!)

  source.detune.value = detune! +
  (targetNote! - 1 - buf.note!) * 100 +  
  (targetOctave! - buf.octave!) * 1200


  hitToPopulate!.note = targetNote
  hitToPopulate!.octave = targetOctave
  hitToPopulate!.detune = detune  
  

  source.start(time)  

  source.onended = () => {  
    source.disconnect()  
    gain.disconnect()  
  }  
}

const shapeNote = (

  gainNode        : GainNode, 
  voice           : VoiceType, 
  intervalLength  : number, 
  level           : number,
  hitToPopulate   : Hit,

) => {
  
  const gain = gainNode.gain
  const noteLength = generateNoteLength(voice, intervalLength)

  const thisInterval = voice.offsetInterval!
  const attackPercentage = getRangeValue('Attack', voice)
  const decayPercentage  = getRangeValue('Decay', voice)

  const attackLength = getFadeLength(attackPercentage , noteLength)
  const decayLength  = getFadeLength(decayPercentage, noteLength)

  const endOfAttack  = thisInterval + attackLength
  const startOfDecay = thisInterval + noteLength - decayLength

  const peakPoint = (
    thisInterval + noteLength * attackPercentage / 
    (attackPercentage + decayPercentage)
  )

  const overlap     = endOfAttack >= startOfDecay
  const peakStart = overlap ? peakPoint : endOfAttack
  const peakEnd   = overlap ? peakPoint : startOfDecay

  gain.setValueAtTime(0, thisInterval)
  gain.linearRampToValueAtTime(level, peakStart)
  gain.setValueAtTime(level, peakEnd)
  gain.linearRampToValueAtTime(0, thisInterval + noteLength)

  hitToPopulate.startTime = thisInterval
  hitToPopulate.endTime   = thisInterval + noteLength
  hitToPopulate.level     = level
  hitToPopulate.peakStart = peakStart
  hitToPopulate.peakEnd   = peakEnd

}

const randomOneFrom = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)]
}

const calculateLevel = (voice: VoiceType) => {

  const { minLevel, maxLevel } = voice

  const balancedLevel = (
    (minLevel + Math.random() * (maxLevel - minLevel))/100
  )
  
  return balancedLevel
}


const generateNoteLength = (voice: VoiceType, intervalLength: number) => {
  const noteLengthPercentage  = getRangeValue('Length', voice)
  return intervalLength / 100 * noteLengthPercentage
}

const getFadeLength = (percentage: number, noteLength: number) => noteLength * percentage / 100

const getRangeValue = (key: RangeKey, voice: VoiceType) => {
    
  const [min, max] = extrema.map(
    prefix => voice[prefix + key as keyof VoiceType]
  )

  const rangeValue = (
    min as number + 
    (
      Math.random() * 
      (max as number - (min as number))
    )
  )

  return rangeValue
}

export {
  getContext,
  runInterval,
  parseNoteFromKey,
  detectPitch,
  refineFundamental,
  shouldUseFFTFallback,
  detectPitchFFT,
  getDetectedFrequency,
  findNearestNote,
  findNearestSampleInFolder,
  buffers,
  loadSamples,
  resetSampleState,
  playSample,
  playBack
}