// Magnet.jsx
// Source originale : React Bits — https://reactbits.dev/animations/magnet
// Ce composant enveloppe n'importe quel élément enfant et lui ajoute
// un effet magnétique : l'élément glisse vers la souris quand elle est proche.

import { useState, useEffect, useRef } from 'react'

const Magnet = ({
  children,
  padding        = 100,   // Zone d'attraction autour du bouton (en px)
  disabled       = false, // Si true, l'effet est désactivé
  magnetStrength = 2,     // Plus le chiffre est grand, moins l'attraction est forte
  activeTransition   = 'transform 0.3s ease-out',   // Animation pendant l'attraction
  inactiveTransition = 'transform 0.5s ease-in-out', // Animation au retour
  wrapperClassName = '',
  innerClassName   = '',
  ...props
}) => {
  const [isActive, setIsActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const magnetRef = useRef(null)

  useEffect(() => {
    if (disabled) {
      setPosition({ x: 0, y: 0 })
      return
    }

    const handleMouseMove = e => {
      if (!magnetRef.current) return

      // On récupère la position et la taille du bouton dans la page
      const { left, top, width, height } = magnetRef.current.getBoundingClientRect()
      const centerX = left + width  / 2
      const centerY = top  + height / 2

      // On calcule la distance entre la souris et le centre du bouton
      const distX = Math.abs(centerX - e.clientX)
      const distY = Math.abs(centerY - e.clientY)

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        // La souris est dans la zone d'attraction → on active l'effet
        setIsActive(true)
        const offsetX = (e.clientX - centerX) / magnetStrength
        const offsetY = (e.clientY - centerY) / magnetStrength
        setPosition({ x: offsetX, y: offsetY })
      } else {
        // La souris est trop loin → le bouton revient à sa place
        setIsActive(false)
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [padding, disabled, magnetStrength])

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform:   `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition:  isActive ? activeTransition : inactiveTransition,
          willChange:  'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Magnet