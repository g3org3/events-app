import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { routeTree } from './routeTree.gen' // Import the generated route tree
import { queryClient } from './queryClient'
import './index.css'

const isDev = import.meta.env.DEV
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const theme = extendTheme(config)

const router = createRouter({ routeTree })
const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <ChakraProvider theme={theme}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <RouterProvider router={router} />
          {isDev && <ReactQueryDevtools initialIsOpen={false} />}
        </PersistQueryClientProvider>
      </ChakraProvider>
    </StrictMode>,
  )
}
