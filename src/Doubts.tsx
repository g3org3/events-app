import { Flex, Button, Spacer, Checkbox } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import Empty from './Empty'
import CreateDoubtModal from './CreateDoubtModal'
import { getNextSteps, pb, updateNextStep } from './pb'
import { eventRoute } from './Router'
import { queryClient } from './queryClient'
import { useEffect } from 'react'

export default function Doubts() {
  const { id: selectedEventId } = eventRoute.useParams()
  const { data: doubts = [], isLoading } = useQuery({
    queryKey: ['get-doubts', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'doubt')
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (params: { nsId: string, checked: boolean }) => updateNextStep(params.nsId, params.checked),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-doubts', `event-id-${selectedEventId}`] })
    }
  })

  useEffect(() => {
    pb.collection('nextsteps').subscribe('*', function(e) {
      console.log(e)
      if (e.record.eventId === selectedEventId && e.record.type === 'doubt') {
        queryClient.invalidateQueries({ queryKey: ['get-doubts', `event-id-${selectedEventId}`] })
      }
    })

    return () => {
      pb.collection('nextsteps').unsubscribe('*')
    }
  }, [])

  return <Flex flexDir="column" flex="1" gap="2" p="4">
    <Flex borderBottom="1px solid" borderColor="gray.400" py="2" fontSize="x-large">
      <Flex>Doubts</Flex>
      <Spacer />
    </Flex>
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {doubts.length > 0 && <CreateDoubtModal />}
      {doubts.map(doubt => (
        <Flex key={doubt.id} alignItems="center" gap="1">
          <Checkbox
            disabled={isPending}
            onChange={(e) => mutate({ nsId: doubt.id, checked: e.target.checked })}
            isChecked={!!doubt.doneAt}
            width="100%"
            bg="white"
            boxShadow="sm"
            p="2"
            display="flex"
            flexDirection="row"
          >
            <Flex alignItems="center">
              <Flex fontSize="x-large">{doubt.title}</Flex>
              <Spacer />
              {doubt.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(doubt.doneAt).toRelative()}</Flex>}
              {!doubt.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(doubt.created).toRelative()}</Flex>}
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
