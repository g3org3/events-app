import { Flex, Checkbox, Spacer, Button } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import Empty from './Empty'
import CreateNextStepModal from './CreateNextStepModal'
import { eventRoute } from './Router'
import { getNextSteps, pb, updateNextStep } from './pb'
import { queryClient } from './queryClient'
import { useEffect } from 'react'


export default function NextSteps() {
  const { id: selectedEventId } = eventRoute.useParams()
  const { data: nextSteps = [], isLoading } = useQuery({
    queryKey: ['get-next-steps', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'nextstep')
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (params: { nsId: string, checked: boolean }) => updateNextStep(params.nsId, params.checked),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-next-steps', `event-id-${selectedEventId}`] })
    }
  })

  useEffect(() => {
    pb.collection('nextsteps').subscribe('*', function(e) {
      console.log(e)
      if (e.record.eventId === selectedEventId && e.record.type === 'nextstep') {
        queryClient.invalidateQueries({ queryKey: ['get-next-steps', `event-id-${selectedEventId}`] })
      }
    })

    return () => {
      pb.collection('nextsteps').unsubscribe('*')
    }
  }, [])

  return <Flex flexDir="column" flex="1" gap="2" p="4">
    <Flex borderBottom="1px solid" borderColor="gray.400" py="2" fontSize="x-large">
      <Flex>Next Steps</Flex>
      <Spacer />
    </Flex>
    <Flex flex="1" gap="2" overflow="auto" flexDir="column">
      {nextSteps.length > 0 && <CreateNextStepModal />}
      {nextSteps.map(ns => (
        <Flex key={ns.id} alignItems="center" gap="1">
          <Checkbox
            disabled={isPending}
            onChange={(e) => mutate({ nsId: ns.id, checked: e.target.checked })}
            isChecked={!!ns.doneAt}
            width="100%"
            bg="white"
            boxShadow="sm"
            p="2"
            display="flex"
            flexDirection="row"
          >
            <Flex alignItems="center">
              <Flex fontSize="x-large">{ns.title}</Flex>
              <Spacer />
              {ns.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(ns.doneAt).toRelative()}</Flex>}
              {!ns.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(ns.created).toRelative()}</Flex>}
            </Flex>
          </Checkbox>
        </Flex>
      ))}
      {nextSteps.length === 0 && <Empty isLoading={isLoading} message="You don't have any next steps." action={selectedEventId && <CreateNextStepModal />} />}
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
