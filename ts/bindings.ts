import type { ISO8601TimeString, Unique } from "./flow.js"
import type { AbilityId, DotaConstantsHero,
	GameModeId, HeroId, ItemId, LobbyTypeId, PatchId, RegionId, UnitOrderId
} from "./types/DotaConstantsTypes.js"
import { type AccountId, type BarracksBitmask, type Cosmetic,
	type Distributions, type GoldReasonId, type LeagueId,
	type LeaverStatus, type MatchForPlayer, type MatchId, type OdotaParsedPlayer, type OdotaWardLogEntry, type PartyId, type Pause,
	type Percentile, type PlayerSlot, type RankBitmask, type SeriesId,
	type XpReasonId } from "./types/OpenDotaTypes.js"

export type Side = 'radiant' | 'dire'
export type Outcome = 'win' | 'loss'
export type PermanentBuffId = Unique<number, 'permanentBuff'>

interface Id {key: number, label: string}
interface IdBinding<T> extends Id {extId: T}
export const LANES = [
	{key: 0, label: 'safelane', extId: 1},
	{key: 1, label: 'midlane', extId: 2},
	{key: 2, label: 'offlane', extId: 3},
	/** maybe not needed */
	{key: 3, label: 'radiant jungle', extId: 4},
	/** maybe not needed */
	{key: 4, label: 'dire junle', extId: 5}
] as const satisfies IdBinding<number>[]
export type LaneKey = typeof LANES[number]['key']
export type LaneLabel = typeof LANES[number]['label']
export type LaneExtId = typeof LANES[number]['extId']

export const LaneKeyByExtId = Object.fromEntries(
	LANES.map(lane => [lane.extId, lane.key])
) as Record<LaneExtId, LaneKey>
export const Lanes = Object.fromEntries(
	LANES.map(lane => [lane.key, lane.label])
) as Record<LaneKey, LaneLabel>

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
	players: SparsePlayer[],
	firstBloodSeconds: number,
	humanPlayerCount: number,
	preGameLengthSeconds: number
}

export interface FullMatch extends SparseMatch {
	// parsed ---------------------------------------
	players: ParsedPlayer[],
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
	who: HeroId | UnitKey,
	target?: HeroId | StructureKey, // not needed when objective can only be one target
	value?: number
}

export interface ChatMsg {
	whenSeconds: number,
	type: string,
	value: string,
	playerSlot: PlayerSlot
}

// Old neutral system
export interface NeutralToken { token: ItemId, receivedSeconds: number }

export interface OpenDotaMetadata {
	engine: number,
	parseVersion: number | null,
	api: boolean,
	gcData: boolean,
	archived: boolean,
	flags: number,
	metadata: any,
}

export interface SparsePlayer {
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

export interface ParsedPlayer extends SparsePlayer {
	stacked: {creeps: number, camps: number},
	laning: {
		lane: LaneKey,
		efficiencyRate: number,
		weightedPosCoords: Record<number, Record<number, number>>,
		roamed?: boolean,
		kills: number
	}
	randomed: boolean,
	predictedWin: boolean,
	gotFirstBlood: boolean,
	teamfightParticipationRate: number,
	wasStunnedSeconds: number,
	xpSources: Record<XpSourceKey, number>,
	goldSources: Record<GoldReasonId, number>,
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
	lifeState: Record<LifeStateKey, number>,
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
		connection: Array<{whenSeconds: number, event: string}>,
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

export function formatFullInGamePlayer(player: OdotaParsedPlayer): ParsedPlayer {
	const parsedPlayer: ParsedPlayer = {
		account: {
			id: player.account_id,
			oDota: {
				subscriber: player.is_subscriber,
				contributor: player.is_contributor
			}
		},
		left: player.leaver_status,
		performance: {
			gpm: {
				percentile: player.benchmarks.gold_per_min.pct,
				value: player.benchmarks.gold_per_min.raw
			},
			xpm: {
				percentile: player.benchmarks.xp_per_min.pct,
				value: player.benchmarks.xp_per_min.raw,
			},
			kpm: {
				percentile: player.benchmarks.kills_per_min.pct,
				value: player.benchmarks.kills_per_min.raw
			},
			lhpm: {
				percentile: player.benchmarks.last_hits_per_min.pct,
				value: player.benchmarks.last_hits_per_min.raw
			},
			dmgpm: {
				percentile: player.benchmarks.hero_damage_per_min.pct,
				value: player.benchmarks.hero_damage_per_min.raw
			},
			healpm: {
				percentile: player.benchmarks.hero_healing_per_min.pct,
				value: player.benchmarks.hero_healing_per_min.raw
			},
			towerDmg: {
				percentile: player.benchmarks.tower_damage.pct,
				value: player.benchmarks.tower_damage.raw
			}
		},
		kda: {
			kills: player.kills,
			deaths: player.deaths,
			assists: player.assists,
			ratio: player.kda
		},
		cs: {lastHits: player.last_hits, denies: player.denies},
		gold: {
			total: player.total_gold,
			spent: player.gold_spent,
			remaining: player.gold
		},
		hero: {
			id: player.hero_id,
			lvl: player.level,
			abilityUpgrades: player.ability_upgrades_arr,
			permanentBuffs: player.permanent_buffs.map(buff => {
				return {
					id: buff.permanent_buff as PermanentBuffId,
					stackCount: buff.stack_count,
					receivedSeconds: buff.grant_time
				}
			}),
			netWorth: player.net_worth,
			inventory: [
				player.item_0, player.item_1, player.item_2, 
				player.item_3, player.item_4, player.item_5, 
				player.backpack_0, player.backpack_1, player.backpack_2
			],
			neutralItem: {
				artifact: player.item_neutral,
				enchantment: player.item_neutral2
			}
		},
		damage: {
			toHeroes: player.hero_damage,
			toBuildings: player.tower_damage,
			dealt: {
				to: player.damage,
				by: player.damage_inflictor,
				targetsBySource: player.damage_targets
			},
			received: {
				from: player.damage_taken,
				by: player.damage_inflictor_received
			},
			hitCount: player.hero_hits,
			hardestHit: {
				whenSeconds: player.max_hero_hit.time,
				// TODO: who should be heroId - conversion needed.
				who: player.max_hero_hit.key,
				what: player.max_hero_hit.inflictor,
				amount: player.max_hero_hit.value
			}
		},
		healing: {
			amt: player.hero_healing,
			bySource: player.healing
		},
		stacked: {
			creeps: player.creeps_stacked, camps: player.camps_stacked
		},
		laning: {
			lane: LaneKeyByExtId[player.lane_role! as LaneExtId],
			efficiencyRate: player.lane_efficiency,
			weightedPosCoords: player.lane_pos,
			kills: player.lane_kills
		},
		randomed: player.randomed,
		predictedWin: player.pred_vict,
		gotFirstBlood: player.firstblood_claimed === 1 ? true : false,
		teamfightParticipationRate: player.teamfight_participation,
		wasStunnedSeconds: player.stuns,
		// TODO: external IDs should be validated; we can probably refactor
		// into generic function.
		xpSources: translateRecord<XpReasonId, XpSourceKey, number>(
			player.xp_reasons, XpSourceKeyByExtId
		),
		goldSources: translateRecord<GoldReasonId, GoldSourceKey, number>(
			player.gold_reasons, GoldSrcKeysByExtId
		),
		lifeState: translateRecord<number, LifeStateKey, number>(
			player.life_state, LifeStateKeysByExtId
		),
		abilities: {
			/** TODO: These are currently string keys, but the keys should be an
			internally bound id. This requires fetching the ability IDs from the
			dotaconstants repo and generating a mapping as a build step: We have
			to check the fetch against the previous build to see if any 
			<key, value> pairing has changed and, if so, correct our binding. */
			uses: player.ability_uses,
			targets: player.ability_targets
		},
		items: {
			uses: player.item_usage,
			purchases: player.purchase_log.map(({time, key}) => { 
				/** TODO: same as above for Item IDs */
				return {whenSeconds: time, item: key}
			})
		},
		timings: {
			timedSeconds: player.times,
			goldValues: player.gold_t,
			xpValues: player.xp_t,
			lastHits: player.lh_t,
			denies: player.dn_t
		},
		logs: {
			observers: formatWardLog(player.obs_log, player.obs_left_log),
			sentries: formatWardLog(player.sen_log, player.sen_left_log),
			kills: player.kills_log.map(({time, key}) => {
				/** TODO: same as above for Hero IDs */
				return {whenSeconds: time, who: key}
			}),
			buybackTimestamps: player.buyback_log.map(bb => bb.time),
			runes: player.runes_log.map(({time, key}) => {
				return {
					whenSeconds: time,
					rune: RuneKeysByExtId[parseInt(key) as RuneExtId]
				}
			}),
			neutralItems: player.neutral_item_history.map((n => {
				/** Same as above for Item IDs */
				return {
					artifact: n.item_neutral,
					enchantment: n.item_neutral_enhancement,
					craftedSeconds: n.time
				}
			})),
			// TODO: insert old neutral token log for old matches
			// TODO: create id bindings for connection events.
			connection: Object.entries(player.connection_log).map(([_, v]) => {
				return {whenSeconds: v.time, event: v.event }
			}),
		},
		killed: player.killed,
		killedBy: player.killed_by,
		killstreak: player.kill_streaks,
		multikills: player.multi_kills,
		/** TODO: Same as further up, but for Unit order IDs */
		actions: player.actions,
		apm: player.actions_per_min,
		pingCount: player.pings,
	}
	switch(true) {
		case !!player.personaname: 
			parsedPlayer.account.personaName = player.personaname
		case !!player.name:
			parsedPlayer.account.name = player.name!
		case !!player.rank_tier:
			parsedPlayer.account.rank = player.rank_tier!
		case !!player.computed_mmr:
			parsedPlayer.account.mmrGuess = player.computed_mmr!
		case !!player.player_slot:
			parsedPlayer.slot = player.player_slot!
		case !!player.party_id:
			parsedPlayer.partyId = player.party_id! as PartyId
		case !!player.is_roaming:
			parsedPlayer.laning.roamed = true
		case !!player.cosmetics:
			parsedPlayer.cosmetics = player.cosmetics
		case !!player.additional_units:
			parsedPlayer.additionalUnits
	}
}

function translateRecord<inK extends number, outK extends number | string, valueT>
(record: Record<inK, valueT>, lookup: Record<inK, outK>) {
	return Object.fromEntries(
		Object.entries(record).map(([k, v]) => [lookup[parseInt(k) as inK], v])
	) as Record<outK, valueT>
}

function formatWardLog(enteredLog: OdotaWardLogEntry[], leftLog: OdotaWardLogEntry[]) {
	enteredLog.sort((a, b) => a.ehandle - b.ehandle);
	leftLog.sort((a, b) => a.ehandle - b.ehandle);
	const wardLog: WardLogEntry[] = []
	enteredLog.forEach((entry, i) => {
		const combinedEntry: WardLogEntry = {
			placedSeconds: entry.time,
			leftSeconds: leftLog[i]?.time ?? null,
			position: {x: entry.x, y: entry.y, z: entry.z},
		}
		if(leftLog[i]?.attackername) {
			combinedEntry.killer = leftLog[i].attackername
		}
		wardLog.push(combinedEntry)
	})
	return wardLog
}

export interface NeutralItem {
	craftedSeconds: number,
	artifact: ItemId,
	enchantment: ItemId
}

export interface WardLogEntry {
	placedSeconds: number,
	leftSeconds: number | null,
	killer?: string, // odota shows placers as attackers if ward times out, so we have to guard against full duration if killer is same as placedBy.
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


export const RUNES = [
	{key: 0, label: 'bounty', extId: 5},
	{key: 1, label: 'wisdom', extId: 8},
	{key: 2, label: 'water', extId: 7},
	{key: 3, label: 'invisibility', extId: 3},
	{key: 4, label: 'regeneration', extId: 4},
	{key: 5, label: 'amplify damage', extId: 0},
	{key: 6, label: 'arcane', extId: 6},
	{key: 7, label: 'haste', extId: 1},
	{key: 8, label: 'illusion', extId: 2},
	{key: 9, label: 'shield', extId: 9}
] as const satisfies readonly IdBinding<number>[]

export type RuneKey = typeof RUNES[number]['key']
export type RuneLabel = typeof RUNES[number]['label']
export type RuneExtId = typeof RUNES[number]['extId']

export const RuneKeysByExtId = Object.fromEntries(
	RUNES.map(rune => [rune.extId, rune.key])
) as Record<RuneExtId, RuneKey>
export const Runes = Object.fromEntries(
	RUNES.map(rune => [rune.key, rune.label])
) as Record<RuneKey, RuneLabel>

export const GOLD_SOURCES = [
	{key: 0, label: 'other', extId: 0},
	{key: 1, label: 'deaths', extId: 1},
	{key: 6, label: 'unknown6', extId: 6},
	{key: 11, label: 'buildings', extId: 11},
	{key: 12, label: 'heroes', extId: 12},
	{key: 13, label: 'lane creeps', extId: 13},
	{key: 14, label: 'neutral creeps', extId: 14},
	{key: 16, label: 'first blood', extId: 16},
	{key: 17, label: 'bounty runes', extId: 17},
	{key: 19, label: 'unknown19', extId: 19},
	{key: 20, label: 'wards', extId: 20},
	{key: 21, label: 'unknown21 (value 135)', extId: 21}
] as const satisfies readonly IdBinding<number>[]

export type GoldSourceKey = typeof GOLD_SOURCES[number]['key']
export type GoldSourceLabel = typeof GOLD_SOURCES[number]['label']
export type GoldSourceExtId = typeof GOLD_SOURCES[number]['extId']

export const GoldSrcKeysByExtId = Object.fromEntries(
	GOLD_SOURCES.map(src => [src.extId, src.key])
) as Record<GoldSourceExtId, GoldSourceKey>
export const GoldSources = Object.fromEntries(
	GOLD_SOURCES.map(src => [src.key, src.label])
) as Record<GoldSourceKey, GoldSourceLabel>

export const XP_SOURCES = [
	{key: 0, label: 'other', extId: 0},
	{key: 1, label: 'heroes', extId: 1},
	{key: 2, label: 'creeps', extId: 2},
	{key: 4, label: 'unknown4', extId: 4},
] as const satisfies readonly IdBinding<number>[]

export type XpSourceKey = typeof XP_SOURCES[number]['key']
export type XpSourceLabel = typeof XP_SOURCES[number]['label']
export type XpSourceExtId = typeof XP_SOURCES[number]['extId']

export const XpSourceKeyByExtId = Object.fromEntries(
	XP_SOURCES.map(src => [src.extId, src.key])
) as Record<XpSourceExtId, XpSourceKey>
export const XpSources = Object.fromEntries(
	XP_SOURCES.map(src => [src.key, src.label])
) as Record<XpSourceKey, XpSourceLabel>

// Single source of truth data binding
export const LIFE_STATES = [
	{key:0, label: 'alvie', extId: 0},
	{key:1, label:'unknown (pseudo-death?)', extId: 1},
	{key:2, label:'dead', extId: 2}
	// Potential unknown sources: respawning, reincarnation / pseudo-death (aegis, wraith king)
] as const satisfies readonly IdBinding<number>[]

// Derived types
export type LifeStateKey = typeof LIFE_STATES[number]['key']
export type LifeStateLabel = typeof LIFE_STATES[number]['label']
export type LifeStateExtId = typeof LIFE_STATES[number]['extId']

// Lookups - (we really only need external -> internal and internal -> label as we always transform and store data by internal id).
export const LifeStateKeysByExtId = Object.fromEntries(
	LIFE_STATES.map(state => [state.extId, state.key])
) as Record<LifeStateExtId, LifeStateKey>
/* We could have defined the original data in the structure of this record, but
we get the added compile time safety by only allowing valid IDs through type. */
export const LifeStates = Object.fromEntries(
	LIFE_STATES.map( state => [state.key, state.label])
) as Record<LifeStateKey, LifeStateLabel>

// Computed values
export function getSecondsDead(lifeState: Record<LifeStateKey, number>): number {
	return (lifeState[LIFE_STATES[1].key] || 0) + (lifeState[LIFE_STATES[2].key] || 0)
}

export const UNIT_IDS = [
	{
		key: 0,
		label: 'radiant melee creep',
		extId: 'npc_dota_creep_goodguys_melee'
	},
	{
		key: 1,
		label: 'radiant ranged creep',
		extId: 'npc_dota_creep_goodguys_ranged'
	},
	{
		key: 2,
		label: 'radiant siege creep',
		extId: 'npc_dota_goodguys_siege'
	},
	{
		key: 3,
		label: 'dire melee creep',
		extId: 'npc_dota_creep_badguys_melee'
	},
	{
		key: 4,
		label: 'dire ranged creep',
		extId: 'npc_dota_creep_badguys_ranged'
	},
	{
		key: 5,
		label: 'dire siege creep',
		extId: 'npc_dota_badguys_siege'
	}
] as const satisfies IdBinding<string>[]

export type UnitKey = typeof UNIT_IDS[number]['key']
export type UnitName = typeof UNIT_IDS[number]['label']
export type UnitExtId = typeof UNIT_IDS[number]['extId']

export const UnitKeysByExtId = Object.fromEntries(
	UNIT_IDS.map(unit => [unit.extId, unit.key])
) as Record<UnitExtId, UnitKey>

export const Units = Object.fromEntries(
	UNIT_IDS.map(unit => [unit.key, unit.label])
) as Record<UnitKey, UnitName>

export const STRUCTURE_IDS = [
	{
		key: 0,
		label: 'radiant safelane tier 1 tower',
		extId: 'npc_dota_goodguys_tower1_bot'
	},
	{
		key: 1,
		label: 'radiant safelane tier 2 tower',
		extId: 'npc_dota_goodguys_tower2_bot'
	},
	{
		key: 2,
		label: 'radiant safelane tier 3 tower',
		extId: 'npc_dota_goodguys_tower3_bot'
	},
	{
		key: 3,
		label: 'radiant safelane melee barracks',
		extId: 'npc_dota_goodguys_melee_rax_bot'
	},
	{
		key: 4,
		label: 'radiant safelane range barracks',
		extId: 'npc_dota_goodguys_range_rax_bot'
	},
	{
		key: 5,
		label: 'radiant midlane tier 1 tower',
		extId: 'npc_dota_goodguys_tower1_mid'
	},
	{
		key: 6,
		label: 'radiant midlane tier 2 tower',
		extId: 'npc_dota_goodguys_tower2_mid'
	},
	{
		key: 7,
		label: 'radiant midlane tier 3 tower',
		extId: 'npc_dota_goodguys_tower3_mid'
	},
	{
		key: 8,
		label: 'radiant midlane melee barracks',
		extId: 'npc_dota_goodguys_melee_rax_mid'
	},
	{
		key: 9,
		label: 'radiant midlane range barracks',
		extId: 'npc_dota_goodguys_range_rax_mid'
	},
		{
		key: 10,
		label: 'radiant offlane tier 1 tower',
		extId: 'npc_dota_goodguys_tower1_top'
	},
	{
		key: 11,
		label: 'radiant offlane tier 2 tower',
		extId: 'npc_dota_goodguys_tower2_top'
	},
	{
		key: 12,
		label: 'radiant offlane tier 3 tower',
		extId: 'npc_dota_goodguys_tower3_top'
	},
	{
		key: 13,
		label: 'radiant offlane melee barracks',
		extId: 'npc_dota_goodguys_melee_rax_top'
	},
	{
		key: 14,
		label: 'radiant offlane range barracks',
		extId: 'npc_dota_goodguys_range_rax_top'
	},
	{
		key: 15,
		label: 'radiant tier 4 tower',
		extId: 'npc_dota_goodguys_tower4'
	},
	{
		key: 16,
		label: 'radiant ancient',
		extId: 'npc_dota_goodguys_fort'
	},
	{
		key: 17,
		label: 'dire safelane tier 1 tower',
		extId: 'npc_dota_badguys_tower1_top'
	},
	{
		key: 18,
		label: 'dire safelane tier 2 tower',
		extId: 'npc_dota_badguys_tower2_top'
	},
	{
		key: 19,
		label: 'dire safelane tier 3 tower',
		extId: 'npc_dota_badguys_tower3_top'
	},
	{
		key: 20,
		label: 'dire safelane melee barracks',
		extId: 'npc_dota_badguys_melee_rax_top'
	},
	{
		key: 21,
		label: 'dire safelane range barracks',
		extId: 'npc_dota_badguys_range_rax_top'
	},
	{
		key: 22,
		label: 'dire midlane tier 1 tower',
		extId: 'npc_dota_badguys_tower1_mid'
	},
	{
		key: 23,
		label: 'dire midlane tier 2 tower',
		extId: 'npc_dota_badguys_tower2_mid'
	},
	{
		key: 24,
		label: 'dire midlane tier 3 tower',
		extId: 'npc_dota_badguys_tower3_mid'
	},
	{
		key: 25,
		label: 'dire midlane melee barracks',
		extId: 'npc_dota_badguys_melee_rax_mid'
	},
	{
		key: 26,
		label: 'dire midlane range barracks',
		extId: 'npc_dota_badguys_range_rax_mid'
	},
	{
		key: 27,
		label: 'dire offlane tier 1 tower',
		extId: 'npc_dota_badguys_tower1_bot'
	},
	{
		key: 28,
		label: 'dire offlane tier 2 tower',
		extId: 'npc_dota_badguys_tower2_bot'
	},
	{
		key: 29,
		label: 'dire offlane tier 3 tower',
		extId: 'npc_dota_badguys_tower3_bot'
	},
	{
		key: 30,
		label: 'dire offlane melee barracks',
		extId: 'npc_dota_badguys_melee_rax_bot'
	},
	{
		key: 31,
		label: 'dire offlane range barracks',
		extId: 'npc_dota_badguys_range_rax_bot'
	},
	{
		key: 32,
		label: 'dire tier 4 tower',
		extId: 'npc_dota_badguys_tower4'
	},
	{
		key: 33,
		label: 'dire ancient',
		extId: 'npc_dota_badguys_fort'
	},
] as const satisfies IdBinding<string>[]

export type StructureKey = typeof STRUCTURE_IDS[number]['key']
export type StructureName = typeof STRUCTURE_IDS[number]['label']
export type StructureExtId = typeof STRUCTURE_IDS[number]['extId']

export const StructureKeysByExtId = Object.fromEntries(
	STRUCTURE_IDS.map(structure => [structure.extId, structure.key])
) as Record<StructureExtId, StructureKey>

export const Structures = Object.fromEntries(
	STRUCTURE_IDS.map(structure => [structure.key, structure.label])
) as Record<StructureKey, StructureName>
