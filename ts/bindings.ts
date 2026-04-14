export interface Hero {
	id: number,
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

export enum Attribute {
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
