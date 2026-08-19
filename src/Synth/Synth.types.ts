import { VoiceType } from "../components/shared.types"

type VoicesRef = { current: VoiceType[] }

type SourceGain = {
    source: OscillatorNode | AudioBufferSourceNode, 
    gainNode: GainNode 
  }

export type {
  VoicesRef,
  SourceGain,
}