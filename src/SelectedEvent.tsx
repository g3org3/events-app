import { Flex, Button, Textarea, Spacer, Skeleton } from '@chakra-ui/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { eventRoute } from './Router'
import { getEvent, getNextSteps, pb, updateEvent } from './pb'
import Empty from './Empty'
import { queryClient } from './queryClient'

export default function SelectedEvent() {
  const { id: selectedEventId } = eventRoute.useParams()
  // null means we are not in editing mode
  const [state, setState] = useState<string | null>(null)
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

  return <Flex flexDir="column" flex="1" gap="3" p="4" overflow="auto">
    <Flex borderBottom="1px solid" borderColor="gray.400" py="2" fontSize="x-large">
      {event?.title}
      {isLoading && <Skeleton>Event is loading...</Skeleton>}
      <Spacer />
      {event && state == null && <Button size="sm" onClick={() => setState(event.notes)}>Edit</Button>}
      {event && state != null && <Button isLoading={isPending} colorScheme="green" onClick={onSave}>Save</Button>}
    </Flex>
    {!event && <Flex flex="1" />}
    {event && state == null && !event.notes && <Empty message="No notes yet." action={<Button onClick={() => setState(event.notes)}>Edit</Button>} />}
    {event && state == null && !!event.notes && <pre style={{ overflow: 'auto', flex: '1', padding: '8px', border: '1px solid #ccc', background: 'white' }}>{event.notes}</pre>}
    {event && state != null && <Textarea disabled={isPending} onChange={(e) => setState(e.target.value)} value={state} placeholder="type here some notes..." bg="white" flex="1" />}
    <Flex bg="white" justifyContent="space-around" p="2" border="1px solid" borderColor="gray.300">
      <Link to="/event/$id/doubts" params={{ id: selectedEventId }}>
        <Button variant="ghost">Doubts</Button>
      </Link>
      <Link to="/event/$id" params={{ id: selectedEventId }}>
        <Button variant="ghost">Notes</Button>
      </Link>
      <Link to="/event/$id/next-steps" params={{ id: selectedEventId }}>
        <Button variant="ghost">Next Steps</Button>
      </Link>
    </Flex>
  </Flex>
}
