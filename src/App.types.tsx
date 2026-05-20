import { VoiceType } from "./components/Voice/Voice.types"


type OscGain = {
  oscillator  : OscillatorNode, 
  gain        : GainNode
}


type VoicesRef = { current: VoiceType[] }


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