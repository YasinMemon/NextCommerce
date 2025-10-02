import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen min-w-screen flex justify-center items-center'>
      {children}
    </div>
  )
}

export default layout
