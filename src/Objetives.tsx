import { Button, Flex, Input, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'

import { getEvents } from './pb'
import { useEffect, useState } from 'react'
import { objectivesRoute } from './Router'
import { useDebounce } from './debounce.hook'

function SearchEventInput() {
  const [state, setState] = useState('')
  const debouncedValue = useDebounce(state, 400)
  const navigate = useNavigate({ from: objectivesRoute.fullPath })

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

export default function Objectives() {
  const search = useSearch({
    from: objectivesRoute.fullPath,
  })
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', search.query],
    queryFn: () => getEvents(search.query),
  })
  const [ignoreE, setIgnoreE] = useState<string[]>([])
  const [ignoreNs, setIgnoreNs] = useState<string[]>([])

  let filteredEvents = events.filter(e => !ignoreE.includes(e.id))
  filteredEvents = filteredEvents.filter(e => e.pending.filter(p => !ignoreNs.includes(p.id)).length > 0)

  const addNs = (id: string) => setIgnoreNs((old) => old.concat([id]))
  const addE = (id: string) => setIgnoreE((old) => old.concat([id]))

  return (
    <Flex bg="white" m="5" p="5" shadow="lg" gap="4" flexDir="column">
      <SearchEventInput />
      {isLoading && <>
        <Skeleton height="54px" rounded="md" />
        <Skeleton height="54px" rounded="md" />
      </>}
      {filteredEvents.map(event => (
        <Flex flexDir="column">
          <Flex p="2" border="1px solid black">
            <Flex flex="1">
              <Link to="/event/$id/next-steps" params={{ id: event.id }}>{event.title}</Link>
            </Flex>
            <Button size="xs" onClick={() => addE(event.id)}>ignore</Button>
          </Flex>
          <Flex p="2" flexDir="column">
            {event.pending.filter(p => !ignoreNs.includes(p.id)).map((ns, i) => (
              <Flex gap="2" p="1" bg={i % 2 === 0 ? "blue.50" : 'white'}>
                <Button size="xs" onClick={() => addNs(ns.id)}>ignore</Button>
                <Flex flex="1">{ns.title}</Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
