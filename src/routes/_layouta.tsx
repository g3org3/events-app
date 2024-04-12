import { Flex, Input, useColorModeValue } from '@chakra-ui/react'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import z from 'zod'

import { useDebounce } from '../debounce.hook'

const searchSchema = z.object({
  query: z.string().nullish(),
})

export const Route = createFileRoute('/_layouta')({
  validateSearch: searchSchema,
  component: TasksLayout,
})


function TasksLayout() {
  const bg = useColorModeValue("white", "gray.800")
  return (
    <Flex bg={bg} m="5" p="5" shadow="lg" gap="4" flexDir="column">
      <SearchEventInput />
      <Outlet />
    </Flex>
  )
}

function SearchEventInput() {
  const search = Route.useSearch()
  const [state, setState] = useState(search.query || '')
  const debouncedValue = useDebounce(state, 400)
  const navigate = useNavigate({ from: '/tasks' })

  useEffect(() => {
    navigate({
      search: {
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
