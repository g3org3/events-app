import { Input } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

import { useDebounce } from './debounce.hook'

export default function SearchEventInput({ query }: { query: string }) {
  const [state, setState] = useState(query)
  const debouncedValue = useDebounce(state, 400)
  const navigate = useNavigate({ from: '/' })

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        query: debouncedValue
      })
    })
  }, [debouncedValue])

  return (
    <Input
      placeholder="search"
      value={state}
      onChange={(e) => setState(e.target.value)}
    />
  )
}
