import React from 'react'
import loading from '@/public/images/loading.svg'
import Image from 'next/image'

const Loading = () => {
  return (
<div className="flex items-start mt-12 justify-center h-full w-full">
      <Image src={loading.src} height={80} width={80} alt="Loading..." />
    </div>
  )
}

export default Loading