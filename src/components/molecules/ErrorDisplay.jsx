import { useEffect, useState } from 'react'
import { IoClose } from 'react-icons/io5'

import { Button } from '@/components/atoms'

const ErrorDisplay = ({ error }) => {
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    setClosed(false)
  }, [error])

  return error && !closed ? (
    <div className="bg-red-400 mb-4 p-4 rounded-lg text-white drop-shadow-lg">
      <div className="flex items-stretch">
        <span className="grow">Oops...</span>
        <Button unstyled onClick={() => setClosed(true)}>
          <IoClose />
        </Button>
      </div>
      <p className='text-2xl'>
        {error.message}
      </p>
    </div>
  ) : null
}

export {
  ErrorDisplay,
}
