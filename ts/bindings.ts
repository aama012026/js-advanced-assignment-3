import type { DotaConstantsHero, HeroId } from "./types/DotaConstantsTypes.js"

export type Side = 'radiant' | 'dire'
export type Outcome = 'win' | 'loss'

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