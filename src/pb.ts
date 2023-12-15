import PocketBase from 'pocketbase'
import { Collections, EventsRecord, EventsResponse, NextstepsRecord, NextstepsResponse } from './pocket-types';

export const pb = new PocketBase('https://pb.jorgeadolfo.com')
pb.autoCancellation(false);

export const createEvent = async (ev: EventsRecord) => {
  if (!pb.authStore.model) return
  const res = await pb.collection(Collections.Events)
    .create<EventsResponse>({ ...ev, authorId: pb.authStore.model.id })

  return res
}

export const createNextStep = async (ns: NextstepsRecord, type: 'nextstep' | 'doubt') => {
  if (!pb.authStore.model) return
  const res = await pb.collection(Collections.Nextsteps)
    .create<NextstepsResponse>({ ...ns, authorId: pb.authStore.model.id, type })

  return res
}

export const updateNextStep = async (id: string, checked: boolean) => {
  let doneAt = checked ? new Date() : ''
  if (!pb.authStore.model) return
  const res = await pb.collection(Collections.Nextsteps)
    .update<NextstepsResponse>(id, { doneAt })

  return res
}

export const updateEvent = async (id: string, notes: string) => {
  if (!pb.authStore.model) return

  const res = await pb.collection(Collections.Events)
    .update<EventsResponse>(id, { notes })

  return res
}

export interface EventsWithNextSteps extends EventsResponse {
  pending: NextstepsResponse[]
}
export const getEvents = async (params: { filter: null | 'pending' }) => {
  if (!pb.authStore.model) return []

  const events = await pb.collection(Collections.Events)
    .getFullList<EventsResponse>({
      filter: `authorId='${pb.authStore.model.id}' || sharedWith ~ '${pb.authStore.model.id}'`,
      sort: '-created',
      expand: 'authorId',
    })

  const ns = await pb.collection(Collections.Nextsteps)
    .getFullList<NextstepsResponse<{ eventId: EventsResponse }>>({
      filter: `(authorId='${pb.authStore.model.id}' || eventId.sharedWith~'${pb.authStore.model.id}') && doneAt=''`,
      sort: '-created', expand: 'eventId',
    })

  const byId: Record<string, EventsWithNextSteps> = {}
  for (let n of ns) {
    const event = n.expand?.eventId
    if (event && !byId[event.id] && !n.doneAt) {
      byId[event.id] = {
        ...event,
        pending: []
      }
    }
    if (event && byId[event.id] && !n.doneAt) {
      byId[event.id].pending.push(n)
    }
  }

  if (params.filter === 'pending') {
    return Object.values(byId)
  }

  const newEvents = events.map((event) => {
    const pending = ns.filter(n => n.eventId === event.id)
    const newevent: EventsWithNextSteps = {
      ...event,
      pending,
    }
    return newevent
  })

  return newEvents
}

export const getEvent = async (id: string) => {
  if (!pb.authStore.model) return undefined
  const event = await pb.collection(Collections.Events)
    .getOne<EventsResponse>(id)

  return event
}

export const getNextSteps = async (eventId: string, type: 'doubt' | 'nextstep') => {
  if (!pb.authStore.model) return []
  let filter = `authorId='${pb.authStore.model.id}' && type='${type}'`
  if (eventId) {
    filter += ` && eventId='${eventId}'`
  }

  const events = await pb.collection(Collections.Nextsteps)
    .getFullList<NextstepsResponse>({ filter, sort: '-created' })

  return events
}
