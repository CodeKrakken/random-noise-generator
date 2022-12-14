export default function Node(props) {

  const { node, i, setNodes, nodes, scales, waveShapes, intervals, handleDelete, notes } = props

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
        <div className="row inner-row">BPM</div>
        <div className="row inner-row">Min level</div>
        <div className="row inner-row">Max level</div>
        <div className="row inner-row">Min length %</div>
        <div className="row inner-row">Max length %</div>
        <div className="row inner-row">Rest %</div>
        <div className="row inner-row">Offset %</div>
        <div className="row inner-row">Sharpen %</div>
        <div className="row inner-row">Attack ms</div>
        <div className="row inner-row">Release ms</div>

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
            title={'offset'}
            id={`offset${i}`}
            type="number" 
            value={node.offset}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], offset: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'sharpen'}
            id={`sharpen${i}`}
            type="number" 
            value={node.sharpen}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], sharpen: +e.target.value}, nodes.slice(i+1)].flat())}
            min={-100}
            max={100}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'attack'}
            id={`attack${i}`}
            type="number" 
            value={node.attack}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], attack: +e.target.value}, nodes.slice(i+1)].flat())}
            maxlength={4}
          />
        </div>

        <div className="row inner-row">
          <input
            className='textbox'
            title={'release'}
            id={`release${i}`}
            type="number" 
            value={node.release}
            onChange={(e) => setNodes([nodes.slice(0, i), {...nodes[i], release: +e.target.value}, nodes.slice(i+1)].flat())}
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