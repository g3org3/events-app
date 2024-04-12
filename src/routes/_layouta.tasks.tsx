import { Button, Flex, useColorModeValue } from '@chakra-ui/react'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

import { getEvents } from '../pb'
import { queryClient } from '../queryClient'

export const Route = createFileRoute('/_layouta/tasks')({
  staleTime: 10 * 60 * 1000, // 10 min
  loaderDeps: ({ search: { query } }) => ({ query }),
  loader: ({ deps: { query } }) => queryClient.ensureQueryData(queryOptions({
    queryKey: ['events', query],
    queryFn: () => getEvents(query),
  })),
  component: Tasks,
  pendingComponent: () => (
    <>
      <h1>loading!!!!!!</h1>
    </>
  )
})

export default function Tasks() {
  const search = Route.useSearch()
  const { data: events = [] } = useQuery({
    queryKey: ['events', search.query],
    queryFn: () => getEvents(search.query),
  })
  const [ignoreE, setIgnoreE] = useState<string[]>([])
  const [ignoreNs, setIgnoreNs] = useState<string[]>([])

  const bluebg = useColorModeValue("blue.50", "blue.800")
  const whitebg = useColorModeValue("white", "gray.800")

  let filteredEvents = events.filter(e => !ignoreE.includes(e.id))
  filteredEvents = filteredEvents.filter(e => e.pending.filter(p => !ignoreNs.includes(p.id)).length > 0)

  const addNs = (id: string) => setIgnoreNs((old) => old.concat([id]))
  const addE = (id: string) => setIgnoreE((old) => old.concat([id]))

  return (
    <>
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
              <Flex gap="2" p="1" bg={i % 2 === 0 ? bluebg : whitebg}>
                <Button size="xs" onClick={() => addNs(ns.id)}>ignore</Button>
                <Flex flex="1">{ns.title}</Flex>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ))}
    </>
  )
}
