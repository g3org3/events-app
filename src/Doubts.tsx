import { Flex, Spacer, Checkbox, useColorModeValue } from '@chakra-ui/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import { useEffect } from 'react'

import Empty from './Empty'
import CreateDoubtModal from './CreateDoubtModal'
import { getNextSteps, pb, updateNextStep } from './pb'
import { queryClient } from './queryClient'

export default function Doubts() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/doubts' })
  const bg = useColorModeValue('white', 'black')
  const { data: doubts = [], isLoading } = useQuery({
    queryKey: ['get-doubts', `event-id-${selectedEventId}`],
    queryFn: () => getNextSteps(selectedEventId, 'doubt')
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (params: { nsId: string, checked: boolean }) => updateNextStep(params.nsId, params.checked),
  })

  useEffect(() => {
    pb.collection('nextsteps').subscribe('*', function(e) {
      console.log(e)
      if (e.record.eventId === selectedEventId && e.record.type === 'doubt') {
        queryClient.invalidateQueries({ queryKey: ['get-doubts', `event-id-${selectedEventId}`] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
      }
    })

    return () => {
      pb.collection('nextsteps').unsubscribe('*')
    }
  }, [])

  return <>
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
            bg={bg}
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
  </>
}
