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

export default function CreateNextStepModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const selectedEventId = useStore(store => store.selectedEventId)
  const addNextStep = useStore(store => store.actions.addNextStep)

  const onCreate = () => {
    if (!selectedEventId) return
    addNextStep(selectedEventId, title)
    setTitle('')
    onClose()
  }

  return (
    <>
      <Button colorScheme="purple" variant="outline" size="md" onClick={onOpen}>add next step</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Add a next step</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="next step" />
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
