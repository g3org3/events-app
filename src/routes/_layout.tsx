import { Flex, Select } from '@chakra-ui/react'
import { Outlet, createFileRoute, useMatch, useNavigate } from '@tanstack/react-router'
import z from 'zod'

import CreateEventModal from '../CreateEventModal'
import SearchEventInput from '../SearchInput'

export const Route = createFileRoute('/_layout')({
  component: LayoutComponent,
})

const schema = z.enum(['all', 'pending', 'reminders'])

function LayoutComponent() {
  const navigate = useNavigate({ from: '/' })
  const { search } = useMatch({ strict: false })
  const filter = ('filter' in search) ? search.filter || 'all' : 'all'

  const onChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = schema.parse(e.target.value)
    navigate({
      search: {
        ...search,
        filter: value,
      }
    })
  }

  return (
    <Flex flex="1" gap="2" p="4" overflow="auto" flexDir="column" position="relative">
      <Flex gap="2" justifyContent="space-around">
        <Select value={filter} onChange={onChange}>
          <option>pending</option>
          <option>reminders</option>
          <option>all</option>
        </Select>
        <SearchEventInput />
        <CreateEventModal />
      </Flex>
      <Outlet />
    </Flex>
  )
}
