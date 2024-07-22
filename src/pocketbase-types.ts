/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Comments = "comments",
	Events = "events",
	Leaderboard = "leaderboard",
	Links = "links",
	MatchBets = "match_bets",
	Matches = "matches",
	Nextsteps = "nextsteps",
	Predictions = "predictions",
	Results = "results",
	Snapshots = "snapshots",
	Sprints = "sprints",
	Tickets = "tickets",
	Tournaments = "tournaments",
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

export type CommentsRecord = {
	authorId?: RecordIdString
	eventId?: RecordIdString
	text: string
}

export type EventsRecord = {
	authorId?: RecordIdString
	notes?: string
	sharedWith?: RecordIdString
	title: string
}

export type LeaderboardRecord<Tpoints = unknown> = {
	points?: null | Tpoints
	tournament_id?: RecordIdString
	user?: RecordIdString
}

export type LinksRecord<Ttags = unknown> = {
	author?: RecordIdString
	desc?: string
	image?: string
	tags?: null | Ttags
	title?: string
	url?: string
}

export type MatchBetsRecord<Taway_per = unknown, Thome_per = unknown, Ttie_per = unknown> = {
	away_per?: null | Taway_per
	home_per?: null | Thome_per
	match_id?: RecordIdString
	tie_per?: null | Ttie_per
}

export type MatchesRecord = {
	away?: string
	awayScore?: number
	home?: string
	homeScore?: number
	location?: string
	matchNumber?: number
	roundNumber?: number
	startAtUtc?: IsoDateString
	tournament?: RecordIdString
}

export enum NextstepsTypeOptions {
	"doubt" = "doubt",
	"nextstep" = "nextstep",
}
export type NextstepsRecord = {
	authorId?: RecordIdString
	doneAt?: IsoDateString
	eventId?: RecordIdString
	remindAt?: IsoDateString
	title?: string
	type?: NextstepsTypeOptions
}

export type PredictionsRecord = {
	awayScore?: number
	homeScore?: number
	match?: RecordIdString
	user?: RecordIdString
}

export type ResultsRecord<Tpoints = unknown> = {
	away?: string
	awayScore?: number
	home?: string
	homeScore?: number
	match_id?: RecordIdString
	p_away?: number
	p_home?: number
	points?: null | Tpoints
	prediction_id?: RecordIdString
	startAtUtc?: IsoDateString
	tournament_id?: RecordIdString
	user?: RecordIdString
}

export type SnapshotsRecord = {
	fetchedat?: IsoDateString
	sprint?: RecordIdString
}

export type SprintsRecord = {
	name?: string
}

export type TicketsRecord<Tlabels = unknown, Tparents = unknown> = {
	description?: string
	epic?: string
	fetchedat?: IsoDateString
	key?: string
	labels?: null | Tlabels
	owner?: string
	parents?: null | Tparents
	points?: number
	summary?: string
}

export type TournamentsRecord = {
	logo?: string
	name?: string
}

export type UsersRecord = {
	avatar?: string
	img?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type EventsResponse<Texpand = unknown> = Required<EventsRecord> & BaseSystemFields<Texpand>
export type LeaderboardResponse<Tpoints = unknown, Texpand = unknown> = Required<LeaderboardRecord<Tpoints>> & BaseSystemFields<Texpand>
export type LinksResponse<Ttags = unknown, Texpand = unknown> = Required<LinksRecord<Ttags>> & BaseSystemFields<Texpand>
export type MatchBetsResponse<Taway_per = unknown, Thome_per = unknown, Ttie_per = unknown, Texpand = unknown> = Required<MatchBetsRecord<Taway_per, Thome_per, Ttie_per>> & BaseSystemFields<Texpand>
export type MatchesResponse<Texpand = unknown> = Required<MatchesRecord> & BaseSystemFields<Texpand>
export type NextstepsResponse<Texpand = unknown> = Required<NextstepsRecord> & BaseSystemFields<Texpand>
export type PredictionsResponse<Texpand = unknown> = Required<PredictionsRecord> & BaseSystemFields<Texpand>
export type ResultsResponse<Tpoints = unknown, Texpand = unknown> = Required<ResultsRecord<Tpoints>> & BaseSystemFields<Texpand>
export type SnapshotsResponse<Texpand = unknown> = Required<SnapshotsRecord> & BaseSystemFields<Texpand>
export type SprintsResponse<Texpand = unknown> = Required<SprintsRecord> & BaseSystemFields<Texpand>
export type TicketsResponse<Tlabels = unknown, Tparents = unknown, Texpand = unknown> = Required<TicketsRecord<Tlabels, Tparents>> & BaseSystemFields<Texpand>
export type TournamentsResponse<Texpand = unknown> = Required<TournamentsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	comments: CommentsRecord
	events: EventsRecord
	leaderboard: LeaderboardRecord
	links: LinksRecord
	match_bets: MatchBetsRecord
	matches: MatchesRecord
	nextsteps: NextstepsRecord
	predictions: PredictionsRecord
	results: ResultsRecord
	snapshots: SnapshotsRecord
	sprints: SprintsRecord
	tickets: TicketsRecord
	tournaments: TournamentsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	comments: CommentsResponse
	events: EventsResponse
	leaderboard: LeaderboardResponse
	links: LinksResponse
	match_bets: MatchBetsResponse
	matches: MatchesResponse
	nextsteps: NextstepsResponse
	predictions: PredictionsResponse
	results: ResultsResponse
	snapshots: SnapshotsResponse
	sprints: SprintsResponse
	tickets: TicketsResponse
	tournaments: TournamentsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'events'): RecordService<EventsResponse>
	collection(idOrName: 'leaderboard'): RecordService<LeaderboardResponse>
	collection(idOrName: 'links'): RecordService<LinksResponse>
	collection(idOrName: 'match_bets'): RecordService<MatchBetsResponse>
	collection(idOrName: 'matches'): RecordService<MatchesResponse>
	collection(idOrName: 'nextsteps'): RecordService<NextstepsResponse>
	collection(idOrName: 'predictions'): RecordService<PredictionsResponse>
	collection(idOrName: 'results'): RecordService<ResultsResponse>
	collection(idOrName: 'snapshots'): RecordService<SnapshotsResponse>
	collection(idOrName: 'sprints'): RecordService<SprintsResponse>
	collection(idOrName: 'tickets'): RecordService<TicketsResponse>
	collection(idOrName: 'tournaments'): RecordService<TournamentsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
