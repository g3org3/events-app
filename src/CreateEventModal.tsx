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
import { useState } from "react"
import { useStore } from "./store"


export default function CreateEventModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const addEvent = useStore(store => store.actions.addEvent)

  const onCreate = () => {
    addEvent(title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" size="md" variant="outline" onClick={onOpen}>create event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Create new event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='event name' />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
