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

