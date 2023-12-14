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


export default function SearchModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const query = useStore(store => store.search)
  const [searchText, setSearch] = useState(query || '')
  const search = useStore(store => store.actions.search)

  const onClear = () => {
    search('')
    setSearch('')
    onClose()

  }
  const onCreate = () => {
    search(searchText)
    setSearch('')
    onClose()
  }

  return (
    <>
      <Button isTruncated colorScheme="purple" variant={!query ? "outline" : "solid"} size="md" onClick={onOpen}>
        {query ? `search: "${query.substring(0, 3)}..."` : "search"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={3}>
          <ModalHeader>Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input autoFocus autoComplete="off" value={searchText} onChange={(e) => setSearch(e.target.value)} placeholder="search..." />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" variant="outline" mr={3} onClick={onClear}>
              clear
            </Button>
            <Button colorScheme="purple" mr={3} onClick={onCreate}>
              search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}
