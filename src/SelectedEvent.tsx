import { Flex, Button, Textarea } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useDebounce } from './debounce.hook'
import { eventRoute } from './Router'
import { getEvent } from './pb'
import Empty from './Empty'

export default function SelectedEvent() {
  const { id: selectedEventId } = eventRoute.useParams()
  const { data: event, isLoading } = useQuery({
    queryKey: ['get-event', selectedEventId],
    queryFn: () => getEvent(selectedEventId)
  })

  const [state, setState] = useState(event?.notes || '')
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    if (!selectedEventId) return
    console.log('debounced', debouncedState)
  }, [debouncedState])

  if (!event) {
    return <Empty message="No event found." isLoading={isLoading} />
  }

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setState(e.target.value)
  }

  return <Flex flexDir="column" flex="1" gap="3" p="4">
    <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
      {event.title}
    </Flex>
    <Textarea onChange={onChange} value={state} placeholder="type here some notes..." bg="white" flex="1" />
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
