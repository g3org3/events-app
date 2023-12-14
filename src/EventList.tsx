import { Flex, Button, Spacer } from '@chakra-ui/react'
import { SmallAddIcon } from '@chakra-ui/icons'
import { DateTime } from 'luxon'

import { useStore } from "./store"
import Empty from './Empty'
import CreateEventModal from './CreateEventModal'

export default function EventList() {
  const events = useStore(store => store.events)
  const nextSteps = useStore(store => store.nextSteps)
  const setEventId = useStore(store => store.actions.setEventId)
  const filteredEventIds = useStore(store => store.filteredEventIds)
  let filteredEvents = events
  if (filteredEventIds) {
    filteredEvents = filteredEvents.filter(e => filteredEventIds.includes(e.id))
  }
  if (filteredEvents.length === 0) return <Empty message="You don't have any events." action={filteredEventIds === null && <CreateEventModal />} />

  const nsEvents = filteredEvents.map(e => {
    const _next = nextSteps.filter(ns => ns.eventId === e.id)

    return {
      ...e,
      pending: _next.filter(ns => !ns.doneAt).length,
      nextSteps,
    }
  })

  return (
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {nsEvents.map(e => (
        <Flex key={e.id} alignItems="center" gap="1" p="1">
          <Flex position="relative">
            <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
            <Flex
              position="absolute"
              bottom="-25px"
              left="7px"
              height="23px"
              borderLeft="1px dashed"
              borderColor="gray.400"
              width="1px"
            />
          </Flex>
          <Button
            onClick={() => setEventId(e.id)}
            boxShadow="sm"
            flex="1"
            p="3"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            rounded="sm"
            alignItems="center"
            display="flex"
            gap="3"
          >
            <Flex fontSize="x-large">{e.title}</Flex>
            <Spacer />
            {/* @ts-ignore */}
            <Flex>{DateTime.fromSQL(e.createdAt).toRelative()}</Flex>
            <Flex fontFamily="monospace" alignItems="center" bg="blue.600" color="white" px="2" rounded="full">{e.pending.toString().padStart(2, '0')}</Flex>
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}
