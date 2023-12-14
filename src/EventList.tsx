import { Flex, Button, Spacer } from '@chakra-ui/react'
import { SmallAddIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'

import Empty from './Empty'
import CreateEventModal from './CreateEventModal'
import { EventsResponse, NextstepsResponse } from './pocket-types'
import { getEvents, pb } from './pb'
import { useEffect } from 'react'
import { queryClient } from './queryClient'



export default function EventList() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents()
  })
  const nextSteps: NextstepsResponse[] = []
  const nsEvents = events.map(e => {
    const _next = nextSteps.filter(ns => ns.eventId === e.id)

    return {
      ...e,
      pending: _next.filter(ns => !ns.doneAt).length,
    }
  })

  useEffect(() => {
    pb.collection('events').subscribe('*', function(e) {
      console.log(e)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    })

    return () => {
      pb.collection('events').unsubscribe('*')
    }
  }, [])

  if (events.length === 0) {
    return <Empty
      isLoading={isLoading}
      message="You don't have any events."
      action={<CreateEventModal />}
    />
  }

  return (
    <Flex flex="1" gap="2" p="4" overflow="auto" flexDir="column">
      <CreateEventModal />
      {nsEvents.map(e => (
        <EventComponent key={e.id} event={e} />
      ))}
    </Flex>
  )
}

interface EventWithPending extends EventsResponse {
  pending: number
}

function EventComponent(props: { event: EventWithPending }) {
  return (
    <Flex key={props.event.id} alignItems="center" gap="1" p="1">
      <Flex position="relative">
        <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
        <Flex
          borderColor="gray.400"
          borderLeft="1px dashed"
          bottom="-25px"
          height="23px"
          left="7px"
          position="absolute"
          width="1px"
        />
      </Flex>
      <Link style={{ display: 'flex', flexDirection: 'column', flex: 1 }} to="/event/$id" params={{ id: props.event.id }}>
        <Button
          alignItems="center"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          boxShadow="sm"
          display="flex"
          flex="1"
          gap="3"
          p="3"
          rounded="sm"
        >
          <Flex fontSize="x-large">{props.event.title}</Flex>
          <Spacer />
          <Flex>{DateTime.fromSQL(props.event.created).toRelative()}</Flex>
          {/* <Flex fontFamily="monospace" alignItems="center" bg="blue.600" color="white" px="2" rounded="full"> */}
          {/*   {props.event.pending.toString().padStart(2, '0')} */}
          {/* </Flex> */}
        </Button>
      </Link>
    </Flex>
  )
}
