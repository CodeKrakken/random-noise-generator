import { voice } from "./types/voice"

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

export type OscGain = {
  oscillator: OscillatorNode, 
  gain: GainNode
}

export type voicesRef = {
  current: voice[]
}

export type runningRef = {
  current: boolean
}

export type waveform =
  'sine'
| 'triangle'
| 'sawtooth'
| 'square'