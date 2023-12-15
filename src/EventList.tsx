import { Flex, Button, Skeleton } from '@chakra-ui/react'
import { SmallAddIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useState } from 'react'

import Empty from './Empty'
import CreateEventModal from './CreateEventModal'
import { EventsWithNextSteps, getEvents, pb } from './pb'
import { useEffect } from 'react'
import { queryClient } from './queryClient'

export default function EventList() {
  const [filter, setFilter] = useState<null | 'pending'>(null)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', filter],
    queryFn: () => getEvents({ filter })
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

  if (events.length === 0 && !isLoading) {
    return <Empty
      isLoading={isLoading}
      message="You don't have any events."
      action={<CreateEventModal />}
    />
  }

  return (
    <Flex flex="1" gap="2" p="4" overflow="auto" flexDir="column">
      <Flex gap="2" justifyContent="space-around">
        <Button variant="outline" onClick={() => setFilter(filter === 'pending' ? null : 'pending')}>
          {filter === 'pending' ? 'show all' : 'show pending'}
        </Button>
        <CreateEventModal />
      </Flex>
      {isLoading && (
        <>
          <LoadingEvent />
          <LoadingEvent />
          <LoadingEvent />
        </>
      )}
      {events.map(e => (
        <EventComponent key={e.id} event={e} />
      ))}
    </Flex>
  )
}

function EventComponent(props: { event: EventsWithNextSteps }) {
  return (
    <Flex key={props.event.id} alignItems="center" gap="1" p="1">
      <Flex position="relative" alignItems="center">
        <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
        <Flex
          borderColor="gray.400"
          borderLeft="1px dashed"
          bottom="-47px"
          height="40px"
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
          boxShadow="md"
          display="flex"
          flex="1"
          gap="3"
          p="3"
          rounded="md"
        >
          <Flex flex="1" fontSize="x-large">
            {props.event.title}
          </Flex>
          <Flex flexDir="column" alignItems="flex-end" gap="2">
            <Flex gap="2">
              <Flex opacity={props.event.pending.filter(x => x.type === 'doubt').length > 0 ? '1' : '0.2'} fontFamily="monospace" alignItems="center" bg="blue.500" color="white" px="2" rounded="full">
                {props.event.pending.filter(x => x.type === 'doubt').length.toString().padStart(2, '0')}
              </Flex>
              <Flex opacity={props.event.pending.filter(x => x.type === 'nextstep').length > 0 ? '1' : '0.2'} fontFamily="monospace" alignItems="center" bg="blue.500" color="white" px="2" rounded="full">
                {props.event.pending.filter(x => x.type === 'nextstep').length.toString().padStart(2, '0')}
              </Flex>
            </Flex>
            <Flex color="gray.400" fontSize="small">{DateTime.fromSQL(props.event.created).toRelative()}</Flex>
          </Flex>
        </Button>
      </Link>
    </Flex>
  )
}

function LoadingEvent() {
  return <Flex p="1" gap="1" alignItems="center">
    <Flex position="relative" alignItems="center">
      <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
      <Flex
        borderColor="gray.400"
        borderLeft="1px dashed"
        bottom="-47px"
        height="40px"
        left="7px"
        position="absolute"
        width="1px"
      />
    </Flex>
    <Skeleton flex="1" height="54px" rounded="md" />
  </Flex>
}
