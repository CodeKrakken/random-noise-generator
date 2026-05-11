import { voice } from "./voice"

export type SlotProps = {
  voice: voice,
  length: number,
  voices:   voice[],
  context:  AudioContext
}