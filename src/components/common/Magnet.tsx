// Magnet.tsx
// Source originale : React Bits — https://reactbits.dev/animations/magnet
// Ce composant enveloppe n'importe quel élément enfant et lui ajoute
// un effet magnétique : l'élément glisse vers la souris quand elle est proche.

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number
  disabled?: boolean
  magnetStrength?: number
  activeTransition?: string
  inactiveTransition?: string
  wrapperClassName?: string
  innerClassName?: string
  [key: string]: unknown
}

const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}: MagnetProps) => {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const magnetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Si désactivé, on ne fait rien : on n'a plus besoin de setState ici,
    // la position affichée est dérivée directement au rendu (voir plus bas).
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2

      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true)
        const offsetX = (e.clientX - centerX) / magnetStrength
        const offsetY = (e.clientY - centerY) / magnetStrength
        setPosition({ x: offsetX, y: offsetY })
      } else {
        setIsActive(false)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [padding, disabled, magnetStrength])

  // Position réellement appliquée : si disabled, on force {0,0} au rendu
  // au lieu de le faire via setState dans l'effet.
  const appliedPosition = disabled ? { x: 0, y: 0 } : position

  // Si l'appelant fournit déjà une classe de positionnement (fixed/absolute/...),
  // on ne force pas 'relative' en inline style, sinon ça écrase la classe.
  const hasPositionClass = /\b(fixed|absolute|sticky|static|relative)\b/.test(wrapperClassName)

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{
        position: hasPositionClass ? undefined : 'relative',
        display: 'inline-block',
      }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${appliedPosition.x}px, ${appliedPosition.y}px, 0)`,
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Magnet