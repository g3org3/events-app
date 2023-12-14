import { CircularProgress, Flex } from '@chakra-ui/react'

interface Props {
  message: string
  action?: React.ReactNode
  isLoading?: boolean
}

export default function Empty({ message, action, isLoading }: Props) {

  if (isLoading) {
    return <Flex alignItems="center" justifyContent="center" flex="1" flexDir="column">
      <CircularProgress isIndeterminate />
    </Flex>
  }

  return <Flex flexDir="column" gap="4" height="32%" alignItems="center" justifyContent="center">
    <Flex fontSize="lg">{message}</Flex>
    {action}
  </Flex>
}
