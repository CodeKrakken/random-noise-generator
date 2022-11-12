import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { scales } from './data';
import { allFrequencies } from './data'
import Oscillator from './components/Oscillator';
import Oscillator2 from './components/Oscillator2';

// import SheetMusic from '@slnsw/react-sheet-music';

const context = new AudioContext();

let oscillators = [<Oscillator context={context} />, <Oscillator2 context = {context} />]

const addOscillator = () => {
  oscillators.push(<Oscillator context={context} />)
  console.log(oscillators)
}



function App() {

  return (
    <div>
      RANDOM NOISE GENERATOR
      <br /><br />

      {oscillators.map(oscillator => 
        oscillator)
      }

      <button onClick={addOscillator}>Add Oscillator</button>

      {/* <SheetMusic
      // Textual representation of music in ABC notation
      // The string below will show four crotchets in one bar
      notation="|EGBF|"
    /> */}
    </div>

    
  );
}

export default App;
