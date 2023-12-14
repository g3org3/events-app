import { Flex, Button } from '@chakra-ui/react'
import type { ClientResponseError } from 'pocketbase'
import { pb } from './pb'

export default function Login() {
  const onLogin = async () => {
    let res = null
    try {
      res = await pb.collection('users').authWithOAuth2({ provider: 'google' })
    } catch (e) {
      const err = e as ClientResponseError
      alert(err.message)
    }
    if (res?.meta?.avatarUrl) {
      const { avatarUrl } = res.meta
      await pb.collection('users').update(res.record.id, { avatarUrl })
    }
    document.location = '/'
  }

  return (
    <Flex h="100dvh" alignItems="center" justifyContent="center" bg="gray.100">
      <Flex p="6" w="300px" bg="gray.50" boxShadow="md" border="1px solid" borderColor="gray.100" flexDir="column" gap="4">
        <Flex fontSize="xx-large">Login</Flex>
        <Flex>login to use events</Flex>
        <Button onClick={onLogin}>login with google</Button>
      </Flex>
    </Flex>
  )
}
