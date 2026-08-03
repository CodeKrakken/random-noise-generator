import { useEffect, useRef } from 'react'
import { Renderer, Stave } from 'vexflow'

const MusicStave = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    )

    renderer.resize(500, 200)

    const context = renderer.getContext()

    const stave = new Stave(10, 40, 400)

    stave
      .addClef('treble')
      .setContext(context)
      .draw()
  }, [])

  return <div ref={containerRef} />
}

export default MusicStave