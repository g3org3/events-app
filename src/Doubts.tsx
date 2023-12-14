import { Flex, Button, Spacer, Checkbox } from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { useState } from "react"
import { useStore } from "./store"
import Empty from './Empty'
import CreateDoubtModal from './CreateDoubtModal'

export default function Doubts() {
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
