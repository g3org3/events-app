import { Flex, Button, Textarea } from '@chakra-ui/react'

import { useEffect, useState } from "react"
import { useStore } from "./store"
import { useDebounce } from './debounce.hook'

export default function SelectedEvent() {
  const selectedEventId = useStore(store => store.selectedEventId)
  const events = useStore(store => store.events)
  const addNotes = useStore(store => store.actions.addNotes)
  const event = events.find(x => x.id === selectedEventId)
  const [state, setState] = useState(event?.notes || '')
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    if (!selectedEventId) return
    console.log('debounced', debouncedState)
    addNotes(selectedEventId, debouncedState)
  }, [debouncedState])

  if (!event) {
    return <Flex>
      <Flex>sorry no event found</Flex>
      <Button>go back</Button>
    </Flex>
  }

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setState(e.target.value)
  }

  return <Flex flexDir="column" flex="1" gap="3">
    <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
      {event.title}
    </Flex>
    <Textarea onChange={onChange} value={state} placeholder="type here some notes..." bg="white" flex="1" />
  </Flex>
}
