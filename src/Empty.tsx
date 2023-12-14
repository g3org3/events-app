import { Flex } from '@chakra-ui/react'

export default function Empty({ message, action }: { message: string, action: React.ReactNode }) {
  return <Flex flexDir="column" gap="4" height="32%" alignItems="center" justifyContent="center">
    <Flex fontSize="lg">{message}</Flex>
    {action}
  </Flex>
}
