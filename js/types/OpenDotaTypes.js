// Manual IDs ------------------------------------------------------------------
// Taken and reworked from odota repo core/proto/dota_shared_enums.proto
export const HISTOGRAM_COLUMNS = {
    KILLS: "kills",
    DEATHS: "deaths",
    ASSISTS: "assists",
    KDA: "kda",
    GPM: "gold_per_min",
    XPM: "xp_per_min",
    LAST_HITS: "last_hits",
    DENIES: "denies",
    LANE_EFFICIENCY_PERCENT: "lane_efficiency_pct",
    DURATION: "duration",
    LEVEL: "Level",
    HERO_DMG: "hero_damage",
    TOWER_DMG: "tower_damage",
    HERO_HEALING: "hero_healing",
    STUNS: "stuns",
    TOWER_KILLS: "tower_kills",
    NEUTRAL_KILLS: "neutral_kills",
    COURIER_KILLS: "courier_kills",
    TP_SCROLL_PURCHASE: "purchase_tpscroll",
    OBSERVER_PURCHASE: "purchase_ward_observer",
    SENTRY_PURCHASE: "purchase_ward_sentry",
    GEM_PURCHASE: "purchase_gem",
    RAPIER_PURCHASE: "purchase_rapier",
    PING_COUNT: "pings",
    THROW: "throw",
    COMEBACK: "comeback",
    STOMP: "stomp",
    LOSS: "loss",
    APM: "actions_per_min",
};
export const LEAVER_STATUS = {
    NONE: 0,
    DISCONNECTED: 1,
    DISCONNECTED_TOO_LONG: 2,
    ABANDONED: 3,
    AFK: 4,
    NEVER_CONNECTED: 5,
    NEVER_CONNECTED_TOO_LONG: 6,
    FAILED_TO_READY_UP: 7,
    DECLINED: 8,
    DECLINED_REQUEUE: 9
};
// Gleamed from function in core/svc/util/laneMappings.ts
export const LANE_IDS = {
    BOT: 1,
    MID: 2,
    OFF: 3,
    RADIANT_JUNGLE: 4,
    DIRE_JUNGLE: 5
};
// -----------------------------------------------------------------------------
// We bind these so we only need to change in one place if api changes.
export const KEYS = {
    SIDES: {
        RADIANT: 'goodguys',
        DIRE: 'badguys'
    },
    BUILDINGS: {
        T1: 'tower1',
        T2: 'tower2',
        T3: 'tower3',
        T4: 'tower4',
        MELEE_BARRACKS: 'melee_rax',
        RANGED_BARRACKS: 'range_rax',
        ANCIENT: 'fort'
    },
    LANES: {
        BOT: 'bot',
        MID: 'mid',
        TOP: 'top'
    },
    CREEPS: {
        MELEE: 'melee',
        RANGED: 'ranged',
        SIEGE: 'siege'
    }
};
export const TOWER_FLAGS = {
    BOT: {
        T1: 1,
        T2: 1 << 1,
        T3: 1 << 2
    },
    MID: {
        T1: 1 << 3,
        T2: 1 << 4,
        T3: 1 << 5
    },
    TOP: {
        T1: 1 << 6,
        T2: 1 << 7,
        T3: 1 << 8
    },
    T4: {
        BOT: 1 << 9,
        TOP: 1 << 10
    }
};
export const BARRACK_FLAGS = {
    BOT: {
        MELEE: 1,
        RANGE: 1 << 1,
    },
    MID: {
        MELEE: 1 << 2,
        RANGE: 1 << 3,
    },
    TOP: {
        MELEE: 1 << 4,
        RANGE: 1 << 5
    }
};
//TODO: Probe multiple parsed matches to find weird combinations.
// Also seen for roshan and aegis, have to find again.
export const OBJECTIVE_TYPES = {
    FIRST_BLOOD: "CHAT_MESSAGE_FIRSTBLOOD",
    COURIER: "CHAT_MESSAGE_COURIER_LOST",
    BUILDING: "building_kill",
};
// const arrays lets us access the slots for both team with i < 5.
export const RADIANT_SLOTS = [0, 1, 2, 3, 4];
export const DIRE_SLOTS = [128, 129, 130, 131, 132];
//# sourceMappingURL=OpenDotaTypes.js.map