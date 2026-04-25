import { type ISO8601TimeString, type Unique } from "./flow.js";
import type { DotaConstantsHero, GameModeId, LobbyTypeId, PatchId, RegionId, UnitOrderId } from "./types/DotaConstantsTypes.js";
import { type AccountId, type Cosmetic, type Distributions, type LeagueId, type LeaverStatus, type MatchForPlayer, type MatchId, type OdotaParsedPlayer, type ParsedMatch, type PartyId, type Pause, type Percentile, type PickBan, type PlayerSlot, type RankBitmask, type SeriesId, type UnparsedMatch } from "./types/OpenDotaTypes.js";
declare const heroIds: IdBinding<number>[];
export type HeroKey = typeof heroIds[number]['key'];
export type HeroLabel = typeof heroIds[number]['label'];
declare const abilityIds: IdBinding<number>[];
export type AbilityKey = typeof abilityIds[number]['key'];
export type AbilityLabel = typeof abilityIds[number]['label'];
export declare const abilityNames: Record<AbilityKey, AbilityLabel>;
declare const itemIds: IdBinding<number>[];
export type ItemKey = typeof itemIds[number]['key'];
export type ItemLabel = typeof itemIds[number]['label'];
declare const SIDE: [{
    readonly key: 0;
    readonly label: "radiant";
    readonly extId: 0;
}, {
    readonly key: 1;
    readonly label: "dire";
    readonly extId: 1;
}];
type SideKey = typeof SIDE[number]['key'];
type SideLabel = typeof SIDE[number]['label'];
export declare const sideNames: Record<SideKey, SideLabel>;
export type Outcome = 'win' | 'loss';
export type PermanentBuffId = Unique<number, 'permanentBuff'>;
interface Id {
    key: number;
    label: string;
}
export interface IdBinding<T> extends Id {
    extId: T;
}
export declare const LANES: [{
    readonly key: 0;
    readonly label: "safelane";
    readonly extId: 1;
}, {
    readonly key: 1;
    readonly label: "midlane";
    readonly extId: 2;
}, {
    readonly key: 2;
    readonly label: "offlane";
    readonly extId: 3;
}, {
    readonly key: 3;
    readonly label: "radiant jungle";
    readonly extId: 4;
}, {
    readonly key: 4;
    readonly label: "dire junle";
    readonly extId: 5;
}];
export type LaneKey = typeof LANES[number]['key'];
export type LaneLabel = typeof LANES[number]['label'];
export type LaneExtId = typeof LANES[number]['extId'];
export declare const LaneKeyByExtId: Record<LaneExtId, LaneKey>;
export declare const Lanes: Record<LaneKey, LaneLabel>;
export declare const ROLE: readonly ["carry", "midlaner", "offlaner", "soft support", "hard support"];
export type Role = Unique<typeof ROLE[number], 'role'>;
export type DraftAction = 'pick' | 'ban';
export declare const STRUCTURE_FLAGS: {
    readonly SAFE: {
        readonly T1: 1;
        readonly T2: number;
        readonly T3: number;
        readonly MELEE_BARRACKS: number;
        readonly RANGE_BARRACKS: number;
    };
    readonly MID: {
        readonly T1: number;
        readonly T2: number;
        readonly T3: number;
        readonly MELEE_BARRACKS: number;
        readonly RANGE_BARRACKS: number;
    };
    readonly OFF: {
        readonly T1: number;
        readonly T2: number;
        readonly T3: number;
        readonly MELEE_BARRACKS: number;
        readonly RANGE_BARRACKS: number;
    };
    readonly T4: {
        readonly SAFE: number;
        readonly OFF: number;
    };
    readonly ANCIENT: number;
};
export type StructureFlag = typeof STRUCTURE_FLAGS[keyof typeof STRUCTURE_FLAGS];
export type StructuresBitmask = Unique<number, 'structuresBitmask'>;
export declare function structureSurvived(structures: StructuresBitmask, mask: StructureFlag): boolean;
interface Hero {
    id: HeroKey;
    name: {
        static: string;
        localized: string;
    };
    roles: string[];
    baseHealth: Resource;
    baseMana: Resource;
    baseArmor: number;
    baseMagicResist: number;
    baseAttack: Attack;
    attributes: {
        primary: Attribute;
        base: AttributeSet;
        gain: AttributeSet;
    };
    movement: Movement;
    vision: Vision;
    legs: number;
    isInCaptainsMode: boolean;
}
interface Resource {
    size: number;
    regen: number;
}
type Attribute = typeof ATTRIBUTES[keyof typeof ATTRIBUTES];
declare const ATTRIBUTES: {
    readonly STRENGTH: "str";
    readonly AGILITY: "agi";
    readonly INTELLIGENCE: "int";
    readonly UNIVERSAL: "all";
};
interface AttributeSet {
    strength: number;
    agility: number;
    intelligence: number;
}
interface Range {
    min: number;
    max: number;
}
interface Attack {
    damage: Range;
    speed: number;
    rate: number;
    point: number;
    range: number;
    projectile_speed: number;
}
interface Movement {
    speed: number;
    turnRate: number | null;
}
interface Vision {
    day: number;
    night: number;
}
export declare function formatHero(rawHero: DotaConstantsHero): Hero;
export interface RankStats {
    rank: RankBitmask;
    count: number;
}
export interface RankDistribution {
    ranks: RankStats[];
    timestamp: ISO8601TimeString;
}
export declare function formatRankDistribution(distributions: Distributions): RankDistribution;
export interface Benchmark {
    timestamp: ISO8601TimeString;
    hero: HeroKey;
    gpm: Percentile[];
    xpm: Percentile[];
    kpm: Percentile[];
    lhpm: Percentile[];
    dmgpm: Percentile[];
    healpm: Percentile[];
    towerDmg: Percentile[];
}
export interface Performance {
    gpm: Percentile;
    xpm: Percentile;
    kpm: Percentile;
    lhpm: Percentile;
    dmgpm: Percentile;
    healpm: Percentile;
    towerDmg: Percentile;
}
export interface MatchBase {
    fetchTime: ISO8601TimeString;
    id: MatchId;
    startTime?: ISO8601TimeString;
    lengthSeconds: number;
    winningTeam: SideKey;
    gameMode: GameModeId;
    lobbyType: LobbyTypeId;
    parseVersion: number | null;
}
export interface PlayerMatchSummary {
    match: MatchBase;
    player: {
        id: AccountId;
        slot?: PlayerSlot;
        leaverStatus: LeaverStatus;
        partySize?: number;
    };
    hero: {
        id: HeroKey;
        facet?: number;
        kda: {
            kills: number;
            deaths: number;
            assists: number;
        };
    };
}
export declare function formatMatchSummary(summary: MatchForPlayer, player: AccountId): PlayerMatchSummary;
export interface SparseMatch extends MatchBase {
    meta: {
        matchSeqNum: number;
        series: {
            id: SeriesId;
            type: number;
        };
        leagueId: LeagueId;
        league?: object;
        patch: PatchId;
        region: RegionId;
        cluster: number;
        replay: {
            url: URL;
            salt: number;
        };
        odota: OpenDotaMetadata;
    };
    radiant: {
        structuresLeft: StructuresBitmask;
        kills: number;
    };
    dire: {
        structuresLeft: StructuresBitmask;
        kills: number;
    };
    draft: DraftStep[];
    players: SparsePlayer[];
    firstBloodSeconds: number;
    humanPlayerCount: number;
    preGameLengthSeconds: number;
}
export declare function formatSparseMatch(match: UnparsedMatch): SparseMatch;
export interface FullMatch extends SparseMatch {
    players: ParsedPlayer[];
    teamfights?: Teamfight[];
    pauses?: Pause[];
    objectives?: NormalizedObjective[];
    chat?: ChatMsg[];
    allChatWordCounts?: {
        total: object;
        player: object;
    };
    radiantAdv: {
        gold: number[];
        xp: number[];
    };
    cosmetics?: object;
    draft: DraftStep[] | CaptainsModeDraftStep[];
}
export declare function formatFullMatch(match: ParsedMatch): FullMatch;
export interface Teamfight {
    startSeconds: number;
    endSeconds: number;
    finalDeathSeconds: number;
    deathCount: number;
    player: TeamfightPlayerData[];
}
export interface TeamfightPlayerData {
    deathPositionsByWhen: Record<number, {
        x: number;
        y: number;
    }>;
    abilityUses: Record<AbilityKey, number>;
    abilityTargets?: Record<AbilityKey, Record<HeroKey, number>>;
    itemUses: Record<ItemKey, number>;
    killed: Record<HeroKey, number>;
    deathCount: number;
    buybacks?: number;
    damage: number;
    healing: number;
    goldDiff: number;
    xpDiff: number;
    xpStart: number;
}
export declare const OBJECTIVES: {
    readonly FIRST_BLOOD: "first blood";
    readonly COURIER: "courier";
    readonly BUILDING: "building";
    readonly TORMENTOR: "tormentor";
    readonly ROSHAN: "roshan";
    readonly AEGIS: "aegis";
};
export type Objective = typeof OBJECTIVES[keyof typeof OBJECTIVES];
export interface NormalizedObjective {
    whenSeconds: number;
    what: Objective;
    who: HeroKey | UnitKey;
    target?: HeroKey | StructureKey;
    value?: number;
}
export interface ChatMsg {
    whenSeconds: number;
    type: string;
    value: string;
    playerSlot: PlayerSlot;
}
export interface NeutralToken {
    token: ItemKey;
    receivedSeconds: number;
}
export interface OpenDotaMetadata {
    engine: number;
    parseVersion: number | null;
    api: boolean;
    gcData: boolean;
    archived: boolean;
    flags: number;
    metadata: any;
}
export interface SparsePlayer {
    account: {
        id: AccountId;
        personaName?: string;
        name?: string;
        rank?: RankBitmask;
        mmrGuess?: number;
        oDota: {
            subscriber: boolean;
            contributor: boolean;
        };
    };
    slot?: PlayerSlot;
    partyId?: PartyId;
    left: LeaverStatus;
    performance: Performance;
    kda: {
        kills: number;
        deaths: number;
        assists: number;
        ratio: number;
    };
    cs: {
        lastHits: number;
        denies: number;
    };
    gold: {
        total: number;
        spent: number;
        remaining: number;
    };
    hero: {
        id: HeroKey;
        lvl: number;
        abilityUpgrades: AbilityKey[];
        permanentBuffs: PermanentBuff[];
        netWorth: number;
        inventory: ItemKey[];
        neutralItem: {
            artifact: ItemKey;
            enchantment: ItemKey;
        };
    };
    damage: {
        toHeroes: number;
        toBuildings: number;
    };
    healing: {
        amt: number;
    };
}
export interface ParsedPlayer extends SparsePlayer {
    stacked: {
        creeps: number;
        camps: number;
    };
    laning: {
        lane: LaneKey;
        efficiencyRate: number;
        weightedPosCoords: Record<number, Record<number, number>>;
        roamed?: boolean;
        kills: number;
    };
    randomed: boolean;
    predictedWin: boolean;
    gotFirstBlood: boolean;
    teamfightParticipationRate: number;
    wasStunnedSeconds: number;
    xpSources: Record<XpSourceKey, number>;
    goldSources: Record<GoldSourceKey, number>;
    damage: {
        toHeroes: number;
        toBuildings: number;
        dealt: {
            to: Record<string, number>;
            by: Record<string, number>;
            targetsBySource: Record<string, Record<HeroKey, number>>;
        };
        received: {
            from: Record<string, number>;
            by: Record<string, number>;
        };
        hitCount: Record<HeroKey, number>;
        hardestHit: HardestHitDealt;
    };
    healing: {
        amt: number;
        bySource: Record<string, number>;
    };
    lifeState: Record<LifeStateKey, number>;
    abilities: {
        uses: Record<AbilityKey, number>;
        targets: Record<AbilityKey, Record<HeroKey, number>>;
    };
    items: {
        uses: Record<ItemKey, number>;
        purchases: Array<{
            whenSeconds: number;
            item: ItemKey;
        }>;
    };
    timings: MatchTimings;
    logs: {
        observers: WardLogEntry[];
        sentries: WardLogEntry[];
        kills: Array<{
            whenSeconds: number;
            who: HeroKey;
        }>;
        buybackTimestamps: number[];
        runes: Array<{
            whenSeconds: number;
            rune: RuneKey;
        }>;
        neutralItems: NeutralItem[];
        neutralTokensLog?: Array<{
            receivedSeconds: number;
            item: ItemKey;
        }>;
        connection: Array<{
            whenSeconds: number;
            event: string;
        }>;
    };
    killed: Record<string, number>;
    killedBy: Record<string, number>;
    killstreak: Record<number, number>;
    multikills: Record<number, number>;
    actions: Record<UnitOrderId, number>;
    apm: number;
    pingCount: number;
    cosmetics?: Cosmetic[];
    additionalUnits?: object[];
}
export declare function formatFullInGamePlayer(player: OdotaParsedPlayer): ParsedPlayer;
export interface NeutralItem {
    craftedSeconds: number;
    artifact: ItemKey;
    enchantment: ItemKey;
}
export interface WardLogEntry {
    placedSeconds: number;
    leftSeconds: number | null;
    killer?: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
}
export interface HardestHitDealt {
    whenSeconds: number;
    unit?: string;
    who: HeroKey;
    what: string;
    amount: number;
}
export interface MatchTimings {
    timedSeconds: number[];
    goldValues: number[];
    xpValues: number[];
    lastHits: number[];
    denies: number[];
}
export interface PermanentBuff {
    id: PermanentBuffId;
    stackCount: number;
    receivedSeconds: number;
}
export interface DmgBreakdown {
    distribution: object;
    sources: object;
}
export interface MinMax {
    min: number;
    max: number;
}
export interface DraftStep {
    order: number;
    action: DraftAction;
    team: SideKey;
    hero: HeroKey;
}
export declare function parsePickBan(pickBan: PickBan): DraftStep;
export interface CaptainsModeDraftStep extends DraftStep {
    time: {
        extra: number;
        total: number;
    };
}
export declare const RUNES: readonly [{
    readonly key: 0;
    readonly label: "bounty";
    readonly extId: 5;
}, {
    readonly key: 1;
    readonly label: "wisdom";
    readonly extId: 8;
}, {
    readonly key: 2;
    readonly label: "water";
    readonly extId: 7;
}, {
    readonly key: 3;
    readonly label: "invisibility";
    readonly extId: 3;
}, {
    readonly key: 4;
    readonly label: "regeneration";
    readonly extId: 4;
}, {
    readonly key: 5;
    readonly label: "amplify damage";
    readonly extId: 0;
}, {
    readonly key: 6;
    readonly label: "arcane";
    readonly extId: 6;
}, {
    readonly key: 7;
    readonly label: "haste";
    readonly extId: 1;
}, {
    readonly key: 8;
    readonly label: "illusion";
    readonly extId: 2;
}, {
    readonly key: 9;
    readonly label: "shield";
    readonly extId: 9;
}];
export type RuneKey = typeof RUNES[number]['key'];
export type RuneLabel = typeof RUNES[number]['label'];
export type RuneExtId = typeof RUNES[number]['extId'];
export declare const RuneKeysByExtId: Record<RuneExtId, RuneKey>;
export declare const Runes: Record<RuneKey, RuneLabel>;
export declare const GOLD_SOURCES: readonly [{
    readonly key: 0;
    readonly label: "other";
    readonly extId: 0;
}, {
    readonly key: 1;
    readonly label: "deaths";
    readonly extId: 1;
}, {
    readonly key: 6;
    readonly label: "unknown6";
    readonly extId: 6;
}, {
    readonly key: 11;
    readonly label: "buildings";
    readonly extId: 11;
}, {
    readonly key: 12;
    readonly label: "heroes";
    readonly extId: 12;
}, {
    readonly key: 13;
    readonly label: "lane creeps";
    readonly extId: 13;
}, {
    readonly key: 14;
    readonly label: "neutral creeps";
    readonly extId: 14;
}, {
    readonly key: 16;
    readonly label: "first blood";
    readonly extId: 16;
}, {
    readonly key: 17;
    readonly label: "bounty runes";
    readonly extId: 17;
}, {
    readonly key: 19;
    readonly label: "unknown19";
    readonly extId: 19;
}, {
    readonly key: 20;
    readonly label: "wards";
    readonly extId: 20;
}, {
    readonly key: 21;
    readonly label: "unknown21 (value 135)";
    readonly extId: 21;
}];
export type GoldSourceKey = typeof GOLD_SOURCES[number]['key'];
export type GoldSourceLabel = typeof GOLD_SOURCES[number]['label'];
export type GoldSourceExtId = typeof GOLD_SOURCES[number]['extId'];
export declare const GoldSrcKeysByExtId: Record<GoldSourceExtId, GoldSourceKey>;
export declare const GoldSources: Record<GoldSourceKey, GoldSourceLabel>;
export declare const XP_SOURCES: readonly [{
    readonly key: 0;
    readonly label: "other";
    readonly extId: 0;
}, {
    readonly key: 1;
    readonly label: "heroes";
    readonly extId: 1;
}, {
    readonly key: 2;
    readonly label: "creeps";
    readonly extId: 2;
}, {
    readonly key: 4;
    readonly label: "unknown4";
    readonly extId: 4;
}];
export type XpSourceKey = typeof XP_SOURCES[number]['key'];
export type XpSourceLabel = typeof XP_SOURCES[number]['label'];
export type XpSourceExtId = typeof XP_SOURCES[number]['extId'];
export declare const XpSourceKeyByExtId: Record<XpSourceExtId, XpSourceKey>;
export declare const XpSources: Record<XpSourceKey, XpSourceLabel>;
export declare const LIFE_STATES: readonly [{
    readonly key: 0;
    readonly label: "alive";
    readonly extId: 0;
}, {
    readonly key: 1;
    readonly label: "unknown (pseudo-death?)";
    readonly extId: 1;
}, {
    readonly key: 2;
    readonly label: "dead";
    readonly extId: 2;
}];
export type LifeStateKey = typeof LIFE_STATES[number]['key'];
export type LifeStateLabel = typeof LIFE_STATES[number]['label'];
export type LifeStateExtId = typeof LIFE_STATES[number]['extId'];
export declare const LifeStateKeysByExtId: Record<LifeStateExtId, LifeStateKey>;
export declare const LifeStates: Record<LifeStateKey, LifeStateLabel>;
export declare function getSecondsDead(lifeState: Record<LifeStateKey, number>): number;
export declare const UNIT_IDS: [{
    readonly key: 0;
    readonly label: "radiant melee creep";
    readonly extId: "npc_dota_creep_goodguys_melee";
}, {
    readonly key: 1;
    readonly label: "radiant ranged creep";
    readonly extId: "npc_dota_creep_goodguys_ranged";
}, {
    readonly key: 2;
    readonly label: "radiant siege creep";
    readonly extId: "npc_dota_goodguys_siege";
}, {
    readonly key: 3;
    readonly label: "dire melee creep";
    readonly extId: "npc_dota_creep_badguys_melee";
}, {
    readonly key: 4;
    readonly label: "dire ranged creep";
    readonly extId: "npc_dota_creep_badguys_ranged";
}, {
    readonly key: 5;
    readonly label: "dire siege creep";
    readonly extId: "npc_dota_badguys_siege";
}];
export type UnitKey = typeof UNIT_IDS[number]['key'];
export type UnitName = typeof UNIT_IDS[number]['label'];
export type UnitExtId = typeof UNIT_IDS[number]['extId'];
export declare const UnitKeysByExtId: Record<UnitExtId, UnitKey>;
export declare const Units: Record<UnitKey, UnitName>;
export declare const STRUCTURE_IDS: [{
    readonly key: 0;
    readonly label: "radiant safelane tier 1 tower";
    readonly extId: "npc_dota_goodguys_tower1_bot";
}, {
    readonly key: 1;
    readonly label: "radiant safelane tier 2 tower";
    readonly extId: "npc_dota_goodguys_tower2_bot";
}, {
    readonly key: 2;
    readonly label: "radiant safelane tier 3 tower";
    readonly extId: "npc_dota_goodguys_tower3_bot";
}, {
    readonly key: 3;
    readonly label: "radiant safelane melee barracks";
    readonly extId: "npc_dota_goodguys_melee_rax_bot";
}, {
    readonly key: 4;
    readonly label: "radiant safelane range barracks";
    readonly extId: "npc_dota_goodguys_range_rax_bot";
}, {
    readonly key: 5;
    readonly label: "radiant midlane tier 1 tower";
    readonly extId: "npc_dota_goodguys_tower1_mid";
}, {
    readonly key: 6;
    readonly label: "radiant midlane tier 2 tower";
    readonly extId: "npc_dota_goodguys_tower2_mid";
}, {
    readonly key: 7;
    readonly label: "radiant midlane tier 3 tower";
    readonly extId: "npc_dota_goodguys_tower3_mid";
}, {
    readonly key: 8;
    readonly label: "radiant midlane melee barracks";
    readonly extId: "npc_dota_goodguys_melee_rax_mid";
}, {
    readonly key: 9;
    readonly label: "radiant midlane range barracks";
    readonly extId: "npc_dota_goodguys_range_rax_mid";
}, {
    readonly key: 10;
    readonly label: "radiant offlane tier 1 tower";
    readonly extId: "npc_dota_goodguys_tower1_top";
}, {
    readonly key: 11;
    readonly label: "radiant offlane tier 2 tower";
    readonly extId: "npc_dota_goodguys_tower2_top";
}, {
    readonly key: 12;
    readonly label: "radiant offlane tier 3 tower";
    readonly extId: "npc_dota_goodguys_tower3_top";
}, {
    readonly key: 13;
    readonly label: "radiant offlane melee barracks";
    readonly extId: "npc_dota_goodguys_melee_rax_top";
}, {
    readonly key: 14;
    readonly label: "radiant offlane range barracks";
    readonly extId: "npc_dota_goodguys_range_rax_top";
}, {
    readonly key: 15;
    readonly label: "radiant tier 4 tower";
    readonly extId: "npc_dota_goodguys_tower4";
}, {
    readonly key: 16;
    readonly label: "radiant ancient";
    readonly extId: "npc_dota_goodguys_fort";
}, {
    readonly key: 17;
    readonly label: "dire safelane tier 1 tower";
    readonly extId: "npc_dota_badguys_tower1_top";
}, {
    readonly key: 18;
    readonly label: "dire safelane tier 2 tower";
    readonly extId: "npc_dota_badguys_tower2_top";
}, {
    readonly key: 19;
    readonly label: "dire safelane tier 3 tower";
    readonly extId: "npc_dota_badguys_tower3_top";
}, {
    readonly key: 20;
    readonly label: "dire safelane melee barracks";
    readonly extId: "npc_dota_badguys_melee_rax_top";
}, {
    readonly key: 21;
    readonly label: "dire safelane range barracks";
    readonly extId: "npc_dota_badguys_range_rax_top";
}, {
    readonly key: 22;
    readonly label: "dire midlane tier 1 tower";
    readonly extId: "npc_dota_badguys_tower1_mid";
}, {
    readonly key: 23;
    readonly label: "dire midlane tier 2 tower";
    readonly extId: "npc_dota_badguys_tower2_mid";
}, {
    readonly key: 24;
    readonly label: "dire midlane tier 3 tower";
    readonly extId: "npc_dota_badguys_tower3_mid";
}, {
    readonly key: 25;
    readonly label: "dire midlane melee barracks";
    readonly extId: "npc_dota_badguys_melee_rax_mid";
}, {
    readonly key: 26;
    readonly label: "dire midlane range barracks";
    readonly extId: "npc_dota_badguys_range_rax_mid";
}, {
    readonly key: 27;
    readonly label: "dire offlane tier 1 tower";
    readonly extId: "npc_dota_badguys_tower1_bot";
}, {
    readonly key: 28;
    readonly label: "dire offlane tier 2 tower";
    readonly extId: "npc_dota_badguys_tower2_bot";
}, {
    readonly key: 29;
    readonly label: "dire offlane tier 3 tower";
    readonly extId: "npc_dota_badguys_tower3_bot";
}, {
    readonly key: 30;
    readonly label: "dire offlane melee barracks";
    readonly extId: "npc_dota_badguys_melee_rax_bot";
}, {
    readonly key: 31;
    readonly label: "dire offlane range barracks";
    readonly extId: "npc_dota_badguys_range_rax_bot";
}, {
    readonly key: 32;
    readonly label: "dire tier 4 tower";
    readonly extId: "npc_dota_badguys_tower4";
}, {
    readonly key: 33;
    readonly label: "dire ancient";
    readonly extId: "npc_dota_badguys_fort";
}];
export type StructureKey = typeof STRUCTURE_IDS[number]['key'];
export type StructureName = typeof STRUCTURE_IDS[number]['label'];
export type StructureExtId = typeof STRUCTURE_IDS[number]['extId'];
export declare const StructureKeysByExtId: Record<StructureExtId, StructureKey>;
export declare const Structures: Record<StructureKey, StructureName>;
export {};
//# sourceMappingURL=bindings.d.ts.map