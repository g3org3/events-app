import { Flex, Button, Spacer, Checkbox } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import Empty from './Empty'
import CreateDoubtModal from './CreateDoubtModal'
import { getNextSteps } from './pb'
import { eventRoute } from './Router'

export default function Doubts() {
  const { id: selectedEventId } = eventRoute.useParams()
  const { data: doubts = [], isLoading } = useQuery({
    queryKey: ['get-doubts', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'doubt')
  })

  return <Flex flexDir="column" flex="1" gap="2" p="4">
    <Flex borderBottom="1px solid" borderColor="gray.400" fontSize="x-large">
      <Flex>Doubts</Flex>
      <Spacer />
    </Flex>
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {doubts.length > 0 && <CreateDoubtModal />}
      {doubts.map(e => (
        <Flex key={e.id} alignItems="center" gap="1">
          <Checkbox
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
      {doubts.length === 0 && <Empty isLoading={isLoading} message="You don't have any doubts." action={selectedEventId && <CreateDoubtModal />} />}
    </Flex>
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
