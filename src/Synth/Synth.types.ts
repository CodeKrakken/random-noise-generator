import { VoiceType } from "../components/shared.types"

type VoicesRef = { current: VoiceType[] }


type Hit = {
  sound?     : string
  frequency? : number
  detune?    : number
  note?      : number | null
  octave?    : number | null
  startTime? : number
  endTime?   : number
  peakStart? : number
  peakEnd?   : number
  level?     : number
}

export type {
  VoicesRef,
  Hit,
}