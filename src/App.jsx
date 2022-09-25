import { useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { scales } from './data';

function App() {

  const context = new AudioContext();

  const oscillator10 = context.createOscillator();

  const gain10 = context.createGain()

  oscillator10.connect(gain10);

  gain10.connect(context.destination);

  gain10.gain.value = 0

  oscillator10.start(0);

  let cycling = false

  let i = 0

  const waveTypes = [
    'sine',
    'sawtooth',
    'triangle',
    'square'
  ]

  const [minNoteLength, setMinNoteLength] = useState(125);
  const [maxNoteLength, setMaxNoteLength] = useState(125);
  const [minFrequency , setMinFrequency ] = useState(20);
  const [maxFrequency , setMaxFrequency ] = useState(20000);
  const [checked,       setChecked      ] = useState(false)
  const [activeKeys,    setActiveKeys   ] = useState([])
  const [activeNumbers, setActiveNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

  const getRandomFrequency = () => {
    const minFrequency = +document.getElementById('minFrequency').value
    const maxFrequency = +document.getElementById('maxFrequency').value
    const activeFrequencies = getActiveFrequencies() 
    let filteredFrequencies = activeFrequencies.filter(frequency => frequency >= minFrequency && frequency <= maxFrequency)
    const randomIndex = Math.floor(Math.random()*filteredFrequencies.length)

    return filteredFrequencies[randomIndex]
  }

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  }

  const getActiveFrequencies = () => {

    let activeScales = {}

    if (activeKeys.length) {

      activeKeys.map(key => {
        activeScales[key] = JSON.parse(JSON.stringify(scales[key]))
      })

    } else {
      activeScales = JSON.parse(JSON.stringify(scales))
    }

    const sortedActiveNumbers = activeNumbers.sort((a, b) => b - a)

    Object.keys(activeScales).map(key => {
      console.log(activeScales[key])
    })
    console.log(sortedActiveNumbers)
    console.log(activeScales)
    
    
    const frequencyArray = Object.keys(activeScales).map(key => scales[key]).flat(Infinity)

    return frequencyArray
  }

  const stopNote = () => {
    gain10.gain.value = 0
    playNote()
  }

  const playNote = function(e) {
    if (cycling)  {
      const minLength = +document.getElementById('minLength').value
      const maxLength = +document.getElementById('maxLength').value
      const noteLength = minLength + (Math.random() * (maxLength - minLength))
      const waveType = waveTypes[Math.floor(Math.random() * 4)]
      oscillator10.type = waveType
      const frequency = getRandomFrequency();

      try {
        oscillator10.frequency.value = frequency
      } catch (error) {
        console.log(error)
      }
      
      const level = Math.random()
      gain10.gain.value = level
      setTimeout(stopNote, noteLength)
    }
  }

  const start = () => {
    cycling = true
    context.resume()
    playNote()
  }
  
  const startStop = () => {
    if (cycling) {
      gain10.gain.value = 0
      cycling = false
    } else {
      start()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const handleChange = (e) => {

    setChecked(!checked)
    const toggledKey = e.target.value

    if (activeKeys.includes(toggledKey)) {
      const toggledKeyIndex = activeKeys.indexOf(toggledKey)
      activeKeys.splice(toggledKeyIndex, 1)
    } else {
      activeKeys.push(toggledKey)
    }
  }


  const handleNumberChange = (e) => {

    setChecked(!checked)
    const toggledNumber = +e.target.value

    if (activeNumbers.includes(toggledNumber)) {
      const toggledNumberIndex = activeNumbers.indexOf(toggledNumber)
      activeNumbers.splice(toggledNumberIndex, 1)
    } else {
      activeNumbers.push(toggledNumber)
    }
  }


  const inputs = [
    {
      id: 'minLength',
      value: minNoteLength,
      action: setMinNoteLength
    },  {
      id: 'maxLength',
      value: maxNoteLength,
      action: setMaxNoteLength
    },  {
      id: 'minFrequency',
      value:  minFrequency,
      action: setMinFrequency
    },  {
      id: 'maxFrequency',
      value:  maxFrequency,
      action: setMaxFrequency
    }
  ]

  const numbers = [1,2,3,4,5,6,7,8,9,10,11,12]

  return (
    <div>
      RANDOM NOISE GENERATOR
      <button value="Start/Stop" onClick={startStop}>Start/Stop</button>
      <form onSubmit={handleSubmit}>
        {
          inputs.map(input => 
            <input
              id={input.id}
              type="number" 
              value={input.value}
              onChange={(e) => +e !== NaN && input.action(+e.target.value)}
            />
          )
        }
      </form>
      {
        Object.keys(scales).map(key => {
          const scaleLabels = Object.keys(scales)
          return <>
            {scaleLabels.indexOf(key) === Math.ceil(scaleLabels.length/2) && <br/>}
            <label>{key}</label>
            <input
              type="checkbox"
              value={key}
              checked={activeKeys.includes(key)}
              onChange={handleChange}
            />
          </>
        })
      }
      <br/>
      {
        numbers.map(number => 
          <>
            <label>{number}</label>
            <input
              type="checkbox"
              value={number}
              checked={activeNumbers.includes(number)}
              onChange={handleNumberChange}
            />
          </>
        )
      }
    </div>
  );
}

export default App;
