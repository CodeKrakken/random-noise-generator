import { voice } from "./components/Voice/Voice.types"

type OscillatorSource = {
  kind: "oscillator"
  wave: OscillatorType
}

type SampleSource = {
  kind: "sample"
  name: "kick" | "snare"
  buffer: AudioBuffer
}

 type SoundSource = OscillatorSource | SampleSource

 type OscGain = {
  oscillator: OscillatorNode, 
  gain: GainNode
}

 type voicesRef = { current: voice[] }

 type runningRef = { current: boolean }

 type waveform =
  'sine'
| 'triangle'
| 'sawtooth'
| 'square'

export type {
  waveform,
  OscGain,
  runningRef, 
  voicesRef,
  SoundSource
}