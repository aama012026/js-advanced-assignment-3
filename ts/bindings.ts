import type { ISO8601TimeString, UnixTimestamp } from "./flow.js"
import type { DotaConstantsHero, HeroId, LobbyTypeId, PatchId, RegionId } from "./types/DotaConstantsTypes.js"
import type { AccountId, BarracksBitmask, ChatMsg, Distributions, DraftTiming, LeagueId, MatchId, Pause, Percentile, PlayerSlot, SeriesId, Timing, TowersBitmask } from "./types/OpenDotaTypes.js"

export type Side = 'radiant' | 'dire'
export type Outcome = 'win' | 'loss'
export type DraftAction = 'pick' | 'ban'
export const STRUCTURE_FLAG = {
	SAFE: {
		T1: 1,
		T2: 1 << 1,
		T3: 1 << 2,
		MELEE_BARRACKS: 1 << 3,
		RANGED_BARRACKS: 1 << 4
	} as const,
	MID: {
		T1: 1 << 5,
		T2: 1 << 6,
		T3: 1 << 7,
		MELEE_BARRACKS: 1 << 8,
		RANGED_BARRACKS: 1 << 9
	} as const,
	OFF: {
		T1: 1 << 10,
		T2: 1 << 11,
		T3: 1 << 12,
		MELEE_BARRACKS: 1 << 13,
		RANGED_BARRACKS: 1 << 14,
	} as const,
	T4: {
		SAFE: 1 << 15,
		OFF: 1 << 16,
	} as const,
	ANCIENT: 1 << 17
} as const

// performs bitmasking to check if structure was standing at game end
export function structureSurvived(structures: number, mask: number): boolean {
	return (structures & mask) != 0
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

export const enum Attribute {
	Strength = 'str',
	Agility = 'agi',
	Intelligence = 'int',
	Universal = 'all'
}

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

export interface RankDistribution {
	ranks: RankStats[],
	timestamp: ISO8601TimeString
}

export interface RankStats {
	rank: RankId,
	count: number
}

export type RankId = number

export function formatRankDistribution(distributions: Distributions) {
	const ranks: RankStats[] = distributions.ranks.rows.map(rank => {
		return {rank: rank.bin, count: rank.count}
	});
	return {
		ranks: ranks,
		timestamp: new Date().toISOString()
	}
}

export interface Benchmark {
	timestamp: ISO8601TimeString,
	hero: HeroId,
	data: {
		gpm: Percentile[],
		xpm: Percentile[],
		kpm: Percentile[],
		lhpm: Percentile[],
		dmgpm: Percentile[],
		healpm: Percentile[],
		towerDmg: Percentile[]
	}
}

export interface Match {
	id: MatchId,
	radiant: {
		structuresLeft: BarracksBitmask,
		kills: number,
		team: object,
	}
	dire: {
		structuresLeft: BarracksBitmask,
		kills: number,
		team: object,
	}
	chat: ChatMsg[],
	cluster: number,
	cosmetics: object,
	lengthInSeconds: number,
	draft: DraftTiming[],
	oDotaMetadata: {
		engine: number,
		parseVersion: number,
		replaySalt: number
	}
	firstBlood: number,
	gameMode: number,
	humanPlayerCount: number,
	leagueId: LeagueId,
	lobbyType: LobbyTypeId,
	matchSeqNum: number,
	replay: {
		votes: {
			positive: number,
			negative: number
		}
		url: URL
	},
	objectives: object[],
	radiantAdv: {
		gold: number,
		xp: number
	}
	winningTeam: Side,
	start: UnixTimestamp,
	teamfights: object[] | null,
	series: {
		id: SeriesId,
		type: number
	},
	league: object,
	skillBracket: number | null,
	players: SparseInGamePlayer[],
	patch: PatchId,
	region: RegionId,
	allChatWordCounts: {
		total: object,
		player: object
	},
	goldLeadWinner: MinMax, // values can be negative, invert for loser
	pauses: Pause[]
}

export interface SparseInGamePlayer {
	accountId: AccountId,
	playerSlot: PlayerSlot | null,
	cs: Cs,
	kda: Kda,	
	abilities: {
		upgrades: number[],
		uses: object,
		targets: object,
	}
	damage: {
		dealt: DmgBreakdown,
		received: DmgBreakdown
	}
	inventory: number[], // 0-5 for main, 6-8 for backpack
	itemUses: object
	gold: {
		endAmt: number,
		gpm: number,
		reasons: [],
		spent: number,
		atTime: [],
	},
	hero: {
		id: HeroId,
		dmg: number,
		healing: number,
		hits: number
	}
	actions: object,
	additionalUnits: object[] | null,
	connectionLog: {time: number, event: string}[],
	stacked: {
		camps: number,
		creeps: number
	}
	lanePos: object,
	left: 'no' | 'safe' | 'abandon',
	lvl: number,
	lifeState: object,
	highestDmgInstance: object,
	multikills: object,
	warding: {
		obs: object,
		obsLeftLog: object,
	}
}

export interface Kda {
	kills: {
		count: number
		log: Timing[],
		killed: object,
		killstreak: object
	},
	deaths: {
		count: number,
		killedBy: object
	},
	assists: number
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
	time: {
		extra: number,
		total: number
	}
}