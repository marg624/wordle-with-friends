import cn from 'classnames'
import Link from 'next/link'
import Image from 'next/image'
import React, {useState} from 'react'


const InfoOverlay = () => {

  return (
    <div className="flex justify-center" >
        <div className="bg-white bg-opacity-50" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          width: '100%'
        }}>
          
        </div>
    </div>  
  )
}

export default InfoOverlay
