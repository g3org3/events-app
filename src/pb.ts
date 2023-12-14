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

export const updateNextStep = async (id: string, doneAt: Date | null) => {
  if (!pb.authStore.model) return
  const res = await pb.collection(Collections.Nextsteps)
    .update<NextstepsResponse>(id, { doneAt })

  return res
}

export const updateEvent = async (id: string, notes: string) => {
  if (!pb.authStore.model) return

  console.log('->', notes)
  const res = await pb.collection(Collections.Events)
    .update<EventsResponse>(id, { notes })

  return res
}

export const getEvents = async () => {
  if (!pb.authStore.model) return []
  const events = await pb.collection(Collections.Events)
    .getFullList<EventsResponse>({ filter: `authorId = '${pb.authStore.model.id}'`, sort: '-created' })

  return events
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
    .getFullList<NextstepsResponse>({ filter })

  return events
}
