import { VoiceType, HitType, RangeKey }                                                    from '../components/shared.types'
import { SourceGain, VoicesRef }                                                         from './Synth.types'
import { allFrequencies, extrema, oneMinute, samples, sampleFolders, waveforms, noteNameToIndex }  from '../content/data';
import { Synth } from './Synth';
import { randomOneFrom } from '../components/shared.functions';


// variables

let masterCompressor: DynamicsCompressorNode

const buffers: Record<string, { 

  buffer            : AudioBuffer; 
  detectedFrequency : number | null 
  nearestFrequency  : number | null
  octave            : number | null
  note              : number | null

}> = {}  

let samplesLoading = false  

// functions
  
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

const shouldUseFFTFallback = (
  bestOffset: number,
  bestCorrelation: number
) => bestOffset === -1 || bestCorrelation < 0.3;

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

const runInterval = (

  voice           : VoiceType, 
  voicesRef       : VoicesRef, 
  context         : AudioContext,
  recordedHits    : HitType[],
  runStartTime    : number,
  setRecordedHits : Function
) => {

  const { nextInterval, activeSounds, activeFrequencies, activeNotes, activeOctaves } = voice

  voice.thisInterval = nextInterval
  const thisInterval = voice.thisInterval

  // try

  try {
    if (isTimeFor(thisInterval, context)) {
      
      const intervalLength = getIntervalLength(voice)
      voice.nextInterval += intervalLength

      if (!isRest(voice)) {

        const hit: HitType = {
          sound     : randomOneFrom(activeSounds) as string,
          level     : calculateLevel(voice),
          frequency : randomOneFrom(activeFrequencies),
          detune    : getRangeValue('Detune', voice),
          note      : +randomOneFrom(activeNotes),
          octave    : +randomOneFrom(activeOctaves),
          ...getGainEvents(voice, intervalLength, runStartTime),
          voiceId   : voice.id
        }
                 
        playHit(hit, context, runStartTime)
        
        // recordedHits.push(hit)  
        // Synth.hitsDirty = true
      }    
    } 
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error", error)
  } finally {
    if (!voice.isActive) return

    setTimeout(() => {
      runInterval(voice, voicesRef, context, recordedHits, runStartTime, setRecordedHits)
    }, (voice.nextInterval - context.currentTime)*1000) 
  }
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


const calculateLevel = (voice: VoiceType) => {

  const { minLevel, maxLevel } = voice

  const balancedLevel = (
    (minLevel + Math.random() * (maxLevel - minLevel))/100
  )
  
  return balancedLevel
}

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

const getGainEvents = (voice: VoiceType, intervalLength: number, runStartTime: number) => {

  // start

  const offsetTime = getRangeValue('Offset', voice) / 100 * intervalLength
  const startTime = voice.thisInterval! + offsetTime - runStartTime

  // end

  const noteLength = generateNoteLength(voice, intervalLength)
  const endTime   = startTime + noteLength

  // peak points
  
  const attackPercentage = getRangeValue('Attack', voice)
  const decayPercentage  = getRangeValue('Decay', voice)

  const attackLength = getFadeLength(attackPercentage , noteLength)
  const decayLength  = getFadeLength(decayPercentage, noteLength)

  const endOfAttack  = startTime + attackLength
  const startOfDecay = endTime - decayLength

  const peakPoint = (
    startTime + noteLength * attackPercentage / 
    (attackPercentage + decayPercentage)
  )

  const overlap   = endOfAttack >= startOfDecay

  const peakStart = overlap ? peakPoint : endOfAttack
  const peakEnd   = overlap ? peakPoint : startOfDecay

  return { startTime, endTime, peakStart, peakEnd }
}

const generateNoteLength = (voice: VoiceType, intervalLength: number) => {
  const noteLengthPercentage  = getRangeValue('Length', voice)
  return intervalLength / 100 * noteLengthPercentage
}

const getFadeLength = (percentage: number, noteLength: number) => noteLength * percentage / 100

const playHit = (
  hit: HitType,
  context: AudioContext,
  runStartTime: number,
  onFinished?: () => void
) => {

  const { sound } = hit

  let gainNode: GainNode

  if (isWaveform(sound!)) {
    console.log(hit)
    hit.source = setUpSource(context, hit)
    gainNode = hit.source.gainNode

    hit.source.source.onended = () => {
      removeSource(hit.source!)
      onFinished?.()
    }

  } else {

    gainNode = setUpGainNode(context)

    setUpSample(
      hit,
      context,
      runStartTime + hit.startTime!,
      gainNode,
      onFinished
    )
  }

  scheduleGainEvents(gainNode, hit, runStartTime)
}

const isWaveform = (sound: string) => waveforms.includes(sound as string)


const setUpSource = (context: AudioContext, hit: HitType) => {

  const source  = context.createOscillator()
  const gainNode    = setUpGainNode(context)
  const { sound, frequency, detune, endTime, startTime } = hit

  source.connect(gainNode);
  source.start(0);
  source.type = sound as OscillatorType
  console.log(frequency)
  source.frequency.value = frequency as number
  source.detune.value = detune as number
  source.stop((endTime! - startTime!) * 1000)
  return {source, gainNode}
}

const setUpGainNode = (context: AudioContext) => {

  const gainNode = context.createGain()
  gainNode.gain.setValueAtTime(0, 0)
  gainNode.connect(masterCompressor!)  

  return gainNode
}

const removeSource = (sourceGain: SourceGain) => {
  const { source, gainNode } = sourceGain

  source.stop()
  source.disconnect()
  gainNode.disconnect()
}

const setUpSample = (
  hit: HitType,
  context: AudioContext,
  time: number,
  gainNode: GainNode,
  onFinished?: () => void
) => {

  const { detune, note, octave } = hit

  let sound = hit.sound

  if (
    sampleFolders[sound!] &&
    note !== null && 
    octave !== null
  ) {  
    sound = findNearestSampleInFolder(sound!, octave!, note!) ?? sound  
  }

  const buf = buffers[sound!]  

  if (!buf?.buffer) {  
    console.warn('Buffer not ready for:', sound)  
    return  
  }  
  
  const source = context.createBufferSource()  
  source.buffer = buf.buffer  
  source.connect(gainNode)  

  source.detune.value = detune! +
  (note! - 1 - buf.note!) * 100 +  
  (octave! - buf.octave!) * 1200

  const sourceGain = { source, gainNode }

  hit.source = sourceGain

  source.start(time)
  source.stop((hit.endTime! - hit.startTime!) * 1000)  
  
  source.onended = () => {
    source.disconnect()
    gainNode.disconnect()
    onFinished?.()
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

const scheduleGainEvents = (

  gainNode: GainNode,
  hit: HitType,
  runStartTime: number

) => {
  
  const gain = gainNode.gain
  const { startTime, endTime, peakStart, peakEnd, level } = hit
  
  gain.setValueAtTime(0, startTime! + runStartTime)
  gain.linearRampToValueAtTime(level!, peakStart! + runStartTime)
  gain.setValueAtTime(level!, peakEnd! + runStartTime)
  gain.linearRampToValueAtTime(0, endTime! + runStartTime)
}


// test helper

const resetSampleState = () => {
  samplesLoading = false;
};

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
  playHit,
  removeSource
}