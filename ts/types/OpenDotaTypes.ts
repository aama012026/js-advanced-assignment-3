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
	account_id: number,
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

export type ISO8601TimeString = string
export type UnixTimestamp = number
export type AccountId = number
export type SteamId = string | null

export interface PlayerMatches {
	win: number,
	lose: number
}

export interface Match {
	match_id: number,
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

export interface HeroPlayerStats {
	hero_id: number,
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

export enum histogramCols {
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