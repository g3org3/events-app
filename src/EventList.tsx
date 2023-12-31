import { Flex, Button, Skeleton, Text, Spacer, Progress } from '@chakra-ui/react'
import { SmallAddIcon, ViewIcon, EmailIcon, BellIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useState } from 'react'

import Empty from './Empty'
import CreateEventModal from './CreateEventModal'
import { EventsWithNextSteps, getEvents, pb } from './pb'
import { useEffect } from 'react'
import { queryClient } from './queryClient'
import { EventsResponse } from './pocket-types'
import { isDateInTheFuture } from './utils/date'

export default function EventList() {
  const [filter, setFilter] = useState<null | 'pending' | 'reminders'>(null)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents()
  })
  let filteredEvents = events
  if (filter === 'pending') {
    filteredEvents = events.filter(e => e.pending.length > 0)
  }
  if (filter === 'reminders') {
    filteredEvents = events.filter(e => e.pending.filter(p => isDateInTheFuture(p.remindAt)).length > 0)
  }

  useEffect(() => {
    pb.collection('events').subscribe('*', function(e) {
      console.log(e)
      const event = e.record as EventsResponse
      if (event.authorId === pb.authStore.model?.id && event.sharedWith.includes(pb.authStore.model?.id)) {
        queryClient.invalidateQueries({ queryKey: ['events'] })
      }
    })

    pb.collection('nextsteps').subscribe('*', function(e) {
      console.log(e)
      // const nextstep = e.record as NextstepsResponse
      queryClient.invalidateQueries({ queryKey: ['events'] })
    })

    return () => {
      pb.collection('events').unsubscribe('*')
      pb.collection('nextsteps').unsubscribe('*')
    }
  }, [])

  if (filteredEvents.length === 0 && !isLoading) {
    return <Empty
      isLoading={isLoading}
      message="You don't have any events."
      action={<CreateEventModal />}
    />
  }

  return (
    <Flex flex="1" gap="2" p="4" overflow="auto" flexDir="column" position="relative">
      {isLoading && (
        <Flex flexDir="column" alignItems="center" justifyContent="center" zIndex="10" bg="white" position="fixed" top="0" left="0" width="100%" height="100%">
          <Flex fontSize="6xl">Events</Flex>
          <Flex display="block" bg="blue.400" w="200px">
            <Progress size="xs" colorScheme="purple" isIndeterminate />
          </Flex>
        </Flex>
      )}
      <Flex gap="2" justifyContent="space-around">
        <Button variant="outline" onClick={() => setFilter(filter === 'pending' ? null : 'pending')}>
          {filter === 'pending' ? 'show all' : 'show pndng'}
        </Button>
        <Button variant="outline" onClick={() => setFilter(filter === 'reminders' ? null : 'reminders')}>
          {filter === 'reminders' ? 'show all' : 'Show rmndrs'}
        </Button>
        <CreateEventModal />
      </Flex>
      {isLoading && (
        <>
          <LoadingEvent />
          <LoadingEvent />
        </>
      )}
      {filteredEvents.map(e => (
        <EventComponent key={e.id} event={e} />
      ))}
      <Flex p="4" color="gray.400" justifyContent="center">
        You reached the bottom
      </Flex>
    </Flex>
  )
}

function EventComponent(props: { event: EventsWithNextSteps }) {
  return (
    <Flex key={props.event.id} alignItems="center" gap="1" p="1">
      <Flex position="relative" alignItems="center">
        {props.event.authorId === pb.authStore.model?.id ? <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
          : <EmailIcon color="purple.700" />}
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
      <Link style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }} to="/event/$id" params={{ id: props.event.id }}>
        <Button
          alignItems="center"
          bg="white"
          border="1px solid"
          borderColor={props.event.authorId !== pb.authStore.model?.id ? 'purple.500' : 'gray.50'}
          display="flex"
          flex="1"
          gap="3"
          p="3"
          rounded="md"
        >
          <Text fontSize="l" isTruncated>
            {props.event.title}
          </Text>
          <Spacer />
          {props.event.authorId !== pb.authStore.model?.id && <Flex bg="purple.500" color="white" rounded="md" px="2" py="1">shared</Flex>}
          {props.event.sharedWith.length > 0 && props.event.authorId === pb.authStore.model?.id && <Flex bg="purple.500" color="white" rounded="md" px="2" py="1"><ViewIcon /></Flex>}
          <Flex flexDir="column" alignItems="flex-end" gap="2">
            <Flex gap="2">
              <Flex
                alignItems="center"
                bg="cyan.500"
                color="white"
                fontFamily="monospace"
                opacity={props.event.pending.filter(x => x.type === 'doubt').length > 0 ? '1' : '0.1'}
                px="2"
                rounded="full"
              >
                {props.event.pending.filter(x => x.type === 'doubt').length.toString().padStart(2, '0')}
              </Flex>
              <Flex
                alignItems="center"
                bg="blue.500"
                color="white"
                fontFamily="monospace"
                opacity={props.event.pending.filter(x => x.type === 'nextstep').length > 0 ? '1' : '0.1'}
                px="2"
                rounded="full"
              >
                {props.event.pending.filter(x => x.type === 'nextstep').length.toString().padStart(2, '0')}
              </Flex>
            </Flex>
            <Flex color="gray.400" fontSize="small">{DateTime.fromSQL(props.event.created).toRelative()}</Flex>
          </Flex>
        </Button>
        <Flex bg="white" flexDir="column">
          {props.event.pending.filter(p => isDateInTheFuture(p.remindAt)).map(p => (
            <Flex px="4" alignItems="center" gap="2">
              <Flex><BellIcon color="green.600" /></Flex>
              <Flex flex="1">{p.title}</Flex>
              <Flex>{DateTime.fromSQL(p.remindAt).toRelative()}</Flex>
            </Flex>
          ))}
        </Flex>
      </Link>
    </Flex >
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
