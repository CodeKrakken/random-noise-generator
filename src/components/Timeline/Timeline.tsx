import { allFrequencies } from "../../content/data"

export default function Timeline() {

  const grid = Array.from(new Set(allFrequencies.flat()))

  return <div className="column">{grid.map(freq => <div>{freq}</div>)}</div>
}