export default function HitDetails({
  sound
} : {
  sound: string
}) {
  
  return <div className="component-border hit-details">
    {sound}
  </div>
}