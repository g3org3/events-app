import { Flex, Checkbox, Spacer, Button, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { BellIcon } from '@chakra-ui/icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import { useEffect } from 'react'

import Empty from './Empty'
import CreateNextStepModal from './CreateNextStepModal'
import { getNextSteps, pb, updateNextStep, updateReminder } from './pb'
import { queryClient } from './queryClient'
import GenericModal from './GenericModal'
import { isDateInTheFuture } from './utils/date'
import { useParams } from '@tanstack/react-router'
import { enqueue } from './utils/queue'


export default function NextSteps() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/next-steps' })
  const bg = useColorModeValue('white', 'black')
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

  return <>
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
            bg={bg}
            boxShadow="sm"
            p="2"
            display="flex"
            flexDirection="row"
          >
            <Flex alignItems="center" gap="2">
              <Flex fontSize="x-large" flex="1">{ns.title}</Flex>
              <Flex flexDir="column" alignItems="flex-end">
                {!isDateInTheFuture(ns.remindAt) && ns.doneAt && <Flex fontSize="sm">Done {DateTime.fromSQL(ns.doneAt).toRelative()}</Flex>}
                {!isDateInTheFuture(ns.remindAt) && !ns.doneAt && <Flex fontSize="sm">Created {DateTime.fromSQL(ns.created).toRelative()}</Flex>}
                {isDateInTheFuture(ns.remindAt) && <Flex>Due {DateTime.fromSQL(ns.remindAt).toRelative()}</Flex>}
              </Flex>
            </Flex>
          </Checkbox>
          <Flex justifyContent="center">
            <ReminderModal nsId={ns.id} title={ns.title} author={ns.authorId} remindAt={ns.remindAt} />
          </Flex>
        </Flex>
      ))}
      {nextSteps.length === 0 && <Empty isLoading={isLoading} message="You don't have any next steps." action={selectedEventId && <CreateNextStepModal />} />}
    </Flex>
  </>
}

function ReminderModal(props: { nsId: string, remindAt?: string, title: string, author: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { mutate, isPending } = useMutation({
    mutationFn: (remindAt: string) => updateReminder(props.nsId, remindAt),
    onSuccess: () => onClose()
  })

  const onAdd = (data: string) => {
    const dateWithTZ = DateTime.fromSQL((data + ':00').replace('T', ' '))
    const dateUTC = dateWithTZ.toUTC().toSQL()?.replace('.000 Z', '')

    if (!dateUTC) return

    enqueue({
      nextId: props.nsId,
      userId: props.author,
      title: props.title,
      remindAt: dateUTC + '.000Z',
    })
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
    <Button flexShrink="0" colorScheme={isDateInTheFuture(props.remindAt) ? 'red' : 'gray'} size="md" variant="ghost" onClick={onOpen}>
      <BellIcon />
    </Button>
  </GenericModal>
}
