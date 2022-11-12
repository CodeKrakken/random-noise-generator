import { useEffect, useState } from 'react';
import './App.css';
import ReactDOM from 'react-dom/client';
import { scales } from './data';
import { allFrequencies } from './data'
import Oscillator from './components/Oscillator';
// import SheetMusic from '@slnsw/react-sheet-music';

let cycling = false

function App() {

  return (
    <div>
      RANDOM NOISE GENERATOR
      <br /><br />

      <Oscillator />

      {/* <SheetMusic
      // Textual representation of music in ABC notation
      // The string below will show four crotchets in one bar
      notation="|EGBF|"
    /> */}
    </div>

    
  );
}

export default App;
