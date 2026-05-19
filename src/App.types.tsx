import { Voice } from "./components/Voice/Voice.types"


type OscGain = {
  oscillator: OscillatorNode, 
  gain: GainNode
}

type VoicesRef = { current: Voice[] }

type RunningRef = { current: boolean }

type Waveform =
  'sine'
| 'triangle'
| 'sawtooth'
| 'square'

export type {
  Waveform,
  OscGain,
  RunningRef, 
  VoicesRef
}