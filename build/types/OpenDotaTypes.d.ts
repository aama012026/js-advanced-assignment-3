import type { ISO8601TimeString, Unique, UnixTimestamp } from "../modules/flow.js";
import type { AbilityId, GameModeId, HeroId, ItemId, LobbyTypeId, PatchId, RegionId, UnitOrderId } from "./DotaConstantsTypes.js";
export type MatchId = Unique<number, 'match'>;
export type SeriesId = Unique<number, 'series'>;
export type LeagueId = Unique<number, 'league'>;
export type AccountId = Unique<number, 'account'>;
export type SteamId = Unique<number, 'steam'>;
export type PartyId = Unique<number, 'party'>;
export type BarracksBitmask = Unique<number, 'barracksBitmask'>;
export type TowersBitmask = Unique<number, 'towersBitmask'>;
export type RankBitmask = Unique<number, 'rankBitmask'>;
export type GoldReasonId = Unique<number, 'goldReason'>;
export type XpReasonId = Unique<number, 'xpReason'>;
export type xPos = number;
export type yPos = number;
export interface Player {
    profile: Profile;
    rank_tier: RankBitmask | null;
    leaderboard_rank: number | null;
    computed_mmr?: number | null;
    computed_mmr_turbo?: number | null;
    aliases: SteamAlias[];
}
export interface SteamAlias {
    personaname: string;
    name_since: ISO8601TimeString;
}
export interface SearchResult {
    account_id: AccountId;
    avatarfull: string;
    personaname: string;
    last_match_time: string;
    similarity: number;
}
export interface PartialProfile {
    account_id: AccountId;
    personaname: string | null;
    name: string | null;
    is_contributor: boolean;
    is_subscriber: boolean;
}
export interface Profile extends PartialProfile {
    plus: boolean;
    cheese: number | null;
    steamId: SteamId | null;
    avatar: string | null;
    avatarmedium: string | null;
    avatarfull: string | null;
    profileurl: string | null;
    last_login: string | null;
    loccountrycode: string | null;
    status: unknown | null;
    fh_unavailable: boolean;
}
export interface PlayerMatchCount {
    win: number;
    lose: number;
}
export interface MatchSummary {
    match_id: MatchId;
    radiant_win: boolean | null;
    duration: number;
    game_mode: GameModeId;
    lobby_type: LobbyTypeId;
    start_time: UnixTimestamp | null;
    version: number | null;
    average_rank: RankBitmask | null;
    skill?: number | null;
}
export interface UnparsedMatch extends Omit<MatchSummary, 'average_rank'> {
    players: InGamePlayer[];
    series_id: SeriesId;
    series_type: number;
    cluster: number;
    replay_salt: number;
    pre_game_duration: number;
    match_seq_num: number;
    tower_status_radiant: TowersBitmask;
    tower_status_dire: TowersBitmask;
    barracks_status_radiant: BarracksBitmask;
    barracks_status_dire: BarracksBitmask;
    first_blood_time: number;
    human_players: number;
    leagueid: LeagueId;
    flags: number;
    engine: number;
    radiant_score: number;
    dire_score: number;
    pick_bans: PickBan[];
    od_data: OdotaData;
    metadata: any;
    replay_url: string;
    patch: PatchId;
    region: RegionId;
}
export interface ParsedMatch extends UnparsedMatch {
    players: OdotaParsedPlayer[];
    teamfights?: OdotaTeamfight[] | null;
    pauses?: Pause[];
    objectives?: Objective[];
    chat?: OdotaChatMsg[];
    radiant_gold_adv?: number[];
    radiant_xp_adv?: number[];
    cosmetics?: object;
    draft_timings?: DraftTiming[];
    all_word_counts?: object;
    my_word_counts?: object;
    comeback?: number;
    stomp?: number;
}
export interface OdotaTeamfight {
    start: number;
    end: number;
    last_death: number;
    deaths: number;
    players: TeamfightPlayer[];
}
export interface TeamfightPlayer {
    deaths_pos: Record<number, Record<number, number>>;
    ability_uses: Record<string, number>;
    ability_targets: object | null;
    item_uses: Record<string, number>;
    killed: Record<string, number>;
    deaths: number;
    buybacks: number;
    damage: number;
    healing: number;
    gold_delta: number;
    xp_delta: number;
    xp_start: number;
    xp_end: number;
}
export interface Objective {
    time: number;
    type: string;
    key?: string;
    slot?: number;
    player_slot?: PlayerSlot;
    unit?: string;
    team?: number;
    value?: number;
    killer?: number;
}
export interface OdotaData {
    has_api: boolean;
    has_gcdata: boolean;
    has_parsed: boolean;
    has_archived: boolean;
}
export interface OdotaChatMsg {
    time: number;
    type: string;
    key: string;
    slot: number;
    player_slot: number;
}
export interface DraftTiming {
    order: number;
    pick: boolean;
    active_team: number;
    hero_id: HeroId;
    player_slot: PlayerSlot | null;
    extra_time: number;
    total_time_taken: number;
}
export interface PickBan {
    is_pick: boolean;
    hero_id: number;
    team: number;
    order: number;
}
export interface InGamePlayerSummary {
    player_slot: PlayerSlot | null;
    kills: number;
    deaths: number;
    assists: number;
    hero_id: HeroId;
    leaver_status: LeaverStatus;
    party_size: number | null;
    hero_variant?: number;
}
export type MatchForPlayer = MatchSummary & InGamePlayerSummary;
export interface InGamePlayer extends InGamePlayerSummary {
    account_id: AccountId;
    party_id: number | null;
    team_number: number;
    team_slot: number;
    permanent_buffs: OdotaPermanentBuff[];
    item_0: ItemId;
    item_1: ItemId;
    item_2: ItemId;
    item_3: ItemId;
    item_4: ItemId;
    item_5: ItemId;
    backpack_0: ItemId;
    backpack_1: ItemId;
    backpack_2: ItemId;
    item_neutral: ItemId;
    item_neutral2: ItemId;
    last_hits: number;
    denies: number;
    gold_per_min: number;
    xp_per_min: number;
    level: number;
    net_worth: number;
    aghanims_scepter: number;
    aghanims_shard: number;
    moonshard: number;
    hero_damage: number;
    tower_damage: number;
    hero_healing: number;
    gold: number;
    gold_spent: number;
    ability_upgrades_arr: AbilityId[];
    personaname: string | null;
    name: string | null;
    last_login: string | null;
    rank_tier: RankBitmask | null;
    computed_mmr: number | null;
    is_subscriber: boolean;
    radiant_win: boolean | null;
    start_time: UnixTimestamp;
    duration: number;
    cluster: number;
    lobby_type: number;
    game_mode: number;
    is_contributor: boolean;
    patch: number;
    region: number;
    isRadiant: boolean;
    win: number;
    lose: number;
    total_gold: number;
    total_xp: number;
    kills_per_min: number;
    kda: number;
    abandons: number;
    benchmarks: PlayerHeroPerformance;
}
export interface OdotaParsedPlayer extends InGamePlayer {
    obs_placed: number;
    sen_placed: number;
    creeps_stacked: number;
    camps_stacked: number;
    rune_pickups: number;
    firstblood_claimed: number;
    teamfight_participation: number;
    towers_killed: number;
    roshans_killed: number;
    observers_placed: number;
    stuns: number;
    max_hero_hit: OdotaHardestHitDealt;
    times: number[];
    gold_t: number[];
    lh_t: number[];
    dn_t: number[];
    xp_t: number[];
    obs_log: OdotaWardLogEntry[];
    obs_left_log: OdotaWardLogEntry[];
    sen_log: OdotaWardLogEntry[];
    sen_left_log: OdotaWardLogEntry[];
    purchase_log: OdotaPurchase[];
    kills_log: Timing[];
    buyback_log: Buyback[];
    runes_log: Timing[];
    connection_log: ConnectionEvent[];
    lane_pos: Record<xPos, Record<yPos, number>>;
    obs: Record<xPos, Record<yPos, number>>;
    sen: Record<xPos, Record<yPos, number>>;
    actions: Record<UnitOrderId, number>;
    pings: number;
    purchase: Record<string, number>;
    gold_reasons: Record<GoldReasonId, number>;
    xp_reasons: Record<XpReasonId, number>;
    killed: Record<string, number>;
    item_uses: Record<string, number>;
    ability_uses: Record<string, number>;
    ability_targets: Record<string, Record<string, number>>;
    damage_targets: Record<string, Record<string, number>>;
    hero_hits: Record<string, number>;
    damage: Record<string, number>;
    damage_taken: Record<string, number>;
    damage_inflictor: Record<string, number>;
    damage_inflictor_received: Record<string, number>;
    runes: Record<number, number>;
    killed_by: Record<string, number>;
    kill_streaks: Record<number, number>;
    multi_kills: Record<number, number>;
    life_state: Record<number, number>;
    healing: Record<string, number>;
    randomed: boolean;
    pred_vict: boolean;
    neutral_tokens_log: Timing[];
    neutral_item_history: NeutralItemCrafted[];
    neutral_kills: number;
    tower_kills: number;
    courier_kills: number;
    lane_kills: number;
    hero_kills: number;
    observer_kills: number;
    sentry_kills: number;
    roshan_kills: number;
    necronomicon_kills: number;
    ancient_kills: number;
    buyback_count: number;
    observer_uses: number;
    sentry_uses: number;
    lane_efficiency: number;
    lane_efficiency_pct: number;
    lane: number | null;
    lane_role: number | null;
    is_roaming: boolean | null;
    purchase_time: Record<string, number>;
    first_purchase_time: Record<string, number>;
    item_win: Record<string, number>;
    item_usage: Record<string, number>;
    purchase_tpscroll: number;
    actions_per_min: number;
    life_state_dead: number;
    cosmetics: Cosmetic[];
    additional_units?: object[] | null;
}
export interface OdotaPermanentBuff {
    permanent_buff: number;
    stack_count: number;
    grant_time: number;
}
export interface Percentile {
    percentile: number;
    value: number | null;
}
export interface HeroBenchmark {
    hero_id: HeroId;
    result: {
        gold_per_min: Percentile[];
        xp_per_min: Percentile[];
        kills_per_min: Percentile[];
        last_hits_per_min: Percentile[];
        hero_damage_per_min: Percentile[];
        hero_healing_per_min: Percentile[];
        tower_damage: Percentile[];
    };
}
export interface BenchmarkPerformance {
    raw: number;
    pct: number;
}
export interface PlayerHeroPerformance {
    gold_per_min: BenchmarkPerformance;
    xp_per_min: BenchmarkPerformance;
    kills_per_min: BenchmarkPerformance;
    last_hits_per_min: BenchmarkPerformance;
    hero_damage_per_min: BenchmarkPerformance;
    hero_healing_per_min: BenchmarkPerformance;
    tower_damage: BenchmarkPerformance;
}
export interface OdotaHardestHitDealt {
    time: number;
    type: string;
    unit: string;
    key: string;
    value: number;
    slot: number;
    player_slot: PlayerSlot;
    inflictor: string;
    max: boolean;
}
export interface OdotaWardLogEntry {
    time: number;
    type: string;
    key: string;
    slot: number;
    player_slot: PlayerSlot;
    attackername?: string;
    x: number;
    y: number;
    z: number;
    entityleft: boolean;
    ehandle: number;
}
export interface Buyback {
    time: number;
    slot: number;
    player_slot: PlayerSlot;
}
export interface ConnectionEvent {
    time: number;
    event: string;
    player_slot: PlayerSlot | null;
}
export interface Timing {
    time: number;
    key: string;
}
export interface OdotaPurchase {
    time: number;
    key: string;
    charges: number;
}
export interface Cosmetic {
    item_id: number;
    name: string | null;
    prefab: string;
    creation_date: string | null;
    image_inventory: string | null;
    image_path: string | null;
    item_description: string | null;
    item_name: string;
    item_rarity: string | null;
    item_type_name: string | null;
    used_by_heroes: string | null;
}
export interface NeutralItemCrafted {
    item_neutral: string;
    time: number;
    item_neutral_enhancement: string;
}
export interface Pause {
    time: number;
    duration: number;
}
export interface HeroPlayerStats {
    hero_id: HeroId;
    last_played: number;
    games: number;
    win: number;
    with_games: number;
    with_wins: number;
    against_games: number;
    against_win: number;
}
export interface Peer {
    account_id: AccountId;
    last_played: number;
    win: number;
    games: number;
    with_win: number;
    with_games: number;
    against_win: number;
    against_games: number;
    with_gpm_sum: number;
    with_xpm_sum: number;
    personaname: string | null;
    name: string | null;
    is_contributor: boolean;
    is_subscriber: boolean;
    last_login: string | null;
    avatar: string | null;
    avatarfull: string | null;
}
export interface RelationalProPlayer {
    account_id: AccountId;
    name: string | null;
    country_code: string;
    fantasy_role: number;
    team_id: number;
    team_name: string | null;
    team_tag: string | null;
    is_locked: boolean;
    is_pro: boolean;
    locked_until: number | null;
    steamid: SteamId | null;
    avatar: string | null;
    avatarmedium: string | null;
    avatarfull: string | null;
    last_login: string | null;
    full_history_time: string | null;
    cheese: number | null;
    fh_unavailable: boolean | null;
    loccountrycode: string | null;
    last_played: number | null;
    win: number;
    games: number;
    with_win: number;
    with_games: number;
    against_win: number;
    against_games: number;
    with_gpm_sum: number | null;
    with_xpm_sum: number | null;
}
export interface Stat {
    field: string;
    n: number;
    sum: number;
}
export declare const HISTOGRAM_COLUMNS: {
    KILLS: string;
    DEATHS: string;
    ASSISTS: string;
    KDA: string;
    GPM: string;
    XPM: string;
    LAST_HITS: string;
    DENIES: string;
    LANE_EFFICIENCY_PERCENT: string;
    DURATION: string;
    LEVEL: string;
    HERO_DMG: string;
    TOWER_DMG: string;
    HERO_HEALING: string;
    STUNS: string;
    TOWER_KILLS: string;
    NEUTRAL_KILLS: string;
    COURIER_KILLS: string;
    TP_SCROLL_PURCHASE: string;
    OBSERVER_PURCHASE: string;
    SENTRY_PURCHASE: string;
    GEM_PURCHASE: string;
    RAPIER_PURCHASE: string;
    PING_COUNT: string;
    THROW: string;
    COMEBACK: string;
    STOMP: string;
    LOSS: string;
    APM: string;
};
export type HistogramColumn = typeof HISTOGRAM_COLUMNS[keyof typeof HISTOGRAM_COLUMNS];
export declare const LEAVER_STATUS: {
    readonly NONE: 0;
    readonly DISCONNECTED: 1;
    readonly DISCONNECTED_TOO_LONG: 2;
    readonly ABANDONED: 3;
    readonly AFK: 4;
    readonly NEVER_CONNECTED: 5;
    readonly NEVER_CONNECTED_TOO_LONG: 6;
    readonly FAILED_TO_READY_UP: 7;
    readonly DECLINED: 8;
    readonly DECLINED_REQUEUE: 9;
};
export type LeaverStatus = typeof LEAVER_STATUS[keyof typeof LEAVER_STATUS];
export declare const leaverStatusByKey: Record<LeaverStatus, string>;
export declare const LANE_IDS: {
    readonly BOT: 1;
    readonly MID: 2;
    readonly OFF: 3;
    readonly RADIANT_JUNGLE: 4;
    readonly DIRE_JUNGLE: 5;
};
export type LaneId = typeof LANE_IDS[keyof typeof LANE_IDS];
export declare const KEYS: {
    readonly SIDES: {
        readonly RADIANT: "goodguys";
        readonly DIRE: "badguys";
    };
    readonly BUILDINGS: {
        readonly T1: "tower1";
        readonly T2: "tower2";
        readonly T3: "tower3";
        readonly T4: "tower4";
        readonly MELEE_BARRACKS: "melee_rax";
        readonly RANGED_BARRACKS: "range_rax";
        readonly ANCIENT: "fort";
    };
    readonly LANES: {
        readonly BOT: "bot";
        readonly MID: "mid";
        readonly TOP: "top";
    };
    readonly CREEPS: {
        readonly MELEE: "melee";
        readonly RANGED: "ranged";
        readonly SIEGE: "siege";
    };
};
export type SideKey = typeof KEYS.SIDES[keyof typeof KEYS.SIDES];
export type BuildingKey = typeof KEYS.BUILDINGS[keyof typeof KEYS.BUILDINGS];
export type LaneKey = typeof KEYS.LANES[keyof typeof KEYS.LANES];
export type CreepKey = typeof KEYS.CREEPS[keyof typeof KEYS.CREEPS];
export declare const TOWER_FLAGS: {
    readonly BOT: {
        readonly T1: 1;
        readonly T2: number;
        readonly T3: number;
    };
    readonly MID: {
        readonly T1: number;
        readonly T2: number;
        readonly T3: number;
    };
    readonly TOP: {
        readonly T1: number;
        readonly T2: number;
        readonly T3: number;
    };
    readonly T4: {
        readonly BOT: number;
        readonly TOP: number;
    };
};
export declare const BARRACK_FLAGS: {
    readonly BOT: {
        readonly MELEE: 1;
        readonly RANGE: number;
    };
    readonly MID: {
        readonly MELEE: number;
        readonly RANGE: number;
    };
    readonly TOP: {
        readonly MELEE: number;
        readonly RANGE: number;
    };
};
export declare const OBJECTIVE_TYPES: {
    readonly FIRST_BLOOD: "CHAT_MESSAGE_FIRSTBLOOD";
    readonly COURIER: "CHAT_MESSAGE_COURIER_LOST";
    readonly BUILDING: "building_kill";
};
export type ObjectiveType = typeof OBJECTIVE_TYPES[keyof typeof OBJECTIVE_TYPES];
export declare const RADIANT_SLOTS: readonly [0, 1, 2, 3, 4];
export declare const DIRE_SLOTS: readonly [128, 129, 130, 131, 132];
export type PlayerSlot = Unique<typeof RADIANT_SLOTS[number] | typeof DIRE_SLOTS[number], 'playerSlot'>;
export interface Distributions {
    ranks: {
        rows: RankRow[];
        sum: {
            count: number;
        };
    };
}
export interface RankRow {
    bin: RankBitmask;
    bin_name: RankBitmask;
    count: number;
    cumulative_sum: number;
}
//# sourceMappingURL=OpenDotaTypes.d.ts.map