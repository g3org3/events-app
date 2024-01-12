import PocketBase from 'pocketbase'
import { Collections, CommentsRecord, CommentsResponse, EventsRecord, EventsResponse, NextstepsRecord, NextstepsResponse } from './pocket-types';

export const pb = new PocketBase('https://pb.jorgeadolfo.com')
pb.autoCancellation(false);

export const createEvent = async (ev: EventsRecord) => {
  if (!pb.authStore.model) return
  const res = await pb.collection(Collections.Events)
    .create<EventsResponse>({ ...ev, authorId: pb.authStore.model.id })

  return res
}

export const createComment = async (comment: CommentsRecord) => {
  if (!pb.authStore.model) return
  
  const res = await pb.collection(Collections.Comments)
    .create<CommentsRecord>({ ...comment, authorId: pb.authStore.model.id })

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
export const getEvents = async (search?: string | null) => {
  if (!pb.authStore.model) return []

  const filter = `authorId='${pb.authStore.model.id}' || sharedWith ~ '${pb.authStore.model.id}'`
  const filterWithSearch = `(title~'${search}' || notes~'${search}') && (${filter})`

  const events = await pb.collection(Collections.Events)
    .getFullList<EventsResponse>({
      filter: search ? filterWithSearch : filter,
      sort: '-created',
      expand: 'authorId',
    })

  const ns = await pb.collection(Collections.Nextsteps)
    .getFullList<NextstepsResponse<{ eventId: EventsResponse }>>({
      filter: `(authorId='${pb.authStore.model.id}' || eventId.sharedWith~'${pb.authStore.model.id}') && doneAt=''`,
      sort: '-created', expand: 'eventId',
    })

  // const byId: Record<string, EventsWithNextSteps> = {}
  // for (let n of ns) {
  //   const event = n.expand?.eventId
  //   if (event && !byId[event.id] && !n.doneAt) {
  //     byId[event.id] = {
  //       ...event,
  //       pending: []
  //     }
  //   }
  //   if (event && byId[event.id] && !n.doneAt) {
  //     byId[event.id].pending.push(n)
  //   }
  // }

  // if (params.filter === 'pending') {
  //   return Object.values(byId)
  // }

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

export const updateReminder = async (id: string, remindAt: string) => {
  if (!pb.authStore.model) return

  await pb.collection(Collections.Nextsteps)
    .update<NextstepsRecord>(id, { remindAt })
}

export const getEvent = async (id: string) => {
  if (!pb.authStore.model) return
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

export const getComments = async (eventId: string) => {
  if (!pb.authStore.model) return []
  
  const filter = `authorId='${pb.authStore.model.id}' && eventId='${eventId}'`

  const comments = await pb.collection(Collections.Comments)
    .getFullList<CommentsResponse>({ filter, sort: '-created' })

  return comments
}
