import { node } from '../../types/node'

export type props = {
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