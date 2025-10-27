import React from 'react'

const Title = ({title, subTitle}) => {
  return (
    <div>
      <h1 className='font-medium text-3xl'>{title}</h1>
      <p className='text-gray-500/90 text-sm md:text-base mt-2 max-w-156'>{subTitle}</p>
    </div>
  )
}

export default Title