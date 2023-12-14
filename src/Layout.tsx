import {
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import SearchModal from './SearchModal'
import { pb } from './pb'

export default function Layout(props: { children: React.ReactNode }) {
  const onLogout = () => {
    pb.authStore.clear()
    document.location.href = '/'
  }

  return (
    <Flex background="gray.50" h="100dvh" flexDir="column">
      <Flex bg="white" py="2" px="4" boxShadow="md" alignItems="center" gap="4">
        <Flex fontWeight="bold">
          <Link to="/">Events</Link>
        </Flex>
        <Spacer />
        <SearchModal />
        <Button onClick={onLogout}>Logout</Button>
      </Flex>
      <Flex flex="1" flexDir="column" overflow="auto">
        {props.children}
      </Flex>
    </Flex>
  )
}
