import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type DropdownPortalProps = {
  children: ReactNode
  anchor: HTMLElement | null
}

const DropdownPortal = ({
  children,
  anchor
}: DropdownPortalProps) => {

  if (!anchor) return null

  const rect = anchor.getBoundingClientRect()

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: rect.bottom,
        left: rect.left,
        zIndex: 1000
      }}
    >
      {children}
    </div>,
    document.body
  )
}

export default DropdownPortal
