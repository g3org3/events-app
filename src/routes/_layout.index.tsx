import { Flex } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import z from 'zod'

import CreateEventModal from '../CreateEventModal'
import Empty from '../Empty'
import EventComponent from '../EventComponent'
import LoadingEvent from '../LoadingEvent';
import { EventsResponse } from '../pocket-types'
import { getEvents, pb } from '../pb'
import { isDateInTheFuture } from '../utils/date'
import { queryClient } from '../queryClient'


const indexRouteSearchSchema = z.object({
  query: z.string().nullish(),
  filter: z.enum(['all', 'pending', 'reminders']).nullish(),
})

export const Route = createFileRoute('/_layout/')({
  validateSearch: indexRouteSearchSchema,
  loaderDeps: ({ search: { query } }) => ({ query }),
  loader: ({ deps: { query } }) => queryClient.ensureQueryData(queryOptions({
    queryKey: ['events', query],
    queryFn: () => getEvents(query),
  })),
  pendingComponent: () => (
    <>
      <LoadingEvent />
      <LoadingEvent />
    </>
  ),
  component: EventList,
})


export default function EventList() {
  const search = Route.useSearch()
  const filter = search.filter || 'all'
  const { data: events = [] } = useQuery({
    queryKey: ['events', search.query],
    queryFn: () => getEvents(search.query),
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

  if (!search.query && filteredEvents.length === 0) {
    return <Empty
      message="You don't have any events."
      action={<CreateEventModal />}
    />
  }

  return (
    <>
      {filteredEvents.map(e => (
        <EventComponent filter={filter} key={e.id} event={e} />
      ))}
      <Flex p="4" color="gray.400" justifyContent="center">
        You reached the bottom
      </Flex>
    </>
  )
}

