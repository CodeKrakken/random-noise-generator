import { node } from '../../types/node'

type props = {
  node        : node, 
  i           : number, 
  setNodes    : Function, 
  nodes       : node[], 
  scales      : number[], 
  waveShapes  : string[], 
  intervals   : number[], 
  handleDelete: Function, 
  notes       : number[]
}

export default function Node(props: props) {

  const {
    node, 
    i, 
    setNodes, 
    nodes, 
    scales, 
    waveShapes, 
    intervals, 
    handleDelete, 
    notes
  } = props

  const inputs: any = {
    label: {
      className: 'textbox',  
      title: "Label",
      id: `label${i}`,
      'data-testid': `node-label-${i}`,
      type: "text",
      value: node.label,
      onChange: (e: any) => setNodes([nodes.slice(0,i), {...nodes[i], label: +e.target!.value}, nodes.slice(i+1)].flat())
    },
    bpm: {
      className: 'textbox',
      title: "BPM",
      id: `bpm${i}`,
      type: "number",
      value: node.bpm,
      onChange: (e: any) => setNodes([nodes.slice(0,i), {...nodes[i], bpm: +e.target.value}, nodes.slice(i+1)].flat()),
      maxLength: 5,
      min: 0,
      max: 60000
    },
    minLevel: {
      className: 'textbox',
      title: 'Min level',
      id: `minLevel${i}`,
      type: "number",
      value: node.minLevel,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minLevel: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    maxLevel: {
      className: 'textbox',
      title: 'Max level',
      id: `maxLevel${i}`,
      type: "number",
      value: node.maxLevel,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxLevel: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    minLength: {
      className: 'textbox',
      title: 'min length',
      id: `minLength${i}`,
      type: "number",
      value: node.minNoteLength,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minNoteLength: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    maxLength: {
      className: 'textbox',
      title: 'max length',
      id: `maxLength${i}`,
      type: "number",
      value: node.maxNoteLength,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxNoteLength: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    restChance: {
      className: 'textbox',
      title: 'Rest %',
      id: `restChance${i}`,
      type: "number",
      value: node.rest,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], rest: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    minOffset: {
      className: 'textbox',
      title: 'Min offset',
      id: `minOffset${i}`,
      type: "number",
      value: node.minOffset,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minOffset: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    maxOffset: {
      className: 'textbox',
      title: 'Max offset',
      id: `maxOffset${i}`,
      type: "number",
      value: node.maxOffset,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxOffset: +e.target.value}, nodes.slice(i+1)].flat()),
      min:0,
      max:100,
      maxLength:3
    },
    minDetune: {
      className: 'textbox',
      title: 'detune',
      id: `min detune${i}`,
      type: "number",
      value: node.minDetune,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minDetune: +e.target.value}, nodes.slice(i+1)].flat()),
      min:-100,
      max:100,
      maxLength:4
    },
    maxDetune: {
      className: 'textbox',
      title: 'detune',
      id: `detune${i}`,
      type: "number",
      value: node.maxDetune,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxDetune: +e.target.value}, nodes.slice(i+1)].flat()),
      min:-100,
      max:100,
      maxLength:4
    },
    minFadeIn: {
      className: 'textbox',
      title: 'min fade in',
      id: `min fade in${i}`,
      type: "number",
      value: node.minFadeIn,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minFadeIn: +e.target.value}, nodes.slice(i+1)].flat()),
      maxLength:4
    },
    maxFadeIn: {
      className: 'textbox',
      title: 'max fade in',
      id: `max fade in${i}`,
      type: "number",
      value: node.maxFadeIn,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxFadeIn: +e.target.value}, nodes.slice(i+1)].flat()),
      maxLength:4
    },
    minFadeOut: {
      className: 'textbox',
      title: 'min fade out',
      id: `min fade out${i}`,
      type: "number",
      value: node.minFadeOut,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], minFadeOut: +e.target.value}, nodes.slice(i+1)].flat()),
      maxLength:4
    },
    maxFadeOut: {
      className: 'textbox',
      title: 'max fade out',
      id: `max fade out${i}`,
      type: "number",
      value: node.maxFadeOut,
      onChange: (e: any) => setNodes([nodes.slice(0, i), {...nodes[i], maxFadeOut: +e.target.value}, nodes.slice(i+1)].flat()),
      maxLength:4
    }
  }

  return <div 
    className="node" 
    id={`node${i}`}
    data-testid={`node-${i}`}
    key={`node-${i}`}
  >
    <div className="row">
      <div className="column">
        {
          Object.keys(inputs).map(input => {

            const {
              title,
              className,
              id,
              type,
              value,
              onChange,
              maxLength,
              min,
              max
            } = inputs[input]

            const dataTestId = inputs[input]['data-testid']

            return <>
              <div className="row inner-row">
                <div className="label">
                  {title}
                </div>
                <div className="textbox">
                  <input 
                    className={className}
                    title={title}
                    id={id}
                    data-testid={dataTestId}
                    type={type} 
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength}
                    min={min}
                    max={max}
                  />
                </div>
              </div>
            </>
          })
        }
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
            notes.map((note, i) => 
              <div key={`note-${i}`}>
                <input
                  className={`note${i}`}
                  title={note.toString()}
                  type="checkbox"
                  value={note}
                  checked={node.activeNotes?.includes(note)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeNotes: node.activeNotes.includes(+e.target.value) ? node.activeNotes.filter(note => note !== +e.target.value) : [node.activeNotes, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </div>
            )
          }
        </div>
        <div className="row inner-row">
          {
            scales.map((scale, i) =>
              <div key={`scale-${i}`}>
                <input
                  className={`scale${i}`}
                  title={scale.toString()}
                  type="checkbox"
                  value={scale}
                  checked={node.activeScales.includes(scale)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeScales: node.activeScales.includes(+e.target.value) ? node.activeScales.filter(note => note !== +e.target.value) : [node.activeScales, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </div>
            )
          }
        </div>
        <div className="row inner-row">
          { 
            waveShapes.map((waveShape, i) => {
              return <div key={`waveShape-${i}`}>
                <input
                  title={waveShape}
                  className={`wave${i}`}
                  type="checkbox"
                  value={waveShape}
                  checked={node.activeWaveShapes.includes(waveShape)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeWaveShapes: node.activeWaveShapes.includes(e.target.value) ? node.activeWaveShapes.filter(waveShape => waveShape !== e.target.value) : [node.activeWaveShapes, e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </div>
            })
          }
        </div>
        <div className="row inner-row">
          { 
            intervals.map((interval, i) => {
              return <div key={`interval-${i}`}>
                <input
                  className={`interval${i}`}
                  title={interval.toString()}
                  type="checkbox"
                  value={interval}
                  checked={node.activeIntervals.includes(interval)}
                  onChange={(e) => setNodes([nodes.slice(0,i), {...nodes[i], activeIntervals: node.activeIntervals.includes(+e.target.value) ? node.activeIntervals.filter(interval => interval !== +e.target.value) : [node.activeIntervals, +e.target.value].flat()}, nodes.slice(i+1)].flat())}
                />
              </div>
            })
          }
        </div>
      </div>
      <div className="column">
        <button 
          id={`delete-node${i}`} 
          onClick={(e) => handleDelete(i, e)}
          data-testid={`delete-node-${i}`}
        >X</button>
      </div>
    </div>
  </div>
}