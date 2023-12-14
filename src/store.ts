import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

export interface EEvent {
  id: string
  title: string
  notes?: string | null
  createdAt: number
}

export interface NextStep {
  id: string
  eventId: string
  title: string
  createdAt: number
  doneAt?: number | null
}

export interface Doubt {
  id: string
  eventId: string
  title: string
  createdAt: number
  doneAt?: number | null
}

interface Store {
  events: EEvent[]
  nextSteps: NextStep[]
  doubts: Doubt[]
  filteredEventIds: string[] | null
  selectedEventId: string | null
  search: string | null
  actions: {
    addEvent: (title: string) => void
    setEventId: (id: string | null) => void
    addNextStep: (title: string) => void
    search: (search: string) => void
    addDoubt: (title: string) => void
    addNotes: (notes: string) => void
    checkNextStep: (id: string, checked?: boolean) => void
    checkDoubt: (id: string, checked?: boolean) => void
    init: () => void
    save: () => void
  }
}

export const useStore = create<Store>((set) => ({
  events: [],
  doubts: [],
  nextSteps: [],
  filteredEventIds: [],
  selectedEventId: null,
  search: null,
  actions: {
    save() {
      set(prev => {
        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify(rest))
        return prev
      })
    },
    init() {
      try {
        const state = JSON.parse(localStorage.getItem('store') || '')
        if (!state) return
        set({
          events: state.events,
          nextSteps: state.nextSteps,
          doubts: state.doubts,
        })
      } catch {
      }
    },
    setEventId(id) {
      set({ selectedEventId: id })
    },
    addDoubt(title) {
      set(prev => {
        const doubts = [{
          title,
          id: uuid(),
          createdAt: Date.now(),
          eventId: prev.selectedEventId!,
        }].concat(prev.doubts)

        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest, doubts }))

        return { doubts }
      })
    },
    checkDoubt(id, checked) {
      set(prev => {
        const doubt = prev.doubts.find(e => e.id === id && e.eventId === prev.selectedEventId)
        if (!doubt) return prev

        if (checked)
          doubt.doneAt = Date.now()
        else
          doubt.doneAt = null

        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest }))

        return { doubts: [...prev.doubts] }
      })
    },
    checkNextStep(id, checked) {
      set(prev => {
        const ns = prev.nextSteps.find(e => e.id === id && e.eventId === prev.selectedEventId)
        if (!ns) return prev

        if (checked)
          ns.doneAt = Date.now()
        else
          ns.doneAt = null

        let filteredEventIds = prev.filteredEventIds
        if (prev.search === '$ns') {
          filteredEventIds = [...(new Set(prev.nextSteps.filter(ns => !ns.doneAt).map(ns => ns.eventId)))]
        }
        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest }))

        return { nextSteps: [...prev.nextSteps], filteredEventIds }
      })
    },
    addNextStep(title) {
      set(prev => {
        const nextSteps = [{
          title,
          id: uuid(),
          createdAt: Date.now(),
          eventId: prev.selectedEventId!,
        }].concat(prev.nextSteps)

        let filteredEventIds = prev.filteredEventIds
        if (prev.search === '$ns') {
          filteredEventIds = [...(new Set(prev.nextSteps.filter(ns => !ns.doneAt).map(ns => ns.eventId)))]
        }

        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest, nextSteps }))

        return { nextSteps, filteredEventIds }
      })
    },
    addEvent(title) {
      set(prev => {
        const events = [{
          title,
          id: uuid(),
          createdAt: Date.now()
        }].concat(prev.events)

        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest, events }))

        return { events }
      })
    },
    addNotes(notes) {
      set(prev => {
        const event = prev.events.find(e => e.id === prev.selectedEventId)
        if (!event) return prev

        event.notes = notes

        const { actions, ...rest } = prev
        localStorage.setItem('store', JSON.stringify({ ...rest }))


        return { events: [...prev.events] }
      })
    },
    search(search) {
      if (!search) {
        set({ search: null, filteredEventIds: null })
        return
      }

      set(prev => {
        let filteredEventIds = prev.events.filter(ev => fts(search, ev.title)).map(ev => ev.id)
        if (search === '$ns') {
          filteredEventIds = [...(new Set(prev.nextSteps.filter(ns => !ns.doneAt).map(ns => ns.eventId)))]
        }

        return {
          search,
          filteredEventIds,
        }
      })
    }
  }
}))


function fts(query: string, target: string) {
  const nquery = query.toLowerCase()
  const ntarget = target.toLowerCase()

  return nquery.split(' ').filter(queryWord => {
    return ntarget.split(' ').filter(targetWord => {
      return targetWord.includes(queryWord)
    }).length > 0
  }).length > 0
}
