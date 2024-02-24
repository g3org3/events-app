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

export default function CreateNextStepModal() {
  const { id: selectedEventId } = useParams({ from: '/event/$id/next-steps' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')

  const { isPending, mutate } = useMutation({
    mutationFn: () => createNextStep({ title, eventId: selectedEventId }, 'nextstep'),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['get-next-steps', `event-id-${selectedEventId}`] })
      setTitle('')
      onClose()
    }
  })

  return (
    <>
      <Button flexShrink="0" colorScheme="purple" size="md" variant="outline" onClick={onOpen}>
        Add a next step
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a next step</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              disabled={isPending}
              autoFocus
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add next step"
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
