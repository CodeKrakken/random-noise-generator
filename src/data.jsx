const frequencies = {

  C   : [16.35, 32.70,  65.41,  130.81, 261.63, 523.25, 1046.50,  2093.00,  4186.01,  8372.02,  16744.04],
  'C#': [17.32, 34.65,  69.30,  138.59, 277.18, 554.37, 1108.73,  2217.46,  4434.92,  8869.84,  17739.68],
  D   : [18.35, 36.71,  73.42,  146.83, 293.66, 587.33, 1174.66,  2349.32,  4698.63,  9397.26,  18794.52],
  'D#': [19.45, 38.89,  77.78,  155.56, 311.13, 622.25, 1244.51,  2489.02,  4978.03,  9956.06,  19912.12],
  E   : [20.60, 41.20,  82.41,  164.81, 329.63, 659.25, 1318.51,  2637.02,  5274.04,  10548.08, 21096.16],
  F   : [21.83, 43.65,  87.31,  174.61, 349.23, 698.46, 1396.91,  2793.83,  5587.65,  11175.30, 22350.60],    
  'F#': [23.12, 46.25,  92.50,  185.00, 369.99, 739.99, 1479.98,  2959.96,  5919.91,  11839.82, 23679.64],
  G   : [24.50, 49.00,  98.00,  196.00, 392.00, 783.99, 1567.98,  3135.96,  6271.93,  12543.86, 25087.72],
  'G#': [25.96, 51.91, 103.83,  207.65, 415.30, 830.61, 1661.22,  3322.44,  6644.88,  13289.76, 26579.52],
  A   : [27.50, 55.00, 110.00,  220.00, 440.00, 880.00, 1760.00,  3520.00,  7040.00,  14080.00, 28160.00],  
  'A#': [29.14, 58.27, 116.54,  233.08, 466.16, 932.33, 1864.66,  3729.31,  7458.62,  14917.24, 29834.48],      
  B   : [30.87, 61.74, 123.47,  246.94, 493.88, 987.77, 1975.53,  3951.07,  7902.13,  15804.26, 31608.52]
}

export  const scales = {
  C   : [frequencies.C    ,   frequencies.D,      frequencies.E,      frequencies.F,      frequencies.G,      frequencies.A,      frequencies.B     ],
  'C#': [frequencies['C#'],   frequencies['D#'],  frequencies.F,      frequencies['F#'],  frequencies['G#'],  frequencies['A#'],  frequencies.C     ],
  D   : [frequencies.D    ,   frequencies.E,      frequencies['F#'],  frequencies.G,      frequencies.A,      frequencies.B,      frequencies['C#'] ],
  'D#': [frequencies['D#'],   frequencies.F,      frequencies.G,      frequencies['G#'],  frequencies['A#'],  frequencies.C,      frequencies.D     ],
  E   : [frequencies.E,       frequencies['F#'],  frequencies['G#'],  frequencies.A,      frequencies.B,      frequencies['C#'],  frequencies['D#'] ],
  F   : [frequencies.F,       frequencies.G,      frequencies.A,      frequencies['A#'],  frequencies.C,      frequencies.D,      frequencies.E,    ],
  'F#': [frequencies['F#'],   frequencies['G#'],  frequencies['A#'],  frequencies.B,      frequencies['C#'],  frequencies['D#'],  frequencies.F,    ],
  G   : [frequencies.G,       frequencies.A,      frequencies.B,      frequencies.C,      frequencies.D,      frequencies.E,      frequencies['F#'] ],
  'G#': [frequencies['G#'],   frequencies['A#'],  frequencies.C,      frequencies['C#'],  frequencies['D#'],  frequencies.F,      frequencies.G,    ],
  A   : [frequencies.A,       frequencies.B,      frequencies['C#'],  frequencies.D,      frequencies.E,      frequencies['F#'],  frequencies['G#']],
  'A#': [frequencies['A#'],   frequencies.C,      frequencies.D,      frequencies['D#'],  frequencies.F,      frequencies.G,      frequencies.A,    ],
  B   : [frequencies.B,       frequencies['C#'],  frequencies['D#'],  frequencies.E,      frequencies['F#'],  frequencies['G#'],  frequencies['A#'] ],
  Am  : [frequencies.A,       frequencies.B,      frequencies.C,      frequencies.D,      frequencies.E,      frequencies.F,      frequencies['G#']],  

}

export const allFrequencies = [
  [   16.35,    17.32,    18.35,    19.45,    20.60,    21.83,    23.12,    24.50,    25.96,    27.50,    29.14,    30.87],
  [   32.70,    34.65,    36.71,    38.89,    41.20,    43.65,    46.25,    49.00,    51.91,    55.00,    58.27,    61.74],
  [   65.41,    69.30,    73.42,    77.78,    82.41,    87.31,    92.50,    98.00,   103.83,   110.00,   116.54,   123.47],
  [  130.81,   138.59,   146.83,   155.56,   164.81,    74.61,   185.00,   196.00,   207.65,   220.00,   233.08,   246.94],
  [  261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392.00,   415.30,   440.00,   466.16,   493.88],
  [  523.25,   554.37,   587.33,   622.25,   659.25,   698.46,   739.99,   783.99,   830.61,   880.00,   932.33,   987.77],
  [ 1046.50,  1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760.00,  1864.66,  1975.53],
  [ 2093.00,  2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520.00,  3729.31,  3951.07],
  [ 4186.01,  4434.92,  4698.63,  4978.03,  5274.04,  5587.65,  5919.91,  6271.93,  6644.88,  7040.00,  7458.62,  7902.13],
  [ 8372.02,  8869.84,  9397.26,  9956.06, 10548.08, 11175.30, 11839.82, 12543.86, 13289.76, 14080.00, 14917.24, 15804.26],
  [16744.04, 17739.68, 18794.52, 19912.12, 21096.16, 22350.60, 23679.64, 25087.72, 26579.52, 28160.00, 29834.48, 31608.52]
]