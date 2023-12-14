import {
  Button,
  Checkbox,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import type { ClientResponseError } from 'pocketbase'
import { DateTime } from 'luxon'
import { SmallAddIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { useStore } from './store'
import { pb } from './pb'

function Login() {
  const onLogin = async () => {
    let res = null
    try {
      res = await pb.collection('users').authWithOAuth2({ provider: 'google' })
    } catch (e) {
      const err = e as ClientResponseError
      alert(err.message)
    }
    if (res?.meta?.avatarUrl) {
      const { avatarUrl } = res.meta
      await pb.collection('users').update(res.record.id, { avatarUrl })
    }
    document.location = '/'
  }

  return (
    <Flex h="100dvh" alignItems="center" justifyContent="center" bg="gray.100">
      <Flex p="6" w="300px" bg="gray.50" boxShadow="md" border="1px solid" borderColor="gray.100" flexDir="column" gap="4">
        <Flex fontSize="xx-large">Login</Flex>
        <Flex>login to use events</Flex>
        <Button onClick={onLogin}>login with google</Button>
      </Flex>
    </Flex>
  )
}

function App() {

  const events = useStore(store => store.events)
  const filteredEventIds = useStore(store => store.filteredEventIds)
  const selectedEventId = useStore(store => store.selectedEventId)
  const setEventId = useStore(store => store.actions.setEventId)
  const init = useStore(store => store.actions.init)
  const event = events.find(e => e.id === selectedEventId)
  const [tab, setTab] = useState<'all' | 'doubts' | 'nextSteps'>('all')

  if (!pb.authStore.isValid) {
    return <Login />
  }

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
      return
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

function Doubts() {
  const [hideCompleted, setHideCompleted] = useState(false)
  const doubts = useStore(store => store.doubts)
  const selectedEventId = useStore(store => store.selectedEventId)
  const checkDoubt = useStore(store => store.actions.checkDoubt)
  let filteredDoubts = doubts
  if (selectedEventId) {
    filteredDoubts = filteredDoubts.filter(ns => ns.eventId === selectedEventId)
  }
  if (hideCompleted) {
    filteredDoubts = filteredDoubts.filter(ns => !ns.doneAt)
  }

  return <Flex flexDir="column" flex="1" gap="2">
    <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
      <Flex>Doubts</Flex>
      <Spacer />
      <Button size="sm" onClick={() => setHideCompleted(!hideCompleted)}>{hideCompleted ? 'show' : 'hide'}</Button>
    </Flex>
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {filteredDoubts.map(e => (
        <Flex key={e.id} alignItems="center" gap="1">
          <Checkbox
            onChange={(ev) => checkDoubt(e.id, ev.target.checked)}
            isChecked={!!e.doneAt}
            width="100%"
            bg="white"
            boxShadow="sm"
            p="2"
            display="flex"
            flexDirection="row"
          >
            <Flex alignItems="center">
              <Flex fontSize="x-large">{e.title}</Flex>
              <Spacer />
              {e.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(e.doneAt).toRelative()}</Flex>}
            </Flex>
          </Checkbox>
        </Flex>
      ))}
      {filteredDoubts.length === 0 && <Empty message="You don't have any doubts." action={selectedEventId && <CreateDoubtModal />} />}
    </Flex>
  </Flex>
}

function NextSteps() {
  const [hideCompleted, setHideCompleted] = useState(false)
  const nextSteps = useStore(store => store.nextSteps)
  const events = useStore(store => store.events)
  const selectedEventId = useStore(store => store.selectedEventId)
  const checkNextStep = useStore(store => store.actions.checkNextStep)
  let filteredNextSteps = nextSteps
  if (selectedEventId) {
    filteredNextSteps = filteredNextSteps.filter(ns => ns.eventId === selectedEventId)
  }
  if (hideCompleted) {
    filteredNextSteps = filteredNextSteps.filter(ns => !ns.doneAt)
  }

  const nsEvents = events.map(e => {
    const nextSteps = filteredNextSteps.filter(ns => ns.eventId === e.id)

    return {
      ...e,
      pending: nextSteps.filter(ns => !ns.doneAt).length,
      nextSteps,
    }
  })

  if (!selectedEventId) {
    return <Flex flexDir="column" flex="1" gap="2">
      <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
        <Flex>Next Steps</Flex>
      </Flex>
      <Flex flex="1" gap="2" overflow="auto" flexDir="column">
        {nsEvents.map(e => (
          <Flex key={e.id} alignItems="center" gap="1">
            <Checkbox
              isChecked={!e.pending}
              width="100%"
              bg="white"
              boxShadow="sm"
              p="2"
              display="flex"
              flexDirection="row"
            >
              <Flex alignItems="center">
                <Flex fontSize="x-large">{e.title}</Flex>
                <Spacer />
                <Flex fontFamily="monospace" alignItems="center" bg="blue.600" color="white" px="2" rounded="full">{e.pending.toString().padStart(2, '0')}</Flex>
              </Flex>
            </Checkbox>
          </Flex>
        ))}
        {filteredNextSteps.length === 0 && <Empty message="You don't have any next steps." action={selectedEventId && <CreateNextStepModal />} />}
      </Flex>
    </Flex>
  }

  return <Flex flexDir="column" flex="1" gap="2">
    <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
      <Flex>Next Steps</Flex>
      <Spacer />
      <Button size="sm" onClick={() => setHideCompleted(!hideCompleted)}>{hideCompleted ? 'show' : 'hide'}</Button>
    </Flex>
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {filteredNextSteps.map(e => (
        <Flex key={e.id} alignItems="center" gap="1">
          <Checkbox
            onChange={(ev) => checkNextStep(e.id, ev.target.checked)}
            isChecked={!!e.doneAt}
            width="100%"
            bg="white"
            boxShadow="sm"
            p="2"
            display="flex"
            flexDirection="row"
          >
            <Flex alignItems="center">
              <Flex fontSize="x-large">{e.title}</Flex>
              <Spacer />
              {e.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(e.doneAt).toRelative()}</Flex>}
            </Flex>
          </Checkbox>
        </Flex>
      ))}
      {filteredNextSteps.length === 0 && <Empty message="You don't have any next steps." action={selectedEventId && <CreateNextStepModal />} />}
    </Flex>
  </Flex>
}

function SelectedEvent() {
  const selectedEventId = useStore(store => store.selectedEventId)
  const events = useStore(store => store.events)
  const addNotes = useStore(store => store.actions.addNotes)
  const event = events.find(x => x.id === selectedEventId)
  const [state, setState] = useState(event?.notes || '')
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    if (!selectedEventId) return
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

function EventList() {
  const events = useStore(store => store.events)
  const nextSteps = useStore(store => store.nextSteps)
  const setEventId = useStore(store => store.actions.setEventId)
  const filteredEventIds = useStore(store => store.filteredEventIds)
  let filteredEvents = events
  if (filteredEventIds) {
    filteredEvents = filteredEvents.filter(e => filteredEventIds.includes(e.id))
  }
  if (filteredEvents.length === 0) return <Empty message="You don't have any events." action={filteredEventIds === null && <CreateEventModal />} />

  const nsEvents = filteredEvents.map(e => {
    const _next = nextSteps.filter(ns => ns.eventId === e.id)

    return {
      ...e,
      pending: _next.filter(ns => !ns.doneAt).length,
      nextSteps,
    }
  })

  return (
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {nsEvents.map(e => (
        <Flex key={e.id} alignItems="center" gap="1" p="1">
          <Flex position="relative">
            <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
            <Flex
              position="absolute"
              bottom="-25px"
              left="7px"
              height="23px"
              borderLeft="1px dashed"
              borderColor="gray.400"
              width="1px"
            />
          </Flex>
          <Button
            onClick={() => setEventId(e.id)}
            boxShadow="sm"
            flex="1"
            p="3"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
            rounded="sm"
            alignItems="center"
            display="flex"
            gap="3"
          >
            <Flex fontSize="x-large">{e.title}</Flex>
            <Spacer />
            {/* @ts-ignore */}
            <Flex>{DateTime.fromSQL(e.createdAt).toRelative()}</Flex>
            <Flex fontFamily="monospace" alignItems="center" bg="blue.600" color="white" px="2" rounded="full">{e.pending.toString().padStart(2, '0')}</Flex>
          </Button>
        </Flex>
      ))}
    </Flex>
  )
}

function CreateDoubtModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const selectedEventId = useStore(store => store.selectedEventId)
  const addDoubt = useStore(store => store.actions.addDoubt)

  const onCreate = () => {
    if (!selectedEventId) return
    addDoubt(selectedEventId, title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" variant="outline" size="md" onClick={onOpen}>add doubt</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a new doubt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='I am not sure...' />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function CreateNextStepModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const selectedEventId = useStore(store => store.selectedEventId)
  const addNextStep = useStore(store => store.actions.addNextStep)

  const onCreate = () => {
    if (!selectedEventId) return
    addNextStep(selectedEventId, title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" variant="outline" size="md" onClick={onOpen}>add next step</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a next step</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="next step" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function CreateEventModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const addEvent = useStore(store => store.actions.addEvent)

  const onCreate = () => {
    addEvent(title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" size="md" variant="outline" onClick={onOpen}>create event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Create new event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='event name' />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function SearchModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const query = useStore(store => store.search)
  const [searchText, setSearch] = useState(query || '')
  const search = useStore(store => store.actions.search)

  const onCreate = () => {
    search(searchText)
    setSearch('')
    onClose()
  }

  return (
    <>
      <Button isTruncated colorScheme="purple" variant={!query ? "outline" : "solid"} size="md" onClick={onOpen}>
        {query ? `search: "${query.substr(0, 3)}..."` : "search"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={searchText} onChange={(e) => setSearch(e.target.value)} placeholder="search..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}

function Empty({ message, action }: { message: string, action: React.ReactNode }) {
  return <Flex flexDir="column" gap="4" height="32%" alignItems="center" justifyContent="center">
    <Flex fontSize="lg">{message}</Flex>
    {action}
  </Flex>
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default App
