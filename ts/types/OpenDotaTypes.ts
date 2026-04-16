import type { ISO8601TimeString, UnixTimestamp } from "../flow.js"
import type { AbilityId, GameModeId, HeroId, ItemId, LobbyTypeId, PatchId, RegionId, UnitOrderId } from "./DotaConstantsTypes.js"

// Type guards
export type MatchId = number
export type SeriesId = number
export type LeagueId = number
export type AccountId = number
export type SteamId = string | null
export type PlayerSlot = number
export type BarracksBitmask = number
export type TowersBitmask = number
export type RankBitmask = number
export type GoldReasonId = number
export type XpReasonId = number

// Self documentation
export type xPos = number
export type yPos = number

export interface Player {
	rank_tier: RankBitmask | null,
	leaderboard_rank: number | null,
	computed_mmr: number | null,
	computed_mmr_turbo: number | null, // Number is int
	aliases: SteamAlias[],
}

export interface SteamAlias {
	personaname: string,
	name_since: ISO8601TimeString
}

export interface SearchResult {
	account_id: AccountId,
	avatarfull: string,
	personaname: string,
	last_match_time: string,
	similarity: number
}

export interface SteamProfile {
	account_id: AccountId, // 8-digit int
	personaname: string | null,
	name: string | null,
	plus: boolean, //current Dota Plus status
	cheese: number | null, // number is int
	steamId: SteamId, //16-digit string or null
	avatar: string | null,
	avatarmedium: string | null,
	avatarfull: string | null,
	profileurl: string | null,
	last_login: string | null,
	loccountrycode: string | null,
	is_contributor: boolean, // to Open Dota
	is_subscriber: boolean // to Open Dota
}

export interface PlayerMatchCount {
	win: number,
	lose: number
}

export interface MatchForPlayer {
	match_id: MatchId,
	player_slot: number | null, //0-127 are Radiant, 128-255 are Dire.
	radiant_win: boolean,
	duration: number, // in seconds
	game_mode: number, //corresponds to key in game_mode.json in Dota Constants
	lobby_type: number, //corresponds to key in lobby_type.json in Constants.
	hero_id: number,
	start_time: UnixTimestamp,
	version: number | null,
	kills: number,
	deaths: number,
	assists: number,
	skill: number | null, // bracket assigned by Valve (Normal, High, Very High)
	average_rank: number | null, // avg of players with public match data
	leaver_status: number, // 0: didn't leave, 1: left safely, 2+: Abandoned.
	party_size: number | null,
	hero_variant: number // monitor this! Facets are not in current patch...
}

export interface FullMatch {
	// Unparsed match
	match_id: MatchId,
	players: InGamePlayer[],
	series_id: SeriesId,
	series_type: number,
	cluster: number, // seen in dota constants
	replay_salt: number,
	radiant_win: boolean | null,
	duration: number, // seconds
	pre_game_duration: number, // Not present in documentation.
	start_time: UnixTimestamp,
	match_seq_num: number,
	tower_status_radiant: TowersBitmask, // int bitmask
	tower_status_dire: TowersBitmask, // int bitmask
	barracks_status_radiant: BarracksBitmask
	barracks_status_dire: BarracksBitmask
	first_blood_time: number,
	lobby_type: LobbyTypeId,
	human_players: number, // human player count
	leagueid: LeagueId,
	game_mode: GameModeId, // dota constants
	flags: number, // not present in documentation
	engine: number,
	radiant_score: number, // kills by radiant at match end
	dire_score: number, // kills by dire at match end
	pick_bans: PickBan[], // duplicate info from draft_timings?
	od_data: OdData, // not present in documentation
	metadata: any, // not present in documentation
	replay_url: string,
	patch: PatchId, // patch ID from dotaconstants
	region: RegionId, // region id from dotaconstants
	// Parsed match
	version?: number, // parse version, used internally by OpenDota
	teamfights?: Teamfight[] | null,
	pauses?: Pause[], // unverified - empty in seen parsed matches
	objectives?: Objective[],
	chat?: ChatMsg[],
	radiant_gold_adv?: number[], // i=minute. Negative for disadvantage
	radiant_xp_adv?: number[], // i=minute. Negative for disadvantage
	cosmetics?: object,
	draft_timings?: DraftTiming[], // present but empty in parsed match. Maybe only for captains mode.
	all_word_counts?: object, // seen, but only empty
	my_word_counts?: object, // seen, but only empty
	comeback?: number, // max gold disadv. on winning team
	stomp?: number,  // undocumented, prob max gold adv. on winning team (see win).
	// Unseen in responses but present in documentation
	// negative_votes: number,
	// positive_votes: number[],
	// radiant_team: object,
	// dire_team: object,
	// league: object,
	// skill: number | null, // bracket assigned by Valve (Normal, High, Very High)
	// throw: number, // max gold adv. on losing team
	// loss: number, // max gold disadvantage on losing team
	// win: number, // max gold advantage on winning team
}

// only present on parsed matches ----------------------------------------------
export interface Teamfight {
	start: number,
	end: number,
	last_death: number,
	deaths: number,
	players: TeamfightPlayer[],
}

export interface TeamfightPlayer {
	deaths_pos: Record<number, Record<number, number>>, // ???
	ability_uses: Record<string, number>, // convert to AbilityId, number on bind
	ability_targets: object | null // seems unused in responses although present as empty object
	item_uses: Record<string, number>, // convert to ItemId, number on bind
	killed: Record<string, number>, // convert to HeroId, number on bind
	deaths: number,
	buybacks: number,
	damage: number,
	healing: number,
	gold_delta: number,
	xp_delta: number,
	xp_start: number,
	xp_end: number
}

// Probably take the approach of only parsing type if composition is well known.
export interface Objective {
	time: number,
	type: string, // ex. "CHAT_MESSAGE_COURIER_LOST" | "building_kill"
	key?: string, // maybe target of type (ex. "npc_dota_badguys_tower1_top")
	slot?: number,
	player_slot?: PlayerSlot,
	unit?: string, // maybe subject (ex. "npc_dota_hero_viper")
	team?: number,
	value?: number, // probably present on courier kills
	killer?: number, // probably present on courier kills and looks like PlayerSlot, but couriers can die to more than heroes...
}
// -----------------------------------------------------------------------------

export interface OdData {
	has_api: boolean,
	has_gcdata: boolean,
	has_parsed: boolean,
	has_archived: boolean
}

export interface ChatMsg {
	time: number,
	type: string,
	key: string,
	slot: number,
	player_slot: number
}

export interface DraftTiming {
	order: number,
	pick: boolean,
	active_team: number,
	hero_id: HeroId,
	player_slot: PlayerSlot | null,
	extra_time: number,
	total_time_taken: number
}

export interface PickBan {
	is_pick: boolean,
	hero_id: number,
	team: number,
	order: number
}

export interface InGamePlayer {
	// Unparsed match
	account_id: AccountId,
	player_slot: PlayerSlot | null,
	party_id: number,
	party_size: number, // undocumented
	team_number: number, // undocumented
	team_slot: number, // undocumented
	permanent_buffs: object[], // dotaconstants - type can be imported from there on binding as an enum prob.
	hero_id: number, // dotaconstants
	hero_variant: number // facets - deprecated for the time being.
	item_0: number,
	item_1: number,
	item_2: number,
	item_3: number,
	item_4: number,
	item_5: number,
	backpack_0: number, // prob. id for item
	backpack_1: number,
	backpack_2: number,
	item_neutral: ItemId, // artifact
	item_neutral2: ItemId, // enchantment
	kills: number,
	deaths: number,
	assists: number,
	leaver_status: number,
	last_hits: number,
	denies: number,
	gold_per_min: number,
	xp_per_min: number,
	level: number, // @ match conclusion
	net_worth: number, // undocumented
	aghanims_scepter: number, // undocumented
	aghanims_shard: number, // undocumented
	moonshard: number, // undocumented
	hero_damage: number,
	tower_damage: number,
	hero_healing: number,
	gold: number, // @ match conclusion
	gold_spent: number,
	ability_upgrades_arr: AbilityId[],
	personaname: string | null,
	name: string | null,
	last_login: string | null, //<date-time>
	rank_tier: RankBitmask | null, // most significant digit -> medal, least significant digit -> stars
	computed_mmr: number | null, // undocumented -> possibly null only assumed because of unranked players
	is_subscriber: boolean,
	radiant_win: boolean | null,
	start_time: UnixTimestamp,
	duration: number,
	cluster: number,
	lobby_type: number,
	game_mode: number,
	is_contributor: boolean,
	patch: number,
	region: number,
	isRadiant: boolean,
	win: number,
	lose: number,
	total_gold: number,
	total_xp: number,
	kills_per_min: number,
	kda: number,
	abandons: number,
	benchmarks: PlayerBenchmarks,
	// Parsed match
	obs_placed: number,
	sen_placed: number,
	creeps_stacked: number,
	camps_stacked: number,
	rune_pickups: number,
	firstblood_claimed: number,
	teamfight_participation: number, // rate? (0-1)
	towers_killed: number,
	roshans_killed: number,
	observers_placed: number, // duplicate of obs_placed?
	stuns: number, // seconds of all stuns for all players? (according to doc)
	max_hero_hit: HardestHitDealt, // highest dmg. instance player inflicted
	times: number[], // moment in seconds other arrays' entries represent
	gold_t: number[], // gold @ different timings
	lh_t: number[], // @ each min. of game
	dn_t: number[], // denies @ different times of the match
	xp_t: number[], // xp @ min.i
	obs_log: WardLogEntry[],
	obs_left_log: WardLogEntry[], // When observer left - either killed or timed out
	sen_log: WardLogEntry[],
	sen_left_log: WardLogEntry[],
	purchase_log: Purchase[],
	kills_log: Timing[],
	buyback_log: Buyback[],
	runes_log: Timing[],
	connection_log: ConnectionEvent[],
	lane_pos: Record<xPos, Record<yPos, number>>, //outer record key is x, inner y (or other way around), and value of inner is presumably weight.
	obs: Record<xPos, Record<yPos, number>>,
	sen: Record<xPos, Record<yPos, number>>,
	actions: Record<UnitOrderId, number>,
	pings: number,
	purchase: Record<string, number>,
	gold_reasons: Record<GoldReasonId, number>,
	xp_reasons: Record<XpReasonId, number>,
	killed: Record<string, number>,
	item_uses: Record<string, number>,
	ability_uses: Record<string, number>,
	ability_targets: Record<string, Record<string, number>>, // Record<abilityName, Record<targetName, count>>
	damage_targets: Record<string, Record<string, number>>, // Record<damageSource, Record<targetName, amount>>
	hero_hits: Record<string, number>, // Record<source, count>
	damage: Record<string, number>, //Record<target, amount>
	damage_taken: Record<string, number>, //Record<source, amount>
	damage_inflictor: Record<string, number>, // Record<source, amount>
	damage_inflictor_received: Record<string, number>, //Record<source, amount>
	runes: Record<number, number>, // Record<Rune id, count>
	// we stopped here ---------------------------------------------------------
	match_id: MatchId,
	additional_units: object[] | null,
	kill_streaks: object,
	killed_by: object,
	life_state: object,
	multi_kills: object,
	neutral_kills: number,
	tower_kills: number,
	courier_kills: number,
	lane_kills: number,
	hero_kills: number,
	observer_kills: number,
	sentry_kills: number,
	roshan_kills: number,
	necronomicon_kills: number,
	ancient_kills: number,
	buyback_count: number,
	observer_uses: number,
	sentry_uses: number,
	lane_efficiency: number,
	lane_efficiency_pct: number,
	lane: number | null, // which lane the hero laned in (presumably 0-2 or 1-3)
	lane_role: number | null,
	is_roaming: boolean | null,
	purchase_time: object,
	first_purchase_time: object,
	item_win: object,
	item_usage: object,
	actions_per_min: number,
	life_state_dead: number,
	cosmetics: Cosmetic[],
	neutral_tokens_log: Timing[], //prob. deprecated since replaced by madstones
	neutral_item_history: NeutralItemCrafted[]
}



export interface PlayerBenchmark {
	raw: number,
	pct: number
}

export interface PlayerBenchmarks {
	gold_per_min: PlayerBenchmark,
	xp_per_min: PlayerBenchmark,
	kills_per_min: PlayerBenchmark,
	last_hits_per_min: PlayerBenchmark,
	hero_damage_per_min: PlayerBenchmark,
	hero_healing_per_min: PlayerBenchmark,
	tower_damage: PlayerBenchmark
}

export interface HardestHitDealt {
	time: number,
	type: string,
	unit: string,
	key: string,
	value: number,
	slot: number,
	player_slot: PlayerSlot,
	inflictor: AbilityId,
	max: boolean
}

export interface WardLogEntry {
	time: number,
	type: string,
	key: string, // "[124,157]" - representing x,y coordinate where ward was placed.
	slot: number,
	player_slot: PlayerSlot,
	attackername?: string,
	x: number,
	y: number,
	z: number,
	entityleft: boolean,
	ehandle: number // same for corresponding wards in log and left_log arrays, might be useful if order of wards placed and wards left is different.
}

export interface Buyback {
	time: number,
	slot: number,
	player_slot: PlayerSlot
}

export interface ConnectionEvent {
	time: number,
	event: string,
	player_slot: PlayerSlot | null
}

export interface Timing {
	time: number,
	key: string
}

export interface Purchase {
	time: number,
	key: string, // item id (prob. dotaconstants)
	charges: number
}

export interface Cosmetic {
	item_id: number,
	name: string | null,
	prefab: string,
	creation_date: string | null, // <date-time>
	image_inventory: string | null,
	image_path: string | null,
	item_description: string | null,
	item_name: string,
	item_rarity: string | null,
	item_type_name: string | null,
	used_by_heroes: string | null
}

export interface NeutralItemCrafted {
	time: number,
	item_neutral: string, // check dotaconstants
	item_neutral_enhancement: string
}

export interface Pause {
	time: number, // paused @ second
	duration: number // in seconds
}

export interface HeroPlayerStats {
	hero_id: HeroId,
	last_played: number, // maybe a match id?
	games: number,
	win: number,
	with_games: number,
	with_wins: number,
	against_games: number,
	against_win: number
}

export interface Peer {
	account_id: AccountId,
	last_played: number,
	win: number,
	games: number,
	with_win: number,
	with_games: number,
	against_win: number,
	against_games: number,
	with_gpm_sum: number,
	with_xpm_sum: number,
	personaname: string | null,
	name: string | null,
	is_contributor: boolean,
	is_subscriber: boolean,
	last_login: string | null,
	avatar: string | null,
	avatarfull: string | null
}

export interface RelationalProPlayer {
	account_id: AccountId,
	name: string | null,
	country_code: string,
	fantasy_role: number, // prob. 1-5 for carry-hard support.
	team_id: number,
	team_name: string | null,
	team_tag: string | null,
	is_locked: boolean,
	is_pro: boolean,
	locked_until: number | null,
	steamid: SteamId,
	avatar: string | null,
	avatarmedium: string | null,
	avatarfull: string | null,
	last_login: string | null, //<date-time>
	full_history_time: string | null //<date-time>
	cheese: number | null,
	fh_unavailable: boolean | null,
	loccountrycode: string | null,
	last_played: number | null,
	win: number,
	games: number,
	with_win: number,
	with_games: number,
	against_win: number,
	against_games: number,
	with_gpm_sum: number | null,
	with_xpm_sum: number | null
}

export interface Stat {
	field: string,
	n: number,
	sum: number,
}

export enum HistogramCols {
  Kills = "kills",
  Deaths = "deaths",
  Assists = "assists",
  Kda = "kda",
  GPM = "gold_per_min",
  XPM = "xp_per_min",
  LastHits = "last_hits",
  Denies = "denies",
  LaneEfficiencyPct = "lane_efficiency_pct",
  Duration = "duration",
  Level = "level",
  HeroDmg = "hero_damage",
  TowerDmg = "tower_damage",
  HeroHealing = "hero_healing",
  Stuns = "stuns",
  TowerKills = "tower_kills",
  NeutralKills = "neutral_kills",
  CourierKills = "courier_kills",
  TpScrollPurchase = "purchase_tpscroll",
  ObserverPurchase = "purchase_ward_observer",
  SentryPurchase = "purchase_ward_sentry",
  GemPurchase = "purchase_gem",
  RapierPurchase = "purchase_rapier",
  Pings = "pings",
  Throw = "throw",
  Comeback = "comeback",
  Stomp = "stomp",
  Loss = "loss",
  APM = "actions_per_min",
}

export interface OpenDotaBenchmark {
	hero_id: HeroId,
	result: {
		gold_per_min: Percentile[],
		xp_per_min: Percentile[],
		kills_per_min: Percentile[],
		last_hits_per_min: Percentile[],
		hero_damage_per_min: Percentile[],
		hero_healing_per_min: Percentile[],
		tower_damage: Percentile[],
	}
}

export interface Percentile {
	percentile: number,
	value: number
}

export interface Distributions {
	ranks: {
		rows: RankRow[],
		sum: {count: number}
	}
}

export interface RankRow {
	bin: RankBitmask,
	bin_name: RankBitmask, // duplicate info? (16.4.26)
	count: number,
	cumulative_sum: number
}
