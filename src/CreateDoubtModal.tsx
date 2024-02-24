import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { useState } from "react"

import { createNextStep } from './pb'
import { queryClient } from './queryClient'

export default function CreateDoubtModal() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/doubts' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')

  const { isPending, mutate } = useMutation({
    mutationFn: () => createNextStep({ title, eventId: selectedEventId }, 'doubt'),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-doubts', `event-id-${selectedEventId}`] })
      setTitle('')
      onClose()
    }
  })

  return (
    <>
      <Button colorScheme="purple" size="md" variant="outline" onClick={onOpen}>
        Add a doubt
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a new doubt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              disabled={isPending}
              autoFocus
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="When, what, why, how..."
            />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={isPending} colorScheme="purple" mr={3} onClick={() => mutate()}>
              add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
