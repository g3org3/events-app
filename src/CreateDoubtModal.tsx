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

export default function CreateDoubtModal() {
  const { isOpen, onOpen, onClose } = useDisclosure ()
  const [title, setTitle] = useState('')
  const selectedEventId = useStore(store => store.selectedEventId)
  const addDoubt = useStore(store => store.actions.addDoubt)

  const onCreate = () => {
    if (!selectedEventId) return
    addDoubt(selectedEventId, title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" variant="outline" size="md" onClick={onOpen}>add doubt</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a new doubt</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='I am not sure...' />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
