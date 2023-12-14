import {
  Button,
  Flex,
} from '@chakra-ui/react'
import { useEffect, useState } from "react"
import { useStore } from "./store"
import SearchModal from './SearchModal'
import CreateDoubtModal from './CreateDoubtModal'
import CreateEventModal from './CreateEventModal'
import CreateNextStepModal from './CreateNextStepModal'
import SelectedEvent from './SelectedEvent'
import EventList from './EventList'
import NextSteps from './NextSteps'
import Doubts from './Doubts'

export default function Router() {
  const events = useStore(store => store.events)
  const filteredEventIds = useStore(store => store.filteredEventIds)
  const selectedEventId = useStore(store => store.selectedEventId)
  const setEventId = useStore(store => store.actions.setEventId)
  const init = useStore(store => store.actions.init)
  const event = events.find(e => e.id === selectedEventId)
  const [tab, setTab] = useState<'all' | 'doubts' | 'nextSteps'>('all')

  const onGoHome = () => {
    setEventId(null)
    setTab('all')
  }
  let filteredEvents = events
  if (filteredEventIds && filteredEventIds?.length > 0) {
    filteredEvents = filteredEvents.filter(e => filteredEventIds.includes(e.id))
  }

  useEffect(() => {
    init()
  }, [])

  const onNextSteps = () => {
    if (selectedEventId) {
      setTab('nextSteps')
    }
  }

  return (
    <Flex background="gray.50" h="100dvh" flexDir="column">
      <Flex bg="white" py="2" px="4" boxShadow="md" alignItems="center" gap="4" justifyContent="space-around">
        {tab === 'all' && !selectedEventId && filteredEvents.length > 0 && <SearchModal />}
        {selectedEventId && <CreateDoubtModal />}
        <Flex fontWeight="bold">
          <Button onClick={onGoHome} size="md" variant="ghost">Events</Button>
        </Flex>
        {tab === 'all' && !selectedEventId && filteredEvents.length > 0 && <CreateEventModal />}
        {selectedEventId && <CreateNextStepModal />}
      </Flex>
      <Flex p="4" flex="1" flexDir="column">
        {tab === 'all' && !!selectedEventId && <SelectedEvent />}
        {tab === 'all' && !selectedEventId && <EventList />}
        {tab === 'nextSteps' && <NextSteps />}
        {tab === 'doubts' && <Doubts />}
      </Flex>
      <Flex bg="white" justifyContent="space-around" p="2" borderTop="1px solid" borderColor="gray.300">
        {event && <Button isActive={tab === 'doubts'} onClick={() => setTab('doubts')} variant="ghost">Doubts</Button>}
        {event && <Button isActive={tab === 'all'} onClick={() => setTab('all')} variant="ghost">Event</Button>}
        {event && <Button isActive={tab === 'nextSteps'} onClick={onNextSteps} variant="ghost">Next Steps</Button>}
      </Flex>
    </Flex>
  )
}
