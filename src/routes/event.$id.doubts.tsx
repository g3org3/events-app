import { createFileRoute } from '@tanstack/react-router'
import Doubts from '../Doubts'

export const Route = createFileRoute('/event/$id/doubts')({
  component: Doubts,
})
