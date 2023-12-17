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
} from '@chakra-ui/react'
import { useState } from "react"

interface Props {
  title: string
  onClick?: (value: string) => void
  isPending?: boolean
  type?: React.HTMLInputTypeAttribute
  children: React.ReactNode
  isOpen?: boolean
  onClose: () => void
  onOpen: () => void
}

export default function CreateEventModal(props: Props) {
  const [value, setValue] = useState('')
  const onAdd = () => {
    if (props.onClick)
      props.onClick(value)
  }

  return (
    <>
      {props.children
        ? props.children
        : (
          <Button flexShrink="0" colorScheme="purple" size="md" variant="outline" onClick={props.onOpen}>
            {props.title}
          </Button>
        )}
      <Modal isOpen={!!props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              disabled={props.isPending}
              autoFocus
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter..."
              type={props.type || "text"}
            />
          </ModalBody>
          <ModalFooter>
            <Button isLoading={props.isPending} colorScheme="purple" mr={3} onClick={onAdd}>
              add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
