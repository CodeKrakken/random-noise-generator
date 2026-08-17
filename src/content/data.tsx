import ButtonGrid from "../components/ButtonGrid/ButtonGrid";
import VoicePiano from "../components/VoicePiano/VoicePiano";


// Load images

const imageContext = (  
  require as unknown as {  
    context: (  
      path: string,  
      recursive?: boolean,  
      match?: RegExp  
    ) => {  
      keys(): string[];  
      (id: string): string;  
    };  
  }  
).context(  
  './button-images',  
  true,  
  /\.png$/  
);  
  
const buttonImages = Object.fromEntries(  
  imageContext.keys().map((path) => [  
    path  
      .replace('./', '')  
      .replace(/\.png$/, ''),  
    imageContext(path),  
  ])  
);

// Load audio samples

const context = (
  require as unknown as {
    context: (
      path: string,
      recursive?: boolean,
      match?: RegExp
    ) => {
      keys(): string[];
      (id: string): string;
    };
  }
).context(
  './sounds',
  true,
/\.(wav|mp3)$/);

const samples = Object.fromEntries(
  context.keys().map((path) => [
    path
      .replace('./', '')
      .replace(/\.(wav|mp3)$/, ''),
    context(path),
  ])
);

// Group samples by folder (e.g. "piano" -> ["piano/C4", "piano/A3", ...])  

const sampleFolders: Record<string, string[]> = {}  

Object.keys(samples).forEach(key => {  
  const slash = key.indexOf('/')  
  if (slash !== -1) {  
    const folder = key.substring(0, slash)  
    if (!sampleFolders[folder]) sampleFolders[folder] = []  
    sampleFolders[folder].push(key)  
  }  
})  

// Separate top-level samples from folder samples  

const folderSampleKeys = new Set(Object.values(sampleFolders).flat())  
const nonFolderSamples = Object.keys(samples).filter(k => !folderSampleKeys.has(k))


// Native data

const title = "OCTOPUS"
const addLabel = "Add Voice"
const extrema = ['min', 'max']
const oneMinute = 60

const waveforms = [
  'sine',
  'triangle',
  'sawtooth',
  'square',
]

const ranges = [
  'Level',
  'Length',
  'Offset',
  'Detune',
  'Attack',
  'Decay',
] as const

const allFrequencies = [
  [   16.35,    17.32,    18.35,    19.45,    20.60,    21.83,    23.12,    24.50,    25.96,    27.50,    29.14,    30.87,    32.70],
  [   32.70,    34.65,    36.71,    38.89,    41.20,    43.65,    46.25,    49.00,    51.91,    55.00,    58.27,    61.74,    65.41],
  [   65.41,    69.30,    73.42,    77.78,    82.41,    87.31,    92.50,    98.00,   103.83,   110.00,   116.54,   123.47,   130.81],
  [  130.81,   138.59,   146.83,   155.56,   164.81,   174.61,   185.00,   196.00,   207.65,   220.00,   233.08,   246.94,   261.63],
  [  261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392.00,   415.30,   440.00,   466.16,   493.88,   523.25],
  [  523.25,   554.37,   587.33,   622.25,   659.25,   698.46,   739.99,   783.99,   830.61,   880.00,   932.33,   987.77,  1046.50],
  [ 1046.50,  1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760.00,  1864.66,  1975.53,  2093.00],
  [ 2093.00,  2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520.00,  3729.31,  3951.07,  4186.01],
  [ 4186.01,  4434.92,  4698.63,  4978.03,  5274.04,  5587.65,  5919.91,  6271.93,  6644.88,  7040.00,  7458.62,  7902.13,  8372.02],
  [ 8372.02,  8869.84,  9397.26,  9956.06, 10548.08, 11175.30, 11839.82, 12543.86, 13289.76, 14080.00, 14917.24, 15804.26, 16744.04],
  [16744.04, 17739.68, 18794.52, 19912.12, 21096.16, 22350.60, 23679.64, 25087.72, 26579.52, 28160.00, 29834.48, 31608.52, 33488.08]
]

const buttonGroups = [
  { 
    label: 'Piano' as const, 
    id: 'piano' as const,
    className: 'notes',
    component: VoicePiano
  },
  {
    label: 'Octaves',
    buttons: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    id: "octaves",
    className: "octaves",
    columns: 2,
    component: ButtonGrid
  },
  {
    label: 'Intervals',
    buttons: ['4', '2', '1', '0.5', '0.25', '0.125'],
    id: "intervals",
    className: "intervals",
    columns: 2,
    component: ButtonGrid
  },
  {
    label: 'Sounds',
    buttons: [
      ...waveforms,
      ...nonFolderSamples,
      ...Object.keys(sampleFolders)
    ],
    id: "sounds",
    className: "sounds", 
    columns: 4,
    component: ButtonGrid
  }
]

const sliders = [
  {
    label: 'BPM',
    value: 'bpm',
    attrName: 'bpm',
    min: 1,
    max: 480,
    className: 'single',
    row: 0
  },
  {
    label: 'Rest',
    value: 'restChance',
    attrName: 'restChance',
    min: 0,
    max: 100,
    className: 'single',
    row: 0
  },

  {
    label: 'Level',
    value: 'Level',
    attrName: 'level',
    min: 0,
    max: 100,
    row: 1
  },
  {
    label: 'Length',
    value: 'Length',
    attrName: 'length',
    min: 0,
    max: 100,
    row: 1
  },
  {
    label: 'Attack',
    value: 'Attack',
    attrName: 'attack',
    min: 0,
    max: 100,
    row: 2
  },
  {
    label: 'Decay',
    value: 'Decay',
    attrName: 'decay',
    min: 0,
    max: 100,
    row: 2
  },
  {
    label: 'Offset',
    value: 'Offset',
    attrName: 'offset',
    min: 0,
    max: 100,
    row: 3
  },
  {
    label: 'Detune',
    value: 'Detune',
    attrName: 'detune',
    min: -100,
    max: 100,
    row: 3
  }
]

const demoVoices = [
  {
    id: "99bb5175-c2e8-4dd5-8eeb-807268c83830",
    isActive: true,
    label: "kick",
    nextInterval: 0,
    bpm: 120,
    minLevel: 100,
    maxLevel: 100,
    activeNotes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['2'],
    activeIntervals: ["1", "0.5"],
    activeSounds: ["AcousticBassDrum"],
    activeFrequencies: [],
    restChance: 25,
    minLength: 0,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 0,
    maxAttack: 0,
    minDecay: 0,
    maxDecay: 0,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#ff0000"
  },
  {
    id: "9cda77a4-04ea-484c-baf4-2e4c8ba9736c",
    isActive: true,
    label: "snare",
    nextInterval: 0,
    bpm: 120,
    minLevel: 100,
    maxLevel: 100,
    activeNotes:  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['3'],
    activeIntervals: ["2"],
    activeSounds: ["AcousticSnare"],
    activeFrequencies: [],
    restChance: 0,
    minLength: 0,
    maxLength: 100,
    minOffset: 50,
    maxOffset: 50,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 0,
    maxAttack: 0,
    minDecay: 0,
    maxDecay: 0,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#ff8800"
  },
    {
    id: "c6dcf197-e0d3-4941-876c-1c6f05dac8fc",
    isActive: true,
    label: "hi hat",
    nextInterval: 0,
    bpm: 120,
    minLevel: 48,
    maxLevel: 49,
    activeNotes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['8'],
    activeIntervals: ["1"],
    activeSounds: ["ClosedHiHat"],
    activeFrequencies: [],
    restChance: 0,
    minLength: 25,
    maxLength: 100,
    minOffset: 50,
    maxOffset: 50,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 0,
    maxAttack: 100,
    minDecay: 0,
    maxDecay: 100,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#ffee00"
  },
  {
    id: "7c9db110-eb12-42e8-b24d-c366eb21dd81",
    isActive: true,
    label: "perc",
    nextInterval: 0,
    bpm: 120,
    minLevel: 0,
    maxLevel: 25,
    activeNotes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    activeIntervals: ["0.25"],
    activeSounds: [
      "HighBongo",
      "OpenHi-Hat",
      "HandClap",
      "Maracas",
      "MidTom",
      "PedalHiHat",
      "ShortWhistle",
      "SideStick",
      "Tambourine",
      "WoodBlock",
      "ShortGuiro",
      "MutedTriangle",
      "MutedConga",
      "LowAgogo",
      "LowBongo",
      "LowConga",
      "HighConga",
      "Cowbell",
      "ClosedHiHat",
      "HighAgogo",
      "Claves",
      "Cabasa",
      "HighTom",
      "LowTom",
      "ElectricSnare",
    ],
    activeFrequencies: [],
    restChance: 0,
    minLength: 100,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 100,
    maxAttack: 100,
    minDecay: 100,
    maxDecay: 100,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#33ff00"
  },
  {
    id: "6e288e57-7bc3-4719-a4ab-120b2a16b4b1",
    isActive: true,
    label: "perc",
    nextInterval: 0,
    bpm: 120,
    minLevel: 0,
    maxLevel: 25,
    activeNotes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    activeIntervals: ["0.25"],
    activeSounds: [
      "HighBongo",
      "OpenHi-Hat",
      "HandClap",
      "Maracas",
      "MidTom",
      "PedalHiHat",
      "ShortWhistle",
      "SideStick",
      "Tambourine",
      "WoodBlock",
      "ShortGuiro",
      "MutedTriangle",
      "MutedConga",
      "LowAgogo",
      "LowBongo",
      "LowConga",
      "HighConga",
      "Cowbell",
      "ClosedHiHat",
      "HighAgogo",
      "Claves",
      "Cabasa",
      "HighTom",
      "LowTom",
      "ElectricSnare",
    ],
    activeFrequencies: [],
    restChance: 0,
    minLength: 100,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 100,
    maxAttack: 100,
    minDecay: 100,
    maxDecay: 100,
    thisInterval: 0,
    colour: "#0400ff"
  },
  {
    id: "0dd0632e-4dfb-4cbc-a887-a2bf716ccb55",
    isActive: true,
    label: "perc",
    nextInterval: 0,
    bpm: 120,
    minLevel: 0,
    maxLevel: 25,
    activeNotes: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'],
    activeOctaves: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    activeIntervals: ["0.25"],
    activeSounds: [
      "HighBongo",
      "OpenHi-Hat",
      "HandClap",
      "Maracas",
      "MidTom",
      "PedalHiHat",
      "ShortWhistle",
      "SideStick",
      "Tambourine",
      "WoodBlock",
      "ShortGuiro",
      "MutedTriangle",
      "MutedConga",
      "LowAgogo",
      "LowBongo",
      "LowConga",
      "HighConga",
      "Cowbell",
      "ClosedHiHat",
      "HighAgogo",
      "Claves",
      "Cabasa",
      "HighTom",
      "LowTom",
      "ElectricSnare",
    ],
    activeFrequencies: [],
    restChance: 0,
    minLength: 100,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 100,
    maxAttack: 100,
    minDecay: 100,
    maxDecay: 100,
    thisInterval: 0,
    colour: "#ae00ff"
  },
  {
    id: "97ecfcd9-c0d0-42a0-a887-184fae815b06",
    isActive: true,
    label: "bass",
    nextInterval: 0,
    bpm: 120,
    minLevel: 25,
    maxLevel: 26,
    activeNotes: ["1", "6", "8", "11", "13"],
    activeOctaves: ["1", "2"],
    activeIntervals: ["0.5", "0.25"],
    activeSounds: ["square"],
    activeFrequencies: [32.70, 43.65, 49.00, 58.27, 65.41, 87.31, 98.00, 116.54, 130.81],
    restChance: 25,
    minLength: 25,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 0,
    maxAttack: 0,
    minDecay: 0,
    maxDecay: 0,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#ff00d4"
  },
    {
    id: "0c4f5a93-2228-427c-a4f8-342d9c7a8c38",
    isActive: true,
    label: "lead",
    nextInterval: 0,
    bpm: 120,
    minLevel: 26,
    maxLevel: 49,
    activeNotes: ["1", "6", "8", "11", "13"],
    activeOctaves: ["3"],
    activeIntervals: ["1", "0.5"],
    activeSounds: ["sawtooth"],
    activeFrequencies: [130.81, 74.61, 196.00, 233.08, 261.63],
    restChance: 0,
    minLength: 25,
    maxLength: 100,
    minOffset: 0,
    maxOffset: 0,
    minDetune: 0,
    maxDetune: 0,
    minAttack: 0,
    maxAttack: 100,
    minDecay: 0,
    maxDecay: 100,
    thisInterval: 0,
    offsetInterval: 0,
    colour: "#00e1ff"
  }
];

const noteNameToIndex: Record<string, number> = {  
  C:0, B:1, Bb:2, A:3, Ab:4, G:5, Gb:6, F:7, E:8, Eb:9, D:10, Db:11  
}
 
export {
  title,
  addLabel,
  allFrequencies,
  waveforms,
  ranges,
  buttonGroups,
  sliders,
  extrema,
  oneMinute,
  samples,
  sampleFolders,
  demoVoices,
  buttonImages,
  noteNameToIndex
}