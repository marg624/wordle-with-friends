import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'
import InfoOverlay from './info-overlay'


const OptionsButton = () => {

  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="sm:mx-0">
      <button className="w-14 h-14 hover:scale-110 rounded-full bg-gradient-to-r from-amber-300 to-amber-900 text-white shadow-2xl"
        style={{
          position: 'fixed',
          bottom: 15,
          right: 15,
        }}
        onClick={() => setShowOptions(!showOptions)}
      >
        +
      </button>
      {showOptions && (
        <InfoOverlay />
      )}
    </div>
  )
}

export default OptionsButton
