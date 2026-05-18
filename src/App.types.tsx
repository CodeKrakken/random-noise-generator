import { voice } from "./components/Voice/Voice.types"


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
  voicesRef
}