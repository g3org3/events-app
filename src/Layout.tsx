import {
  Flex,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import SearchModal from './SearchModal'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <Flex background="gray.50" h="100dvh" flexDir="column">
      <Flex bg="white" py="2" px="4" boxShadow="md" alignItems="center" gap="4" justifyContent="space-between">
        <Flex fontWeight="bold">
          <Link to="/">Events</Link>
        </Flex>
        <SearchModal />
      </Flex>
      <Flex flex="1" flexDir="column">
        {props.children}
      </Flex>
    </Flex>
  )
}
