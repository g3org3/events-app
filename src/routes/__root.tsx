import { createRootRoute, Outlet, useChildMatches } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import {
  Button,
  Flex,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { Link } from '@tanstack/react-router'

import Login from '../Login'
import { pb } from '../pb'

const isDev = import.meta.env.DEV

export const Route = createRootRoute({
  component: () => {
    if (!pb.authStore.isValid) return <Login />

    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
        {isDev && <TanStackRouterDevtools />}
      </>
    )
  },
})

function Layout(props: { children: React.ReactNode }) {
  const matches = useChildMatches()
  const routeIds = matches.map(m => m.routeId)
  const isNotHome = !routeIds.includes("/_layout")

  const onLogout = () => {
    pb.authStore.clear()
    document.location.href = '/'
  }

  return (
    <Flex background="gray.50" h="100dvh" flexDir="column">
      <Flex zIndex="1" bg="white" py="2" px="4" boxShadow="md" alignItems="center" gap="4" justifyContent="space-between">
        {isNotHome && (
          <Flex fontWeight="bold">
            <Link to="/">
              <Button>
                <ArrowBackIcon />
              </Button>
            </Link>
          </Flex>
        )}
        <Flex fontSize="x-large">Events</Flex>
        {!isNotHome && <Link to="/tasks">tasks</Link>}
        <Button onClick={onLogout}>Logout</Button>
      </Flex>
      <Flex flex="1" flexDir="column" overflow="auto">
        {props.children}
      </Flex>
    </Flex>
  )
}
