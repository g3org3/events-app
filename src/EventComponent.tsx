import { Flex, Button, Text, Spacer } from '@chakra-ui/react'
import { SmallAddIcon, ViewIcon, EmailIcon, BellIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import { EventsWithNextSteps, pb } from './pb'
import { isDateInTheFuture } from './utils/date'

interface Props {
  event: EventsWithNextSteps
  filter: 'pending' | 'reminders' | 'all' 
}

export default function EventComponent(props: Props) {
  return (
    <Flex alignItems="center" gap="1" p="1">
      <Flex position="relative" alignItems="center">
        {props.event.authorId === pb.authStore.model?.id ? <SmallAddIcon border="1px solid" borderColor="gray.600" color="gray.600" rounded="full" />
          : <EmailIcon color="purple.700" />}
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
      <Link style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }} to="/event/$id/notes" params={{ id: props.event.id }}>
        <Button
          alignItems="center"
          bg="white"
          boxShadow="md"
          border="1px solid"
          borderColor={props.event.authorId !== pb.authStore.model?.id ? 'purple.500' : 'gray.300'}
          display="flex"
          flex="1"
          gap="3"
          p="3"
          rounded="md"
        >
          <Text fontSize="l" isTruncated>
            {props.event.title}
          </Text>
          <Spacer />
          {props.event.authorId !== pb.authStore.model?.id && <Flex bg="purple.500" color="white" rounded="md" px="2" py="1">shared</Flex>}
          {props.event.sharedWith.length > 0 && props.event.authorId === pb.authStore.model?.id && <Flex bg="purple.500" color="white" rounded="md" px="2" py="1"><ViewIcon /></Flex>}
          <Flex flexDir="column" alignItems="flex-end" gap="2">
            <Flex gap="2">
              <Flex
                alignItems="center"
                bg="cyan.500"
                color="white"
                fontFamily="monospace"
                opacity={props.event.pending.filter(x => x.type === 'doubt').length > 0 ? '1' : '0.1'}
                px="2"
                rounded="full"
              >
                {props.event.pending.filter(x => x.type === 'doubt').length.toString().padStart(2, '0')}
              </Flex>
              <Flex
                alignItems="center"
                bg="blue.500"
                color="white"
                fontFamily="monospace"
                opacity={props.event.pending.filter(x => x.type === 'nextstep').length > 0 ? '1' : '0.1'}
                px="2"
                rounded="full"
              >
                {props.event.pending.filter(x => x.type === 'nextstep').length.toString().padStart(2, '0')}
              </Flex>
            </Flex>
            <Flex color="gray.400" fontSize="small">{DateTime.fromSQL(props.event.created).toRelative()}</Flex>
          </Flex>
        </Button>
        <Flex bg="white" flexDir="column">
          {props.event.pending.filter(p => isDateInTheFuture(p.remindAt) || props.filter === 'pending').map(p => (
            <Flex key={p.id} px="4" alignItems="center" gap="2">
              <Flex><BellIcon color={isDateInTheFuture(p.remindAt) ? "green.600" : "white"} /></Flex>
              <Flex flex="1">{p.title}</Flex>
              <Flex>{DateTime.fromSQL(p.remindAt).toRelative()}</Flex>
            </Flex>
          ))}
        </Flex>
      </Link>
    </Flex >
  )
}

