import { create } from 'zustand'
import { createEvent, createNextStep, getEvents, getNextSteps, updateEvent, updateNextStep } from './pb'
import { EventsResponse, NextstepsResponse, NextstepsTypeOptions } from './pocket-types'


interface Store {
  events: EventsResponse[]
  nextSteps: NextstepsResponse[]
  doubts: NextstepsResponse[]
  filteredEventIds: string[] | null
  selectedEventId: string | null
  search: string | null
  actions: {
    addEvent: (title: string) => void
    setEventId: (id: string | null) => void
    addNextStep: (eventId: string, title: string) => void
    search: (search: string) => void
    addDoubt: (eventId: string, title: string) => void
    addNotes: (id: string, notes: string) => void
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
  filteredEventIds: null,
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
        Promise.all([getEvents(), getNextSteps()]).then(([events, nextsteps]) => {
          set({
            events,
            nextSteps: nextsteps.filter(ns => ns.type === NextstepsTypeOptions.nextstep),
            doubts: nextsteps.filter(ns => ns.type === NextstepsTypeOptions.doubt),
          })
        })
      } catch (err) {
        alert(err)
      }
    },
    setEventId(id) {
      set({ selectedEventId: id })
    },
    addDoubt(eventId, title) {
      createNextStep({ title, eventId }, 'doubt').then(pbns => {
        if (!pbns) return
        set(prev => {
          const doubts = [pbns].concat(prev.doubts)

          return { doubts }
        })
      })
    },
    checkDoubt(id, checked) {
      updateNextStep(id, checked ? new Date() : null)
      set(prev => {
        const doubt = prev.doubts.find(e => e.id === id && e.eventId === prev.selectedEventId)
        if (!doubt) return prev

        if (checked)
          doubt.doneAt = new Date().toISOString().split('T').join(' ')
        else
          doubt.doneAt = ''

        return { doubts: [...prev.doubts] }
      })
    },
    checkNextStep(id, checked) {
      updateNextStep(id, checked ? new Date() : null)
      set(prev => {
        const ns = prev.nextSteps.find(e => e.id === id && e.eventId === prev.selectedEventId)
        if (!ns) return prev

        if (checked)
          ns.doneAt = new Date().toISOString().split('T').join(' ')
        else
          ns.doneAt = ''

        let filteredEventIds = prev.filteredEventIds
        if (prev.search === '$ns') {
          filteredEventIds = [...(new Set(prev.nextSteps.filter(ns => !ns.doneAt).map(ns => ns.eventId)))]
        }

        return { nextSteps: [...prev.nextSteps], filteredEventIds }
      })
    },
    addNextStep(eventId, title) {
      createNextStep({ title, eventId }, 'nextstep').then(nextstep => {
        if (!nextstep) return
        set(prev => {
          const nextSteps = [nextstep].concat(prev.nextSteps)

          let filteredEventIds = prev.filteredEventIds
          if (prev.search === '$ns') {
            filteredEventIds = [...(new Set(prev.nextSteps.filter(ns => !ns.doneAt).map(ns => ns.eventId)))]
          }

          return { nextSteps, filteredEventIds }
        })
      })
    },
    addEvent(title) {
      createEvent({ title }).then(event => {
        if (!event) return
        set(prev => {
          const events = [event].concat(prev.events)

          return { events }
        })
      })

    },
    addNotes(id, notes) {
      updateEvent(id, notes).then(() => {
        set(prev => {
          const event = prev.events.find(e => e.id === prev.selectedEventId)
          if (!event) return prev

          event.notes = event.notes


          return { events: [...prev.events] }
        })
      }).catch((err) => {
        alert(err)
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
