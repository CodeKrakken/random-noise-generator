export default function Node({ node, i, setNodes, nodes, scales, waveShapes, intervals, handleDelete, notes }) {

  const inputLabels = [
    'BPM', 
    'Min level', 
    'Max level', 
    'Min length %', 
    'Min length %', 
    'Rest Chance %', 
    'Min Offset %', 
    'Max Offset %',
    'Min Detune %', 
    'Max Detune %', 
    'Min Attack ms',
    'Max Attack ms',
    'Min Release ms',
    'Max Release ms'
  ]

  return <div className="node">
    <div className="row">
    <div className="column">
      <input
        className='textbox'  
        title="Label"
        id={`label${i}`}
        type="text" 
        value={node.label}
        onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], label: +e.target.value}, nodes.slice(i+1)].flat())}
      />
    </div>
    <div className="column">
      </div>
      <div className="column">
        {
          inputLabels.map(label => <div className="row inner-row">{label}</div>)
        }
      </div>

      <div className="column">
        <div className="row inner-row">
          <input
            className='textbox'  
            title="BPM"
            id={`bpm${i}`}
            type="number" 
            value={node.bpm}
            onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], bpm: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={5}
            min={0}
            max={60000}
          />
        </div>
        <div className="row inner-row">
          <input
            className='textbox'
            title={'Min volume'}
            id={`minVolume${i}`}
            type="number" 
            value={node.minVolume}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minVolume: +e.target.value}, nodes.slice(i+1)].flat())}
            min={0}
            max={100}
            maxlength={3}
          />
        </div>
        <div className="row inner-row">
          <input
            className='textbox'
            title={'Max volume'}
            id={`maxVolume${i}`}
            type="number" 
            value={node.maxVolume}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxVolume: +e.target.value}, nodes.slice(i+1)].flat())}
            min={0}
            max={100}
            maxlength={3}
          />
        </div>
        <div className="row inner-row">
          <input
            className='textbox'  
            title={'min length'}
            id={`minLength${i}`}
            type="number"
            min={0}                     
            max={100} 
            maxlength={3}
            value={node.minNoteLength}
            onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], minNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'max length'}
            id={`maxLength${i}`}
            type="number"
            min={0} 
            max={100} 
            maxlength={3}
            value={node.maxNoteLength}
            onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], maxNoteLength: +e.target.value}, nodes.slice(i+1)].flat())}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'Rest %'}
            id={`rest${i}`}
            type="number" 
            value={node.rest}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], rest: +e.target.value}, nodes.slice(i+1)].flat())}
            min={0}
            max={100}
            maxlength={3}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'min offset'}
            id={`min offset${i}`}
            type="number" 
            value={node.minOffset}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minOffset: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'max offset'}
            id={`max offset${i}`}
            type="number" 
            value={node.maxOffset}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxOffset: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'detune'}
            id={`min detune${i}`}
            type="number" 
            value={node.minDetune}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minDetune: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'detune'}
            id={`max detune${i}`}
            type="number" 
            value={node.maxDetune}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxDetune: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'min attack'}
            id={`min attack${i}`}
            type="number" 
            value={node.minAttack}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minAttack: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'max attack'}
            id={`max attack${i}`}
            type="number" 
            value={node.maxAttack}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxAttack: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'min release'}
            id={`min release${i}`}
            type="number" 
            value={node.minRelease}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], minRelease: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'max release'}
            id={`max release${i}`}
            type="number" 
            value={node.maxRelease}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], maxRelease: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={4}
          />
        </div>

      </div>

      <div className="column">
        <div className="row inner-row">
          Notes
        </div>
        <div className="row inner-row">
          Scales
        </div>
        <div className="row inner-row">
          Waves
        </div>
        <div>
          Intervals
        </div>

      </div>
      <div className="column">
        <div className="row inner-row">
          {
            notes.map(note => 
              <>
                <input
                  className={`note${i}`}
                  title={note}
                  type="checkbox"
                  value={note}
                  checked={node.activeNotes?.includes(note)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeNotes: node.activeNotes.includes(+e.target.value) ? node.activeNotes.filter(note => note !== +e.target.value) : [node.activeNotes, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </>
            )
          }
        </div>
        <div className="row inner-row">
          {
            scales.map(scale =>
              <>
                <input
                  className={`scale${i}`}
                  title={scale}
                  type="checkbox"
                  value={scale}
                  checked={node.activeScales.includes(scale)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeScales: node.activeScales.includes(+e.target.value) ? node.activeScales.filter(note => note !== +e.target.value) : [node.activeScales, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </>
            )
          }
        </div>
        <div className="row inner-row">
          { 
            waveShapes.map(waveShape => {
              return <>
                <input
                  title={waveShape}
                  className={`wave${i}`}
                  type="checkbox"
                  value={waveShape}
                  checked={node.activeWaveShapes.includes(waveShape)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeWaveShapes: node.activeWaveShapes.includes(e.target.value) ? node.activeWaveShapes.filter(waveShape => waveShape !== e.target.value) : [node.activeWaveShapes, e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </>
            })
          }
        </div>
        <div className="row inner-row">
          { 
            intervals.map(interval => {
              return <>
                <input
                  className={`interval${i}`}
                  title={interval}
                  type="checkbox"
                  value={interval}
                  checked={node.activeIntervals.includes(interval)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeIntervals: node.activeIntervals.includes(+e.target.value) ? node.activeIntervals.filter(interval => interval !== +e.target.value) : [node.activeIntervals, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </>
            })
          }
        </div>
      </div>
      <div className="column">
        <button 
          id={`delete-node${i}`} 
          onClick={(e) => handleDelete(i, e)}
        >X</button>
      </div>
    </div>
  </div>
}