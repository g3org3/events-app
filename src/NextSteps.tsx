import { Flex, Checkbox, Spacer, Button } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { useStore } from './store'
import Empty from './Empty'
import CreateNextStepModal from './CreateNextStepModal'


export default function NextSteps() {
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
