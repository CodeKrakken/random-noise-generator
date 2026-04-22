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

type nodeAttribute = 
  'label' 
| 'bpm' 
| 'rest' 
| 'minLevel' 
| 'maxLevel' 
| 'minNoteLength' 
| 'maxNoteLength' 
| 'minOffset'
| 'maxOffset' 
| 'minDetune' 
| 'maxDetune' 
| 'minFadeIn' 
| 'maxFadeIn'
| 'minFadeOut' 
| 'maxFadeOut'

export default function Node(props: props) {

  const updateNode = (e: any, attribute: nodeAttribute) => {
    nodes[i][attribute] = +e.target!.value
    setNodes([nodes.slice(0,i), nodes[i], nodes.slice(i+1)].flat())
  } 

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

  const attributes: any = {
    label: [
      {
        className: 'textbox',  
        title: "Label",
        label: "Name",
        id: `label${i}`,
        'data-testid': `node-label-${i}`,
        type: "text",
        value: node.label,
        onChange: (e: any) => updateNode(e, 'label')
      }
    ],
    bpm: [
      {
        className: 'textbox',
        title: "BPM",
        label: "BPM",
        id: `bpm${i}`,
        type: "number",
        value: node.bpm,
        onChange: (e: any) => updateNode(e, 'bpm'),
        maxLength: 5,
        min: 0,
        max: 60000
      }
    ],
    restChance: [
      {
        className: 'textbox',
        title: 'Rest %',
        label: 'Rest %',
        id: `rest${i}`,
        type: "number",
        value: node.rest,
        onChange: (e: any) => updateNode(e, 'rest'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    level: [
      {
        className: 'textbox',
        title: 'Min Level',
        label: 'Level',
        id: `minLevel${i}`,
        type: "number",
        value: node.minLevel,
        onChange: (e: any) => updateNode(e, 'minLevel'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Level',
        id: `maxLevel${i}`,
        type: "number",
        value: node.maxLevel,
        onChange: (e: any) => updateNode(e, 'maxLevel'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    length: [
      {
        className: 'textbox',
        title: 'Min Length',
        label: 'Length',
        id: `minLength${i}`,
        type: "number",
        value: node.minNoteLength,
        onChange: (e: any) => updateNode(e, 'minNoteLength'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Length',
        id: `maxLength${i}`,
        type: "number",
        value: node.maxNoteLength,
        onChange: (e: any) => updateNode(e, 'maxNoteLength'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    offset: [
      {
        className: 'textbox',
        title: 'Min Offset',
        label: 'Offset',
        id: `minOffset${i}`,
        type: "number",
        value: node.minOffset,
        onChange: (e: any) => updateNode(e, 'minOffset'),
        min:0,
        max:100,
        maxLength:3
      },
      {
        className: 'textbox',
        title: 'Max Offset',
        id: `maxOffset${i}`,
        type: "number",
        value: node.maxOffset,
        onChange: (e: any) => updateNode(e, 'maxOffset'),
        min:0,
        max:100,
        maxLength:3
      }
    ],
    detune: [
      {
        className: 'textbox',
        title: 'detune',
        label: 'Detune',
        id: `minDetune${i}`,
        type: "number",
        value: node.minDetune,
        onChange: (e: any) => updateNode(e, 'minDetune'),
        min:-100,
        max:100,
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'detune',
        id: `maxDetune${i}`,
        type: "number",
        value: node.maxDetune,
        onChange: (e: any) => updateNode(e, 'maxDetune'),
        min:-100,
        max:100,
        maxLength:4
      }
    ],
    fadeIn: [
      {
        className: 'textbox',
        title: 'Min Fade In',
        label: 'Fade In',
        id: `minFadeIn${i}`,
        type: "number",
        value: node.minFadeIn,
        onChange: (e: any) => updateNode(e, 'minFadeIn'),
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'Max Fade In',
        id: `maxFadeIn${i}`,
        type: "number",
        value: node.maxFadeIn,
        onChange: (e: any) => updateNode(e, 'maxFadeIn'),
        maxLength:4
      }
    ],
    fadeOut: [
      {
        className: 'textbox',
        title: 'Min Fade Out',
        label: 'Fade Out',
        id: `minFadeOut${i}`,
        type: "number",
        value: node.minFadeOut,
        onChange: (e: any) => updateNode(e, 'minFadeOut'),
        maxLength:4
      },
      {
        className: 'textbox',
        title: 'Max Fade Out',
        id: `maxFadeOut${i}`,
        type: "number",
        value: node.maxFadeOut,
        onChange: (e: any) => updateNode(e, 'maxFadeOut'),
        maxLength:4
      }
    ]
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
          Object.keys(attributes).map(attribute => 
            <div className="row inner-row">
              {
                attributes[attribute].map((input: any) => {

                const {
                  title,
                  label,
                  className,
                  id,
                  type,
                  value,
                  onChange,
                  maxLength,
                  min,
                  max
                } = input

                const dataTestId = input['data-testid']

                return (
                
                  <>
                    {
                      label && <div className="label">
                        {label}
                      </div>
                    }
                    <div>
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
                  </>
                )
                })
              }
            </div>
          )
        }
      </div>
    

      <div className="column">
        <div className="row inner-row">
          {
            notes.map((note, j) => 
              <div key={`note-${j}`}>
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
            scales.map((scale, j) =>
              <div key={`scale-${j}`}>
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
            waveShapes.map((waveShape, j) => {
              return <div key={`waveShape-${j}`}>
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
            intervals.map((interval, j) => {
              return <div key={`interval-${j}`}>
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
      <button 
        id="delete-node"
        onClick={(e) => handleDelete(i, e)}
        data-testid={`delete-node-${i}`}
      >
        X
      </button>
    </div>


  </div>

}