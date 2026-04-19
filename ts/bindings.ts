import type { ISO8601TimeString, Unique } from "./flow.js"
import type { AbilityId, DotaConstantsHero, GameModeId, HeroId, ItemId, LobbyTypeId, PatchId, RegionId } from "./types/DotaConstantsTypes.js"
import { KEYS, type AccountId, type BarracksBitmask, type BuildingKey, type Distributions, type GoldReasonId, type LaneKey, type LeagueId, type LeaverStatus, type MatchForPlayer, type MatchId, type NeutralItemCrafted, type PartyId, type Pause, type Percentile, type PlayerSlot, type RankBitmask, type SeriesId, type SideKey, type Timing, type WardLogEntry } from "./types/OpenDotaTypes.js"

export type Side = 'radiant' | 'dire'
export type Outcome = 'win' | 'loss'
export type PermanentBuffId = Unique<number, 'permanentBuff'>

export const LANE = {
	SAFE: 'safelane',
	MID: 'midlane',
	OFF: 'offlane',
	RADIANT_JUNGLE: 'radiant jungle',
	DIRE_JUNGLE: 'dire junle'
} as const
export type Lane = typeof LANE[keyof typeof LANE]

export const ROLE = [
	'carry', 'midlaner', 'offlaner', 'soft support', 'hard support'
] as const
export type Role = Unique<typeof ROLE[number], 'role'>

export type DraftAction = 'pick' | 'ban'
export const STRUCTURE_FLAGS = {
	SAFE: {
		T1: 1,
		T2: 1 << 1,
		T3: 1 << 2,
		MELEE_BARRACKS: 1 << 3,
		RANGE_BARRACKS: 1 << 4
	} as const,
	MID: {
		T1: 1 << 5,
		T2: 1 << 6,
		T3: 1 << 7,
		MELEE_BARRACKS: 1 << 8,
		RANGE_BARRACKS: 1 << 9
	} as const,
	OFF: {
		T1: 1 << 10,
		T2: 1 << 11,
		T3: 1 << 12,
		MELEE_BARRACKS: 1 << 13,
		RANGE_BARRACKS: 1 << 14,
	} as const,
	T4: {
		SAFE: 1 << 15,
		OFF: 1 << 16,
	} as const,
	ANCIENT: 1 << 17
} as const
export type StructureFlag = typeof STRUCTURE_FLAGS[keyof typeof STRUCTURE_FLAGS]
export type StructuresBitmask = Unique<number, 'structuresBitmask'>

// performs bitmasking to check if structure was standing at game end
export function structureSurvived(structures: StructuresBitmask, mask: StructureFlag): boolean {
	return ((structures as number) & (mask as number)) != 0
}

export interface Hero {
	id: HeroId,
	name: {
		static: string,
		localized: string
	}
	roles: string[],
	baseHealth: Resource,
	baseMana: Resource,
	baseArmor: number,
	baseMagicResist: number,
	baseAttack: Attack,
	attributes: {
		primary: Attribute,
		base: AttributeSet,
		gain: AttributeSet
	},
	movement: Movement,
	vision: Vision,
	legs: number,
	isInCaptainsMode: boolean
}

export interface Resource {
	size: number,
	regen: number
}

export type Attribute = typeof ATTRIBUTES[keyof typeof ATTRIBUTES]
export const ATTRIBUTES = {
	STRENGTH: 'str',
	AGILITY: 'agi',
	INTELLIGENCE: 'int',
	UNIVERSAL: 'all'
} as const

export interface AttributeSet {
	strength: number,
	agility: number,
	intelligence: number
}

export interface Range {
	min: number,
	max: number
}

export interface Attack {
	damage: Range,
	speed: number,
	rate: number,
	point: number,
	range: number,
	projectile_speed: number
}

export interface Movement {
	speed: number,
	turnRate: number | null
}

export interface Vision {
	day: number,
	night: number
}

export function formatHero(rawHero: DotaConstantsHero): Hero {
	return {
		id: rawHero.id,
		name: {
			static: rawHero.name,
			localized: rawHero.localized_name
		},
		roles: rawHero.roles,
		baseHealth: {
			size: rawHero.base_health,
			regen: rawHero.base_health_regen
		},
		baseMana: {
			size: rawHero.base_mana,
			regen: rawHero.base_mana_regen
		},
		baseArmor: rawHero.base_armor,
		baseMagicResist: rawHero.base_mr,
		baseAttack: {
			damage: {
				min: rawHero.base_attack_min,
				max: rawHero.base_attack_max
			},
			speed: rawHero.base_attack_time,
			rate: rawHero.attack_rate,
			point: rawHero.attack_point,
			range: rawHero.attack_range,
			projectile_speed: rawHero.projectile_speed
		},
		attributes: {
			primary: rawHero.primary_attr as Attribute,
			base: {
				strength: rawHero.base_str,
				agility: rawHero.base_agi,
				intelligence: rawHero.base_int
			},
			gain: {
				strength: rawHero.str_gain,
				agility: rawHero.agi_gain,
				intelligence: rawHero.int_gain
			}
		},
		movement: {
			speed: rawHero.move_speed,
			turnRate: rawHero.turn_rate
		},
		vision: {
			day: rawHero.day_vision,
			night: rawHero.night_vision
		},
		legs: rawHero.legs,
		isInCaptainsMode: rawHero.cm_enabled
	}
}

export interface RankStats {
	rank: RankBitmask,
	count: number
}

export interface RankDistribution {
	ranks: RankStats[],
	timestamp: ISO8601TimeString
}

// We discard the derived data as it is trivial to calculate and would
// double the size.
export function formatRankDistribution(distributions: Distributions) {
	const ranks: RankStats[] = distributions.ranks.rows.map(rank => {
		return {rank: rank.bin as RankBitmask, count: rank.count}
	});
	return {
		ranks: ranks,
		timestamp: new Date().toISOString()
	}
}

// /benchmarks?hero_id returns an array of values for a given percentile.
// It is always an array of values for different percentiles.
export interface Benchmark {
	timestamp: ISO8601TimeString,
	hero: HeroId,
	gpm: Percentile[],
	xpm: Percentile[],
	kpm: Percentile[],
	lhpm: Percentile[],
	dmgpm: Percentile[],
	healpm: Percentile[],
	towerDmg: Percentile[]
}

// Performance represents a hero's peformance in a particular match.
// It is always a single tuple of the raw value and the percentile.
export interface Performance {
	gpm: Percentile,
	xpm: Percentile,
	kpm: Percentile,
	lhpm: Percentile,
	dmgpm: Percentile,
	healpm: Percentile,
	towerDmg: Percentile
}

export interface MatchBase {
	id: MatchId,
	startTime?: ISO8601TimeString,
	lengthSeconds: number,
	winningTeam: Side,
	gameMode: GameModeId,
	lobbyType: LobbyTypeId,
	parseVersion: number | null,
}

export interface PlayerMatchSummary {
	match: MatchBase,
	player: {
		id: AccountId,
		slot?: PlayerSlot,
		leaverStatus: LeaverStatus,
		partySize?: number,
	}
	hero: {
		id: HeroId,
		facet?: number,
		kda: Kda
	}
}

export function formatMatchSummary(summary: MatchForPlayer, player: AccountId): PlayerMatchSummary {
	const matchSummary: PlayerMatchSummary = {
		match: {
			id: summary.match_id,
			lengthSeconds: summary.duration,
			winningTeam: summary.radiant_win ? 'radiant' : 'dire',
			gameMode: summary.game_mode,
			lobbyType: summary.lobby_type,
			parseVersion: summary.version,
		},
		player: {
			id: player,
			leaverStatus: summary.leaver_status
		},
		hero: {
			id: summary.hero_id,
			kda: {
				kills: summary.kills,
				deaths: summary.deaths,
				assists: summary.assists
			}
		}
	}
	if(summary.start_time) {
		const timestamp = new Date(summary.start_time as number).toISOString()
		matchSummary.match.startTime = timestamp as ISO8601TimeString
	}
	if(summary.party_size) {
		matchSummary.player.partySize = summary.party_size
	}
	if(summary.player_slot) {
		matchSummary.player.slot = summary.player_slot
	}
	// TODO: check if facets are still deprecated through dotaconstants and assign hero_variant if not
	return matchSummary
}

export interface SparseMatch extends MatchBase {
	meta: {
		matchSeqNum: number,
		series: {id: SeriesId, type: number},
		leagueId: LeagueId,
		league: object,
		patch: PatchId,
		region: RegionId,
		cluster: number,
		replay: {url: URL, salt: number},
		odota: OpenDotaMetadata
	},
	radiant: {
		structuresLeft: BarracksBitmask,
		kills: number,
	}
	dire: {
		structuresLeft: BarracksBitmask,
		kills: number,
	}
	draft: DraftStep[],
	players: SparseInGamePlayer[],
	firstBloodSeconds: number,
	humanPlayerCount: number,
	preGameLengthSeconds: number
}

export interface FullMatch extends SparseMatch {
	// parsed ---------------------------------------
	players: FullInGamePlayer[],
	teamfights: Teamfight[],
	pauses: Pause[]
	objectives?: NormalizedObjective[],
	chat?: ChatMsg[],
	allChatWordCounts: {
		total: object,
		player: object
	},
	radiantAdv: {
		gold: number,
		xp: number
	},
	goldLeadWinner: MinMax, // values can be negative, invert for loser
	cosmetics?: object,
	draft: DraftStep[] | CaptainsModeDraftStep[],
}

export interface Teamfight {
	startSeconds: number,
	endSeconds: number,
	finalDeathSeconds: number,
	deathCount: number,
	player: TeamfightPlayerData[]
}

export interface TeamfightPlayerData {
	deathPositions: Record<number, Coordinate>,
	abilityUses: Record<AbilityId, number>,
	abilityTargets: object | null, // we don't know the shape of this, has always been empty
	itemUses: Record<ItemId, number>,
	killed: Record<HeroId, number>,
	deathCount: number,
	buybacks?: number, // Can very theoretically be more than once... We don't need this if deaths are 0.
	damage: number,
	healing: number,
	goldDiff: number,
	xpDiff: number,
	xpStart: number // We don't need to keep xp_end when we have the start and offset
}

export const OBJECTIVES = {
	FIRST_BLOOD: 'first blood',
	COURIER: 'courier',
	BUILDING: 'building',
	TORMENTOR: 'tormentor',
	ROSHAN: 'roshan',
	AEGIS: 'aegis'
} as const
export type Objective = typeof OBJECTIVES[keyof typeof OBJECTIVES]

export interface NormalizedObjective {
	whenSeconds: number,
	what: Objective,
	who: HeroId | UnitId,
	target?: HeroId | StructureId, // not needed when objective can only be one target
	value?: number
}

export interface ChatMsg {
	whenSeconds: number,
	type: string,
	value: string,
	playerSlot: PlayerSlot
}

export interface NeutralItem {
	artifact: ItemId,
	enhancement: ItemId,
	craftedSeconds: number
}

function getRelativeLane(side: SideKey, absoluteLane: LaneKey): Lane | null {
	switch(absoluteLane) {
		case KEYS.LANES.MID:
			return LANE.MID
		case KEYS.LANES.BOT:
			return side === KEYS.SIDES.RADIANT ? LANE.SAFE : LANE.OFF
		case KEYS.LANES.TOP:
			return side === KEYS.SIDES.RADIANT ? LANE.OFF : LANE.SAFE
		default:
			return null
	}
}

export interface Coordinate {
	x: number,
	y: number
}

export interface OpenDotaMetadata {
	engine: number,
	parseVersion: number | null,
	api: boolean,
	gcData: boolean,
	archived: boolean,
	flags: number,
	metadata: any,
}

export interface SparseInGamePlayer {
	accountId: AccountId,
	playerSlot?: PlayerSlot,
	personaName?: string,
	name?: string,
	rank?: RankBitmask,
	mmrGuess?: number,
	partyId?: PartyId,
	left: LeaverStatus,
	odota: {
		subscriber: boolean,
		contributor: boolean
	},
	permanentBuffs: PermanentBuff[],
	inventory: ItemId[], // 0-5 for main, 6-8 for backpack
	neutralItem: {artifact: ItemId, enchantment: ItemId}
	performance: Performance,
	kdaRatio: number,
	kda: DetailedKda,
	cs: Cs,
	healing: number,
	abilities: {
		upgrades: number[],
	},
	gold: {
		total: number,
		endAmt: number,
		spent: number,
	},
	hero: {
		id: HeroId,
		lvl: number,
		netWorth: number,
		damageDealt: {
			heroes: number,
			towers: number
		}
		healing: number,
	}
}

export interface FullInGamePlayer extends SparseInGamePlayer {
	stacked: {
		creeps: number,
		camps: number
	}
	runePickups: number,
	gotFirstBlood: boolean,
	teamfightParticipationRate: number,
	kda: DetailedKda,
	gold: {
		total: number,
		endAmt: number,
		spent: number,
		reasons: Record<GoldReasonId, number>,
	}
	timings: {
		timesSeconds: number[],
		gold: number[],
		xp: number[],
		lastHits: number[],
		denies: number[]
	}
	logs: {
		observers: WardLogEntry[],
		sentries: WardLogEntry[]
	}
	

}
// Are the ward_left logs for wards the hero owned that was killed or wards the hero killed?
export interface WardLogEntry {
	placedSeconds: number,
	placedBy: PlayerSlot,
	leftSeconds: number,
	killer?: string,
	type: 'observer' | 'sentry',
	position: {
		x: number,
		y: number,
		z: number,
	}
}

export interface PermanentBuff {
	id: PermanentBuffId,
	stackCount: number,
	receivedSeconds: number
}

export interface Kda {
	kills: number,
	deaths: number,
	assists: number
}
export interface DetailedKda extends Kda {
	killsLog: Timing[],
	killstreak: Record<number, number>,
	killed: Record<string, number>,
	killedBy: Record<string, number>,
}

export interface Cs {
	lastHits: {
		count: number,
		atTime: number[]
	},
	denies: {
		count: number,
		atTime: number[]
	}
}

export interface DmgBreakdown {
	distribution: object,
	sources: object
}

export interface MinMax {
	min: number,
	max: number
}

export interface DraftStep {
	order: number,
	action: DraftAction,
	team: Side,
	hero: HeroId,
	playerSlot: PlayerSlot,
}

export interface CaptainsModeDraftStep extends DraftStep {
	time: {
		extra: number,
		total: number
	}
}

export type IdBinding = Array<{id: number, external: string, internal: string }>

export type UnitId = Unique<number, 'unitId'>
export const UNIT_IDS: IdBinding = [
	{
		id: 0,
		external: 'npc_dota_creep_goodguys_melee',
		internal: 'radiant melee creep'
	},
	{
		id: 1,
		external: 'npc_dota_creep_goodguys_ranged',
		internal: 'radiant ranged creep'
	},
	{
		id: 2,
		external: 'npc_dota_goodguys_siege',
		internal: 'radiant siege creep'
	},
	{
		id: 3,
		external: 'npc_dota_creep_badguys_melee',
		internal: 'dire melee creep'
	},
	{
		id: 4,
		external: 'npc_dota_creep_badguys_ranged',
		internal: 'dire ranged creep'
	},
	{
		id: 5,
		external: 'npc_dota_badguys_siege',
		internal: 'dire siege creep'
	}
] as const

export type StructureId = Unique<number, 'structureId'>
export const STRUCTURE_IDS: IdBinding = [
	{
		id: 0,
		external: 'npc_dota_goodguys_tower1_bot',
		internal: 'radiant safelane tier 1 tower'
	},
	{
		id: 1,
		external: 'npc_dota_goodguys_tower2_bot',
		internal: 'radiant safelane tier 2 tower'
	},
	{
		id: 2,
		external: 'npc_dota_goodguys_tower3_bot',
		internal: 'radiant safelane tier 3 tower'
	},
	{
		id: 3,
		external: 'npc_dota_goodguys_melee_rax_bot',
		internal: 'radiant safelane melee barracks'
	},
	{
		id: 4,
		external: 'npc_dota_goodguys_range_rax_bot',
		internal: 'radiant safelane range barracks'
	},
	{
		id: 5,
		external: 'npc_dota_goodguys_tower1_mid',
		internal: 'radiant midlane tier 1 tower'
	},
	{
		id: 6,
		external: 'npc_dota_goodguys_tower2_mid',
		internal: 'radiant midlane tier 2 tower'
	},
	{
		id: 7,
		external: 'npc_dota_goodguys_tower3_mid',
		internal: 'radiant midlane tier 3 tower'
	},
	{
		id: 8,
		external: 'npc_dota_goodguys_melee_rax_mid',
		internal: 'radiant midlane melee barracks'
	},
	{
		id: 9,
		external: 'npc_dota_goodguys_range_rax_mid',
		internal: 'radiant midlane range barracks'
	},
		{
		id: 10,
		external: 'npc_dota_goodguys_tower1_top',
		internal: 'radiant offlane tier 1 tower'
	},
	{
		id: 11,
		external: 'npc_dota_goodguys_tower2_top',
		internal: 'radiant offlane tier 2 tower'
	},
	{
		id: 12,
		external: 'npc_dota_goodguys_tower3_top',
		internal: 'radiant offlane tier 3 tower'
	},
	{
		id: 13,
		external: 'npc_dota_goodguys_melee_rax_top',
		internal: 'radiant offlane melee barracks'
	},
	{
		id: 14,
		external: 'npc_dota_goodguys_range_rax_top',
		internal: 'radiant offlane range barracks'
	},
	{
		id: 15,
		external: 'npc_dota_goodguys_tower4',
		internal: 'radiant tier 4 tower'
	},
	{
		id: 16,
		external: 'npc_dota_goodguys_fort',
		internal: 'radiant ancient'
	},
	{
		id: 17,
		external: 'npc_dota_badguys_tower1_top',
		internal: 'dire safelane tier 1 tower'
	},
	{
		id: 18,
		external: 'npc_dota_badguys_tower2_top',
		internal: 'dire safelane tier 2 tower'
	},
	{
		id: 19,
		external: 'npc_dota_badguys_tower3_top',
		internal: 'dire safelane tier 3 tower'
	},
	{
		id: 20,
		external: 'npc_dota_badguys_melee_rax_top',
		internal: 'dire safelane melee barracks'
	},
	{
		id: 21,
		external: 'npc_dota_badguys_range_rax_top',
		internal: 'dire safelane range barracks'
	},
	{
		id: 22,
		external: 'npc_dota_badguys_tower1_mid',
		internal: 'dire midlane tier 1 tower'
	},
	{
		id: 23,
		external: 'npc_dota_badguys_tower2_mid',
		internal: 'dire midlane tier 2 tower'
	},
	{
		id: 24,
		external: 'npc_dota_badguys_tower3_mid',
		internal: 'dire midlane tier 3 tower'
	},
	{
		id: 25,
		external: 'npc_dota_badguys_melee_rax_mid',
		internal: 'dire midlane melee barracks'
	},
	{
		id: 26,
		external: 'npc_dota_badguys_range_rax_mid',
		internal: 'dire midlane range barracks'
	},
	{
		id: 27,
		external: 'npc_dota_badguys_tower1_bot',
		internal: 'dire offlane tier 1 tower'
	},
	{
		id: 28,
		external: 'npc_dota_badguys_tower2_bot',
		internal: 'dire offlane tier 2 tower'
	},
	{
		id: 29,
		external: 'npc_dota_badguys_tower3_bot',
		internal: 'dire offlane tier 3 tower'
	},
	{
		id: 30,
		external: 'npc_dota_badguys_melee_rax_bot',
		internal: 'dire offlane melee barracks'
	},
	{
		id: 31,
		external: 'npc_dota_badguys_range_rax_bot',
		internal: 'dire offlane range barracks'
	},
	{
		id: 32,
		external: 'npc_dota_badguys_tower4',
		internal: 'dire tier 4 tower'
	},
	{
		id: 33,
		external: 'npc_dota_badguys_fort',
		internal: 'dire ancient'
	},
] as const
