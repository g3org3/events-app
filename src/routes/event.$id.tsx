import { Flex, Button, useColorModeValue } from '@chakra-ui/react'
import { Outlet, createFileRoute, Link, useChildMatches } from '@tanstack/react-router'

export const Route = createFileRoute('/event/$id')({
  component: SelectedEventLayout,
})


function SelectedEventLayout() {
  const { id: selectedEventId } = Route.useParams()
  const [child] = useChildMatches()
  const { routeId } = child

  return (
    <>
      <Flex flexDir="column" flex="1" gap="3" p="4" overflow="auto">
        <Outlet />
        <Flex rounded="lg" bg={useColorModeValue('white', 'black')} justifyContent="space-around" p="2" border="1px solid" borderColor="gray.300">
          <Link to="/event/$id/doubts" params={{ id: selectedEventId }}>
            <Button isActive={routeId === '/event/$id/doubts'} variant="ghost">Doubts</Button>
          </Link>
          <Link to="/event/$id/notes" params={{ id: selectedEventId }}>
            <Button isActive={routeId === '/event/$id/notes'} variant="ghost">Notes</Button>
          </Link>
          <Link to="/event/$id/next-steps" params={{ id: selectedEventId }}>
            <Button isActive={routeId === '/event/$id/next-steps'} variant="ghost">Next Steps</Button>
          </Link>
        </Flex>
      </Flex>
    </>
  )
}
