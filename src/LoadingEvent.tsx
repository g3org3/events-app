import { Flex, Skeleton } from '@chakra-ui/react'
import { SmallAddIcon } from '@chakra-ui/icons'

export default function LoadingEvent() {
  return <Flex p="1" gap="1" alignItems="center">
    <Flex position="relative" alignItems="center">
      <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
      <Flex
        borderColor="gray.400"
        borderLeft="1px dashed"
        bottom="-47px"
        height="40px"
        left="7px"
        position="absolute"
        width="1px"
      />
    </Flex>
    <Skeleton flex="1" height="54px" rounded="md" />
  </Flex>
}
