import React, { useState, useEffect } from 'react';

function App() {
  const [audioContext, setAudioContext] = useState(null);
  const [oscillator, setOscillator] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    // Initialize the Web Audio API context and oscillator
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = 'sine'; // You can change the waveform type if needed
    osc.frequency.setValueAtTime(440, context.currentTime); // Set the initial frequency
    osc.connect(context.destination);

    setAudioContext(context);
    setOscillator(osc);

    return () => {
      // Cleanup when the component unmounts
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const getRandomDuration = () => {
    // Generate a random duration between 0.5 and 2 seconds
    return Math.random() * 1.5 + 0.5;
  };

  const toggleNote = () => {
    if (isPlaying) {
      oscillator.stop();
      setIsPlaying(false);
      clearInterval(intervalId);
    } else {
      oscillator.start();
      setIsPlaying(true);

      const playNote = () => {
        // Generate a new frequency (e.g., random frequency)
        const newFrequency = Math.random() * 1000 + 400;
        oscillator.frequency.setValueAtTime(newFrequency, audioContext.currentTime);
        
        // Play the note with a random duration
        oscillator.start();
        oscillator.stop(audioContext.currentTime + getRandomDuration());
      };

      // Play a new note every second
      const newIntervalId = setInterval(playNote, 1000);
      setIntervalId(newIntervalId);
    }
  };

  return (
    <div>
      <button onClick={toggleNote}>
        {isPlaying ? 'Stop Note' : 'Start Note'}
      </button>
    </div>
  );
}

export default App;