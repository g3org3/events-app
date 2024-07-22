import { useEffect } from 'react'
import { Flex, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import GenericModal from './GenericModal'
import { createComment, getComments, pb } from './pb'
import { queryClient } from './queryClient'


export default function Comments() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/notes' })
  const { data } = useQuery({
    queryKey: ['comments', `event-id-${selectedEventId}`],
    queryFn: () => getComments(selectedEventId)
  })
  const bg = useColorModeValue('white', 'black')

  useEffect(() => {
    pb.collection('comments').subscribe('*', function (e) {
      console.log(e)
      if (e.record.eventId === selectedEventId)
        queryClient.invalidateQueries({ queryKey: [] })
    })

    return () => {
      pb.collection('comments').unsubscribe('*')
    }
  }, [])

  return <Flex flexDir="column" flexShrink="0" gap="3">
    <AddCommentModal />
    {data?.map(comment =>
      <Flex key={comment.id} bg={bg} flexShrink="0" p="2" border="1px solid">
        {comment.text}
        <Flex flex="1" />
        <Flex title={comment.created}>
          {DateTime.fromSQL(comment.created).toRelative()}
        </Flex>
      </Flex>)
    }
  </Flex>
}

function AddCommentModal() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/notes' })
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { mutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', `event-id-${selectedEventId}`] })
      onClose()
    }
  })

  const onAdd = (text: string) => {
    mutate({ text, eventId: selectedEventId })
  }

  return (
    <GenericModal
      title="Create Comment"
      onClick={onAdd}
      isPending={isPending}
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
    />
  )
}
