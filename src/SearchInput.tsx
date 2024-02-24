import { Input } from '@chakra-ui/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

import { useDebounce } from './debounce.hook'

export default function SearchEventInput() {
  const [state, setState] = useState('')
  const debouncedValue = useDebounce(state, 400)
  const search = useSearch({ strict: false })
  const navigate = useNavigate({ from: '/' })

  useEffect(() => {
    navigate({
      search: {
        ...search,
        query: debouncedValue
      }
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
