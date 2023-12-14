import {
  QueryClientProvider,
} from '@tanstack/react-query'
import { pb } from './pb'
import { router } from './Router'
import Login from './Login'
import {
  RouterProvider,
} from '@tanstack/react-router'
import { queryClient } from './queryClient'


export default function App() {
  if (!pb.authStore.isValid) {
    return <Login />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
