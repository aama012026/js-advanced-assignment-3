import type { ISO8601TimeString } from "../flow.js"
import type { HeroId } from "./DotaConstantsTypes.js"

// Type guards
export type MatchId = number
export type AccountId = number
export type SteamId = string | null


export interface Player {
	rank_tier: number | null,
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
	match_id: number,
	barracks_status_dire: number, // int bitmask
	barracks_status_radiant: number, //int bitmask
	chat: ChatMsg[],
	cluster: number, // seen in dota constants
	cosmetics: object,
	dire_score: number, // kills by dire at match end
	draft_timings: DraftAction[],
	duration: number, // seconds
	engine: number,
	first_blood_time: number,
	game_mode: number, // dota constants
	human_players: number, // human player count
	leagueid: number,
	lobby_type: number,
	match_seq_num: number,
	negative_votes: number,
	objectives: object[],
	pick_bans: PickBan[],
	positive_votes: number,
	radiant_gold_adv: number, // negative for disadvantage
	radiant_score: number, // kills by radiant at match end
	radiant_win: boolean | null,
	radiant_xp_adv: number, // negative for disadvantage
	start_time: UnixTimestamp,
	teamfights: object[] | null,
	tower_status_dire: number, // int bitmask
	tower_status_radiant: number, // int bitmask
	version: number, // parse version, used internally by OpenDota
	replay_salt: number,
	series_id: number,
	series_type: number,
	radiant_team: object,
	dire_team: object,
	league: object,
	skill: number | null, // bracket assigned by Valve (Normal, High, Very High)
	players: InGamePlayer[],
	patch: number, // patch ID from dotaconstants
	region: number, // region id from dotaconstants
	all_word_counts: object,
	my_word_counts: object,
	throw: number, // max gold adv. on losing team
	comeback: number, // max gold disadv. on winning team
	loss: number, // max gold disadvantage on losing team
	win: number, // max gold advantage on winning team
	replay_url: string,
	pauses: Pause[],
}

export interface ChatMsg {
	time: number,
	unit: string, // name of player
	key: string, // message
	slot: number,
	player_slot: number
}

export interface DraftAction {
	order: number,
	pick: boolean,
	active_team: number,
	hero_id: number,
	player_slot: number | null,
	extra_time: number,
	total_time_tiken: number
}

export interface PickBan {
	is_pick: boolean,
	hero_id: number,
	team: number,
	order: number
}

export interface InGamePlayer {
	match_id: MatchId,
	player_slot: number | null,
	ability_upgrades_arr: number[], // int[] - can prob. be deduced through dotaconstants
	ability_uses: object,
	ability_targets: object,
	damage_targets: object,
	account_id: number,
	actions: object,
	additional_units: object[] | null,
	assists: number,
	backpack_0: number, // prob. id for item
	backpack_1: number,
	backpack_2: number,
	buyback_log: Buyback[],
	camps_stacked: number,
	creeps_stacked: number,
	damage: object,
	damage_inflictor: object,
	damage_inflictor_received: object,
	damage_taken: object,
	deaths: number,
	denies: number,
	dn_t: number[], // denies @ different times of the match
	gold: number, // @ match conclusion
	gold_per_min: number,
	gold_reasons: object,
	gold_spent: number,
	gold_t: number[], // gold @ different timings
	hero_damage: number,
	hero_healing: number,
	hero_hits: object,
	hero_id: number, // dotaconstants
	item_0: number,
	item_1: number,
	item_2: number,
	item_3: number,
	item_4: number,
	item_5: number,
	item_uses: object,
	kill_streaks: object,
	killed: object,
	killed_by: object,
	kills: number,
	kills_log: Kill[],
	lane_pos: object,
	last_hits: number,
	leaver_status: number,
	level: number, // @ match conclusion
	lh_t: number[], // @ each min. of game
	life_state: object,
	max_hero_hit: object, // highest dmg. instance player inflicted
	multi_kills: object,
	obs: object,
	obs_left_log: object[],
	obs_log: object[],
	party_id: number,
	permanent_buffs: object[], // dotaconstants - type can be imported from there on binding as an enum prob.
	hero_variant: number, // 1-indexed facet - see dotaconstants
	pings: number,
	purchase: object,
	purchase_log: Purchase[],
	rune_pickups: number,
	runes: object,
	runes_log: RunePickup[],
	sen: object,
	sen_left_log: object[],
	sen_log: object[],
	sen_placed: number,
	stuns: number, // duration of all stuns by all players
	times: number[], // time in seconds corresponding to entries of other arrays...
	tower_damage: number,
	xp_per_min: number,
	xp_reasons: object,
	xp_t: number[], // xp @ min.i
	personaname: string | null,
	name: string | null,
	last_login: string | null, //<date-time>
	radiant_win: boolean | null,
	start_time: UnixTimestamp,
	duration: number,
	cluster: number,
	lobby_type: number,
	game_mode: number,
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
	rank_tier: number, // most significant digit -> medal, least significant digit -> stars
	cosmetics: Cosmetic[],
	benchmarks: object,
	neutral_tokens_log: NeutralTokenDrop[], //prob. deprecated since replaced by madstones
	neutral_item_history: NeutralItemCrafted[]
}

export interface Buyback {
	time: number,
	slot: number,
	player_slot: number
}

export interface Timing {
	time: number,
	key: string
}
export type Kill = Timing
export type RunePickup = Timing
export type NeutralTokenDrop = Timing

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

export interface Benchmark {
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
	bin: number,
	bin_name: number,
	count: number,
	cumulative_sum: number
}
