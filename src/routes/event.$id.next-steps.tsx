import { createFileRoute } from '@tanstack/react-router'
import NextSteps from '../NextSteps'

export const Route = createFileRoute('/event/$id/next-steps')({
  component: NextSteps
})
