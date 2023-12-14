import { Flex, Button, Textarea, Spacer } from '@chakra-ui/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { eventRoute } from './Router'
import { getEvent, updateEvent } from './pb'
import Empty from './Empty'
import { queryClient } from './queryClient'

export default function SelectedEvent() {
  const { id: selectedEventId } = eventRoute.useParams()
  const [state, setState] = useState<string | null>(null)
  const { data: event, isLoading } = useQuery({
    queryKey: ['get-event', selectedEventId],
    queryFn: () => getEvent(selectedEventId),
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (notes: string) => updateEvent(selectedEventId, notes),
    onSuccess() {
      setState(null)
      queryClient.invalidateQueries({ queryKey: ['get-event', selectedEventId] })
    }
  })

  if (!event) {
    return <Empty message="No event found." isLoading={isLoading} />
  }

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setState(e.target.value)
  }
  const onSave = () => {
    if (state != null)
      mutate(state)
  }

  return <Flex flexDir="column" flex="1" gap="3" p="4">
    <Flex borderBottom="1px solid" borderColor="gray.400" py="2" fontSize="x-large">
      {event.title}
      <Spacer />
      {state == null && <Button onClick={() => setState(event.notes)}>Edit</Button>}
      {state != null && <Button isLoading={isPending} colorScheme="green" onClick={onSave}>Save</Button>}
    </Flex>
    {state == null && !event.notes && <Empty message="No notes yet." action={<Button onClick={() => setState(event.notes)}>Edit</Button>} />}
    {state == null && !!event.notes && <pre style={{ flex: '1', padding: '8px', border: '1px solid #ccc', background: 'white' }}>{event.notes}</pre>}
    {state != null && <Textarea disabled={isPending} onChange={onChange} value={state} placeholder="type here some notes..." bg="white" flex="1" />}
    <Flex bg="white" justifyContent="space-around" p="2" border="1px solid" borderColor="gray.300">
      <Link to="/event/$id/doubts" params={{ id: selectedEventId }}>
        <Button variant="ghost">Doubts</Button>
      </Link>
      <Link to="/event/$id" params={{ id: selectedEventId }}>
        <Button variant="ghost">Events</Button>
      </Link>
      <Link to="/event/$id/next-steps" params={{ id: selectedEventId }}>
        <Button variant="ghost">Next Steps</Button>
      </Link>
    </Flex>
  </Flex>
}
