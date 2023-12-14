/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Events = "events",
	LatestSnapshotView = "latest_snapshot_view",
	Links = "links",
	Nextsteps = "nextsteps",
	Notes = "notes",
	Pubtokens = "pubtokens",
	SnapshotBatches = "snapshot_batches",
	SnapshotLatestBatches = "snapshot_latest_batches",
	Snapshots = "snapshots",
	SnapshotsDoneByDayView = "snapshots_done_by_day_view",
	SnapshotsDoneView = "snapshots_done_view",
	SnapshotsToValidateByDayView = "snapshots_to_validate_by_day_view",
	Sprints = "sprints",
	SprintsStatusView = "sprints_status_view",
	SprintsValidationReturns = "sprints_validation_returns",
	SprintsView = "sprints_view",
	Staffing = "staffing",
	Todos = "todos",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type EventsRecord = {
	authorId?: RecordIdString
	notes?: HTMLString
	title: string
}

export type LatestSnapshotViewRecord<Tsprint = unknown> = {
	batch?: RecordIdString
	sprint?: null | Tsprint
}

export type LinksRecord<Ttags = unknown> = {
	author?: RecordIdString
	desc?: string
	image?: string
	tags?: null | Ttags
	title?: string
	url?: string
}

export enum NextstepsTypeOptions {
	"doubt" = "doubt",
	"nextstep" = "nextstep",
}
export type NextstepsRecord = {
	authorId?: RecordIdString
	doneAt?: IsoDateString
	eventId?: RecordIdString
	title?: string
	type?: NextstepsTypeOptions
}

export type NotesRecord = {
	attendees?: string
	author?: RecordIdString
	tags?: string
}

export type PubtokensRecord = {
	active?: boolean
	authid?: string
	clientid?: string
	name?: string
	user?: RecordIdString
}

export type SnapshotBatchesRecord = {
	hide?: boolean
	project?: string
	sprint?: string
}

export type SnapshotLatestBatchesRecord<Tdate = unknown, Tlatest_at = unknown> = {
	date?: null | Tdate
	latest_at?: null | Tlatest_at
	project?: string
	sprint?: string
}

export type SnapshotsRecord<Tparents = unknown, Ttags = unknown> = {
	batch?: RecordIdString
	feature?: string
	key?: string
	owner?: string
	parents?: null | Tparents
	points?: number
	status?: string
	tags?: null | Ttags
	title?: string
}

export type SnapshotsDoneByDayViewRecord<Tdate = unknown, Tpoints_done = unknown> = {
	date?: null | Tdate
	owner?: string
	points_done?: null | Tpoints_done
	project?: string
	sprint?: string
}

export type SnapshotsDoneViewRecord<Tpoints = unknown> = {
	points?: null | Tpoints
	sprint?: string
}

export type SnapshotsToValidateByDayViewRecord<Tdate = unknown, Tpoints_done = unknown> = {
	date?: null | Tdate
	owner?: string
	points_done?: null | Tpoints_done
	project?: string
	sprint?: string
}

export type SprintsRecord = {
	fourth_track?: string
	is_code_freeze?: boolean
	name?: string
	secondary_track?: string
	sprint_goal?: string
	third_track?: string
}

export type SprintsStatusViewRecord<Tpoints_done = unknown, Ttickets = unknown> = {
	batch?: RecordIdString
	feature?: string
	points_done?: null | Tpoints_done
	sprint?: string
	tickets?: null | Ttickets
}

export type SprintsValidationReturnsRecord = {
	batch?: RecordIdString
	sprint?: string
	validation_returns?: number
}

export type SprintsViewRecord<Tend_at = unknown, Tpoints = unknown, Tstart_at = unknown> = {
	end_at?: null | Tend_at
	points?: null | Tpoints
	sprint?: string
	start_at?: null | Tstart_at
}

export type StaffingRecord<Ttags = unknown> = {
	dev?: string
	points?: number
	sprint?: string
	tags?: null | Ttags
	utc_date?: IsoDateString
}

export type TodosRecord<Ttags = unknown> = {
	author?: RecordIdString
	done?: IsoDateString
	due?: IsoDateString
	priority?: number
	tags?: null | Ttags
	text?: string
}

export type UsersRecord = {
	avatar?: string
	avatarUrl?: string
	isAdmin?: boolean
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type EventsResponse<Texpand = unknown> = Required<EventsRecord> & BaseSystemFields<Texpand>
export type LatestSnapshotViewResponse<Tsprint = unknown, Texpand = unknown> = Required<LatestSnapshotViewRecord<Tsprint>> & BaseSystemFields<Texpand>
export type LinksResponse<Ttags = unknown, Texpand = unknown> = Required<LinksRecord<Ttags>> & BaseSystemFields<Texpand>
export type NextstepsResponse<Texpand = unknown> = Required<NextstepsRecord> & BaseSystemFields<Texpand>
export type NotesResponse<Texpand = unknown> = Required<NotesRecord> & BaseSystemFields<Texpand>
export type PubtokensResponse<Texpand = unknown> = Required<PubtokensRecord> & BaseSystemFields<Texpand>
export type SnapshotBatchesResponse<Texpand = unknown> = Required<SnapshotBatchesRecord> & BaseSystemFields<Texpand>
export type SnapshotLatestBatchesResponse<Tdate = unknown, Tlatest_at = unknown, Texpand = unknown> = Required<SnapshotLatestBatchesRecord<Tdate, Tlatest_at>> & BaseSystemFields<Texpand>
export type SnapshotsResponse<Tparents = unknown, Ttags = unknown, Texpand = unknown> = Required<SnapshotsRecord<Tparents, Ttags>> & BaseSystemFields<Texpand>
export type SnapshotsDoneByDayViewResponse<Tdate = unknown, Tpoints_done = unknown, Texpand = unknown> = Required<SnapshotsDoneByDayViewRecord<Tdate, Tpoints_done>> & BaseSystemFields<Texpand>
export type SnapshotsDoneViewResponse<Tpoints = unknown, Texpand = unknown> = Required<SnapshotsDoneViewRecord<Tpoints>> & BaseSystemFields<Texpand>
export type SnapshotsToValidateByDayViewResponse<Tdate = unknown, Tpoints_done = unknown, Texpand = unknown> = Required<SnapshotsToValidateByDayViewRecord<Tdate, Tpoints_done>> & BaseSystemFields<Texpand>
export type SprintsResponse<Texpand = unknown> = Required<SprintsRecord> & BaseSystemFields<Texpand>
export type SprintsStatusViewResponse<Tpoints_done = unknown, Ttickets = unknown, Texpand = unknown> = Required<SprintsStatusViewRecord<Tpoints_done, Ttickets>> & BaseSystemFields<Texpand>
export type SprintsValidationReturnsResponse<Texpand = unknown> = Required<SprintsValidationReturnsRecord> & BaseSystemFields<Texpand>
export type SprintsViewResponse<Tend_at = unknown, Tpoints = unknown, Tstart_at = unknown, Texpand = unknown> = Required<SprintsViewRecord<Tend_at, Tpoints, Tstart_at>> & BaseSystemFields<Texpand>
export type StaffingResponse<Ttags = unknown, Texpand = unknown> = Required<StaffingRecord<Ttags>> & BaseSystemFields<Texpand>
export type TodosResponse<Ttags = unknown, Texpand = unknown> = Required<TodosRecord<Ttags>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	events: EventsRecord
	latest_snapshot_view: LatestSnapshotViewRecord
	links: LinksRecord
	nextsteps: NextstepsRecord
	notes: NotesRecord
	pubtokens: PubtokensRecord
	snapshot_batches: SnapshotBatchesRecord
	snapshot_latest_batches: SnapshotLatestBatchesRecord
	snapshots: SnapshotsRecord
	snapshots_done_by_day_view: SnapshotsDoneByDayViewRecord
	snapshots_done_view: SnapshotsDoneViewRecord
	snapshots_to_validate_by_day_view: SnapshotsToValidateByDayViewRecord
	sprints: SprintsRecord
	sprints_status_view: SprintsStatusViewRecord
	sprints_validation_returns: SprintsValidationReturnsRecord
	sprints_view: SprintsViewRecord
	staffing: StaffingRecord
	todos: TodosRecord
	users: UsersRecord
}

export type CollectionResponses = {
	events: EventsResponse
	latest_snapshot_view: LatestSnapshotViewResponse
	links: LinksResponse
	nextsteps: NextstepsResponse
	notes: NotesResponse
	pubtokens: PubtokensResponse
	snapshot_batches: SnapshotBatchesResponse
	snapshot_latest_batches: SnapshotLatestBatchesResponse
	snapshots: SnapshotsResponse
	snapshots_done_by_day_view: SnapshotsDoneByDayViewResponse
	snapshots_done_view: SnapshotsDoneViewResponse
	snapshots_to_validate_by_day_view: SnapshotsToValidateByDayViewResponse
	sprints: SprintsResponse
	sprints_status_view: SprintsStatusViewResponse
	sprints_validation_returns: SprintsValidationReturnsResponse
	sprints_view: SprintsViewResponse
	staffing: StaffingResponse
	todos: TodosResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'events'): RecordService<EventsResponse>
	collection(idOrName: 'latest_snapshot_view'): RecordService<LatestSnapshotViewResponse>
	collection(idOrName: 'links'): RecordService<LinksResponse>
	collection(idOrName: 'nextsteps'): RecordService<NextstepsResponse>
	collection(idOrName: 'notes'): RecordService<NotesResponse>
	collection(idOrName: 'pubtokens'): RecordService<PubtokensResponse>
	collection(idOrName: 'snapshot_batches'): RecordService<SnapshotBatchesResponse>
	collection(idOrName: 'snapshot_latest_batches'): RecordService<SnapshotLatestBatchesResponse>
	collection(idOrName: 'snapshots'): RecordService<SnapshotsResponse>
	collection(idOrName: 'snapshots_done_by_day_view'): RecordService<SnapshotsDoneByDayViewResponse>
	collection(idOrName: 'snapshots_done_view'): RecordService<SnapshotsDoneViewResponse>
	collection(idOrName: 'snapshots_to_validate_by_day_view'): RecordService<SnapshotsToValidateByDayViewResponse>
	collection(idOrName: 'sprints'): RecordService<SprintsResponse>
	collection(idOrName: 'sprints_status_view'): RecordService<SprintsStatusViewResponse>
	collection(idOrName: 'sprints_validation_returns'): RecordService<SprintsValidationReturnsResponse>
	collection(idOrName: 'sprints_view'): RecordService<SprintsViewResponse>
	collection(idOrName: 'staffing'): RecordService<StaffingResponse>
	collection(idOrName: 'todos'): RecordService<TodosResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
