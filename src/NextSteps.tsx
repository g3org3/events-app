import { Flex, Checkbox, Spacer, Button, useDisclosure } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import Empty from './Empty'
import CreateNextStepModal from './CreateNextStepModal'
import { eventRoute } from './Router'
import { getNextSteps, pb, updateNextStep, updateReminder } from './pb'
import { queryClient } from './queryClient'
import { useEffect } from 'react'
import GenericModal from './GenericModal'


export default function NextSteps() {
  const { id: selectedEventId } = eventRoute.useParams()
  const { data: nextSteps = [], isLoading } = useQuery({
    queryKey: ['get-next-steps', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'nextstep')
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (params: { nsId: string, checked: boolean }) => updateNextStep(params.nsId, params.checked),
  })

  useEffect(() => {
    pb.collection('nextsteps').subscribe('*', function(e) {
      console.log(e)
      if (e.record.eventId === selectedEventId && e.record.type === 'nextstep') {
        queryClient.invalidateQueries({ queryKey: ['get-next-steps', `event-id-${selectedEventId}`] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
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
            <Flex alignItems="center" gap="2">
              <Flex fontSize="x-large" flex="1">{ns.title}</Flex>
              <Flex flexDir="column" alignItems="flex-end">
                {ns.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(ns.doneAt).toRelative()}</Flex>}
                {!ns.doneAt && <Flex fontSize="sm">{DateTime.fromSQL(ns.created).toRelative()}</Flex>}
                {DateTime.fromSQL(ns.remindAt).toRelative()?.includes('in ') && <Flex>Due: {DateTime.fromSQL(ns.remindAt).toRelative()}</Flex>}
              </Flex>
            </Flex>
          </Checkbox>
          <Flex justifyContent="center">
            <ReminderModal nsId={ns.id} remindAt={ns.remindAt} />
          </Flex>
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

function ReminderModal(props: { nsId: string, remindAt?: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate, isPending } = useMutation({
    mutationFn: (remindAt: string) => updateReminder(props.nsId, remindAt),
    onSuccess: () => onClose()
  })

  const onAdd = (data: string) => {
    const dateWithTZ = DateTime.fromSQL((data + ':00').replace('T', ' '))
    const dateUTC = dateWithTZ.toUTC().toSQL()?.replace('.000 Z', '')
    if (!dateUTC) return
    mutate(dateUTC)
  }

  return <GenericModal
    title="Create Reminder"
    type="datetime-local"
    onClick={onAdd}
    isPending={isPending}
    isOpen={isOpen}
    onOpen={onOpen}
    onClose={onClose}
  >
    <Button flexShrink="0" colorScheme={props.remindAt ? 'red' : 'gray'} size="md" variant="ghost" onClick={onOpen}>
      <BellIcon />
    </Button>
  </GenericModal>
}
