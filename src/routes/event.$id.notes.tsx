import { createFileRoute } from '@tanstack/react-router'
import { Flex, Button, Textarea, Spacer, Skeleton, useColorModeValue } from '@chakra-ui/react'
import { useQuery, useMutation, queryOptions } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { getEvent, getNextSteps, pb, updateEvent } from '../pb'
import Comments from '../Comments'
import Empty from '../Empty'
import { queryClient } from '../queryClient'


export const Route = createFileRoute('/event/$id/notes')({
  staleTime: 10 * 60 * 1000, // 10 min
  loader: ({ params }) => queryClient.ensureQueryData(queryOptions({
    queryKey: ['get-event', params.id],
    queryFn: () => getEvent(params.id),
  })),
  component: SelectedEvent,
})

function SelectedEvent() {
  const { id: selectedEventId } = Route.useParams()
  // null means we are not in editing mode
  const [state, setState] = useState<string | null>(null)
  const bg = useColorModeValue('white', 'black')
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['get-event', selectedEventId],
    queryFn: () => getEvent(selectedEventId),
  })
  
  // for pre-fetching purposes
  // TODO: change this to 1 query because it makes no sense
  useQuery({
    queryKey: ['get-next-steps', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'nextstep')
  })
  useQuery({
    queryKey: ['get-doubts', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'doubt')
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (notes: string) => updateEvent(selectedEventId, notes),
    onSuccess() {
      setState(null)
      queryClient.invalidateQueries({ queryKey: ['get-event', selectedEventId] })
    }
  })

  useEffect(() => {
    pb.collection('events').subscribe(selectedEventId, function(e) {
      if (state == null) {
        console.log(e)
        queryClient.invalidateQueries({ queryKey: ['get-event', selectedEventId] })
      }
    })

    return () => {
      pb.collection('events').unsubscribe(selectedEventId)
    }
  }, [state])

  const onSave = () => {
    if (state != null)
      mutate(state)
  }

  return <>
    <Flex borderBottom="1px solid" borderColor="gray.400" py="2" fontSize="x-large">
      {event?.title}
      {isLoading && <Skeleton>Event is loading...</Skeleton>}
      <Spacer />
      {event && state == null && <Button size="sm" onClick={() => setState(event.notes)}>Edit</Button>}
      {event && state != null && <Button isLoading={isPending} colorScheme="green" onClick={onSave}>Save</Button>}
    </Flex>
    {!event && <Flex flex="1" />}
    {event && state == null && !event.notes && <Empty message="No notes yet." action={<Button onClick={() => setState(event.notes)}>Edit</Button>} />}
    {event && state == null && !!event.notes && (
      <>
        <pre
          style={{
            overflow: 'auto',
            flex: '1',
            padding: '8px',
            border: '1px solid #ccc',
            background: bg
          }}>
          {event.notes}
        </pre>
        <Comments />
      </>
    )}
    {event && state != null && (
      <>
        <Textarea
          minHeight="500px"
          disabled={isPending}
          onChange={(e) => setState(e.target.value)}
          value={state}
          placeholder="type here some notes..."
          bg={bg}
          flex="1"
        />
      </>
    )}
  </>
}
