import type { ISO8601TimeString, Unique } from "./flow.js"
import type { AbilityId, DotaConstantsHero,
	GameModeId, HeroId, ItemId, LobbyTypeId, PatchId, RegionId, UnitOrderId
} from "./types/DotaConstantsTypes.js"
import { KEYS, type AccountId, type BarracksBitmask, type Cosmetic,
	type Distributions, type GoldReasonId, type LaneKey, type LeagueId,
	type LeaverStatus, type MatchForPlayer, type MatchId, type PartyId, type Pause,
	type Percentile, type PlayerSlot, type RankBitmask, type SeriesId,
	type SideKey, type XpReasonId } from "./types/OpenDotaTypes.js"

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
	fetchTime: ISO8601TimeString,
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
		kda: {kills: number, deaths: number, assists: number}
	}
}

export function formatMatchSummary(summary: MatchForPlayer, player: AccountId): PlayerMatchSummary {
	const matchSummary: PlayerMatchSummary = {
		match: {
			id: summary.match_id,
			fetchTime : new Date().toISOString() as ISO8601TimeString,
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
	allChatWordCounts: {total: object, player: object},
	radiantAdv: {gold: number, xp: number},
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
	deathPositionsByWhen: Record<number, {x: number, y: number}>,
	abilityUses: Record<AbilityId, number>,
	abilityTargets?: Record<AbilityId, Record<HeroId, number>>,
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
// Old neutral system
export interface NeutralToken { token: ItemId, receivedSeconds: number }

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
	account: {
		id: AccountId,
		personaName?: string,
		name?: string,
		rank?: RankBitmask,
		mmrGuess?: number, // Have been pretty bad...
		oDota: {subscriber: boolean, contributor: boolean}
	},
	slot?: PlayerSlot,
	partyId?: PartyId,
	left: LeaverStatus,
	performance: Performance,
	kda: {kills: number, deaths: number, assists: number, ratio: number},
	cs: {lastHits: number, denies: number},
	// if total-spent != remaining, gold lost is not concidered spent by the API.
	gold: {total: number, spent: number, remaining: number},
	hero: {
		id: HeroId,
		lvl: number,
		abilityUpgrades: AbilityId[],
		permanentBuffs: PermanentBuff[],
		netWorth: number,
		inventory: ItemId[], // 0-5 for main, 6-8 for backpack
		neutralItem: {artifact: ItemId, enchantment: ItemId}
	},
	damage: {
		toHeroes: number,
		toBuildings: number
	}
	healing: {
		amt: number
	}
}

export interface FullInGamePlayer extends SparseInGamePlayer {
	stacked: {creeps: number, camps: number},
	laning: {
		lane: Lane,
		efficiencyRate: number,
		weightedPosCoords: Record<number, Record<number, number>>,
		roamed: boolean,
		kills: number
	}
	role: Role,
	randomed: boolean,
	predictedWin: boolean,
	gotFirstBlood: boolean,
	teamfightParticipationRate: number,
	wasStunnedSeconds: number,
	xpReasons: Record<XpReasonId, number>,
	goldReasons: Record<GoldReasonId, number>,
	damage: {
		toHeroes: number,
		toBuildings: number,
		dealt: {
			// includes creeps, illusions, structures etc.
			to: Record<string, number>,
			by: Record<string, number>,
			// src can at least be null (maybe rightclick dmg.) | ability | item.
			// number is dmg.amt. Only includes heroes.
			targetsBySource: Record<string, Record<HeroId, number>>
		},
		received: {
			from: Record<string, number>,
			by: Record<string, number>,
		},
		hitCount: Record<HeroId, number>,
		hardestHit: HardestHitDealt,
	},
	healing: {
		amt: number,
		bySource: Record<string, number>, // string should probably become id.
	},
	lifeState: Record<number, number>, // ???
	abilities: {
		uses: Record<AbilityId, number>,
		targets: Record<AbilityId, Record<HeroId, number>>,
	}
	items: {
		uses: Record<ItemId, number>,
		// we don't neccessarily get recipe entries,
		// so we need to watch item completions.
		purchases: Array<{whenSeconds: number, item: ItemId}>,
	},
	timings: MatchTimings,
	logs: {
		// should end up as combination of obs_log and obs_left_log.
		observers: WardLogEntry[],
		sentries: WardLogEntry[],
		kills: Array<{whenSeconds: number, who: HeroId}>,
		buybackTimestamps: number[],
		runes: Array<{whenSeconds: number, rune: RuneId}>,
		neutralItems: NeutralItem[],
		neutralTokensLog?: Array<{receivedSeconds: number, item: ItemId}>
		// TODO: bind events to ids -> need sample responses...
		connection: Array<{whenSeconds: number, event: ConnectionEventId}>,
	},
	killed: Record<string, number>, //includes creeps, wards, buildings, etc.
	killedBy: Record<string, number>, //can presumably include more than heroes.
	killstreak: Record<number, number>,
	multikills: Record<number, number>,
	actions: Record<UnitOrderId, number>,
	apm: number, //not strictly needed as we can divide above with match length
	pingCount: number,
	cosmetics?: Cosmetic[],
	additionalUnits?: object[]
}

export interface NeutralItem {
	craftedSeconds: number,
	artifact: ItemId,
	enchantment: ItemId
}

export type ConnectionEventId = Unique<number, 'connectionEvent'>

export interface WardLogEntry {
	placedSeconds: number,
	leftSeconds: number,
	killer?: string, // odota shows placers as attackers if ward times out, so we have to guard against full duration if killer is same as placedBy.
	type: 'observer' | 'sentry',
	position: {x: number, y: number, z: number}
}

export interface HardestHitDealt {
	whenSeconds: number,
	// keep this in case hardest hit can come from other than hero.
	unit?: string,
	who: string,
	// can be both items and abilities, so keep string and resolve on display.
	what: string,
	amount: number
}

export interface MatchTimings {
	timedSeconds: number[],
	goldValues: number[],
	xpValues: number[],
	lastHits: number[],
	denies: number[]
}

export interface PermanentBuff {
	id: PermanentBuffId,
	stackCount: number,
	receivedSeconds: number
}

export interface DmgBreakdown {distribution: object, sources: object}

export interface MinMax {min: number, max: number}

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

export type IdBinding<T> = {id: number, label: string, extKey: T}

export type RuneId = Unique<number, 'rune'>
export const RUNES: IdBinding<number>[] = [
	{id: 0, label: 'bounty', extKey: 5},
	{id: 1, label: 'wisdom', extKey: 8},
	{id: 2, label: 'water', extKey: 7},
	{id: 3, label: 'invisibility', extKey: 3},
	{id: 4, label: 'regeneration', extKey: 4},
	{id: 5, label: 'amplify damage', extKey: 0},
	{id: 6, label: 'arcane', extKey: 6},
	{id: 7, label: 'haste', extKey: 1},
	{id: 8, label: 'illusion', extKey: 2},
	{id: 9, label: 'shield', extKey: 9}
] as const

export const GOLD_SOURCES: IdBinding<number>[] = [
	{id: 0, label: 'other', extKey: 0},
	{id: 1, label: 'deaths', extKey: 1},
	{id: 6, label: 'unknown6', extKey: 6},
	{id: 11, label: 'buildings', extKey: 11},
	{id: 12, label: 'heroes', extKey: 12},
	{id: 13, label: 'lane creeps', extKey: 13},
	{id: 14, label: 'neutral creeps', extKey: 14},
	{id: 16, label: 'first blood', extKey: 16},
	{id: 17, label: 'bounty runes', extKey: 17},
	{id: 19, label: 'unknown19', extKey: 19},
	{id: 20, label: 'wards', extKey: 20},
] as const


export const XP_SOURCES: IdBinding<number>[] = [
	{id: 0, label: 'other', extKey: 0},
	{id: 1, label: 'heroes', extKey: 1},
	{id: 2, label: 'creeps', extKey: 2},
	{id: 4, label: 'unknown4', extKey: 4},
] as const

export type UnitId = Unique<number, 'unitId'>
export const UNIT_IDS: IdBinding<string>[] = [
	{
		id: 0,
		label: 'radiant melee creep',
		extKey: 'npc_dota_creep_goodguys_melee'
	},
	{
		id: 1,
		label: 'radiant ranged creep',
		extKey: 'npc_dota_creep_goodguys_ranged'
	},
	{
		id: 2,
		label: 'radiant siege creep',
		extKey: 'npc_dota_goodguys_siege'
	},
	{
		id: 3,
		label: 'dire melee creep',
		extKey: 'npc_dota_creep_badguys_melee'
	},
	{
		id: 4,
		label: 'dire ranged creep',
		extKey: 'npc_dota_creep_badguys_ranged'
	},
	{
		id: 5,
		label: 'dire siege creep',
		extKey: 'npc_dota_badguys_siege'
	}
] as const

export type StructureId = Unique<number, 'structureId'>
export const STRUCTURE_IDS: IdBinding<string>[] = [
	{
		id: 0,
		label: 'radiant safelane tier 1 tower',
		extKey: 'npc_dota_goodguys_tower1_bot'
	},
	{
		id: 1,
		label: 'radiant safelane tier 2 tower',
		extKey: 'npc_dota_goodguys_tower2_bot'
	},
	{
		id: 2,
		label: 'radiant safelane tier 3 tower',
		extKey: 'npc_dota_goodguys_tower3_bot'
	},
	{
		id: 3,
		label: 'radiant safelane melee barracks',
		extKey: 'npc_dota_goodguys_melee_rax_bot'
	},
	{
		id: 4,
		label: 'radiant safelane range barracks',
		extKey: 'npc_dota_goodguys_range_rax_bot'
	},
	{
		id: 5,
		label: 'radiant midlane tier 1 tower',
		extKey: 'npc_dota_goodguys_tower1_mid'
	},
	{
		id: 6,
		label: 'radiant midlane tier 2 tower',
		extKey: 'npc_dota_goodguys_tower2_mid'
	},
	{
		id: 7,
		label: 'radiant midlane tier 3 tower',
		extKey: 'npc_dota_goodguys_tower3_mid'
	},
	{
		id: 8,
		label: 'radiant midlane melee barracks',
		extKey: 'npc_dota_goodguys_melee_rax_mid'
	},
	{
		id: 9,
		label: 'radiant midlane range barracks',
		extKey: 'npc_dota_goodguys_range_rax_mid'
	},
		{
		id: 10,
		label: 'radiant offlane tier 1 tower',
		extKey: 'npc_dota_goodguys_tower1_top'
	},
	{
		id: 11,
		label: 'radiant offlane tier 2 tower',
		extKey: 'npc_dota_goodguys_tower2_top'
	},
	{
		id: 12,
		label: 'radiant offlane tier 3 tower',
		extKey: 'npc_dota_goodguys_tower3_top'
	},
	{
		id: 13,
		label: 'radiant offlane melee barracks',
		extKey: 'npc_dota_goodguys_melee_rax_top'
	},
	{
		id: 14,
		label: 'radiant offlane range barracks',
		extKey: 'npc_dota_goodguys_range_rax_top'
	},
	{
		id: 15,
		label: 'radiant tier 4 tower',
		extKey: 'npc_dota_goodguys_tower4'
	},
	{
		id: 16,
		label: 'radiant ancient',
		extKey: 'npc_dota_goodguys_fort'
	},
	{
		id: 17,
		label: 'dire safelane tier 1 tower',
		extKey: 'npc_dota_badguys_tower1_top'
	},
	{
		id: 18,
		label: 'dire safelane tier 2 tower',
		extKey: 'npc_dota_badguys_tower2_top'
	},
	{
		id: 19,
		label: 'dire safelane tier 3 tower',
		extKey: 'npc_dota_badguys_tower3_top'
	},
	{
		id: 20,
		label: 'dire safelane melee barracks',
		extKey: 'npc_dota_badguys_melee_rax_top'
	},
	{
		id: 21,
		label: 'dire safelane range barracks',
		extKey: 'npc_dota_badguys_range_rax_top'
	},
	{
		id: 22,
		label: 'dire midlane tier 1 tower',
		extKey: 'npc_dota_badguys_tower1_mid'
	},
	{
		id: 23,
		label: 'dire midlane tier 2 tower',
		extKey: 'npc_dota_badguys_tower2_mid'
	},
	{
		id: 24,
		label: 'dire midlane tier 3 tower',
		extKey: 'npc_dota_badguys_tower3_mid'
	},
	{
		id: 25,
		label: 'dire midlane melee barracks',
		extKey: 'npc_dota_badguys_melee_rax_mid'
	},
	{
		id: 26,
		label: 'dire midlane range barracks',
		extKey: 'npc_dota_badguys_range_rax_mid'
	},
	{
		id: 27,
		label: 'dire offlane tier 1 tower',
		extKey: 'npc_dota_badguys_tower1_bot'
	},
	{
		id: 28,
		label: 'dire offlane tier 2 tower',
		extKey: 'npc_dota_badguys_tower2_bot'
	},
	{
		id: 29,
		label: 'dire offlane tier 3 tower',
		extKey: 'npc_dota_badguys_tower3_bot'
	},
	{
		id: 30,
		label: 'dire offlane melee barracks',
		extKey: 'npc_dota_badguys_melee_rax_bot'
	},
	{
		id: 31,
		label: 'dire offlane range barracks',
		extKey: 'npc_dota_badguys_range_rax_bot'
	},
	{
		id: 32,
		label: 'dire tier 4 tower',
		extKey: 'npc_dota_badguys_tower4'
	},
	{
		id: 33,
		label: 'dire ancient',
		extKey: 'npc_dota_badguys_fort'
	},
] as const
