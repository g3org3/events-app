import {
  Outlet,
  Router,
  Route,
  RootRoute,
} from '@tanstack/react-router'
import z from 'zod'
import Layout from './Layout'
import EventList from './EventList'
import SelectedEvent from './SelectedEvent'
import NextSteps from './NextSteps'
import Doubts from './Doubts'

const rootRoute = new RootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

const indexRouteSearchSchema = z.object({
  query: z.string().nullish(),
})

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: EventList,
  validateSearch: indexRouteSearchSchema,
})

export const eventRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/event/$id',
  component: SelectedEvent,
})

export const nextStepsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/event/$id/next-steps',
  component: NextSteps,
})

export const doubtsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/event/$id/doubts',
  component: Doubts,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventRoute,
  nextStepsRoute,
  doubtsRoute,
])
export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
