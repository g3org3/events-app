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
import { useState } from "react"
import { createEvent } from './pb'
import { queryClient } from './queryClient'


export default function CreateEventModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')

  const { isPending, mutate } = useMutation({
    mutationFn: () => createEvent({ title }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setTitle('')
      onClose()
    }
  })

  return (
    <>
      <Button colorScheme="purple" size="md" variant="outline" onClick={onOpen}>create event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Create new event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              disabled={isPending}
              autoFocus
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event name..."
            />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={isPending} colorScheme="purple" mr={3} onClick={() => mutate()}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
