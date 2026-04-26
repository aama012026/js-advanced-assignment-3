import { BARRACK_FLAGS, TOWER_FLAGS } from "../types/OpenDotaTypes.js";
const HERO_IDS_FILE = './build/assets/json/HeroIdBindings.json';
const ABILITY_IDS_FILE = './build/assets/json/AbilityIdBindings.json';
const ITEM_IDS_FILE = './build/assets/json/ItemIdBindings.json';
const heroIdsResult = await fetch(HERO_IDS_FILE).then(r => r.json());
const abilityIdsResult = await fetch(ABILITY_IDS_FILE).then(r => r.json());
const itemIdsResult = await fetch(ITEM_IDS_FILE).then(r => r.json());
if (!(heroIdsResult && abilityIdsResult && itemIdsResult)) {
    throw new Error('Could not read const files in build/assets/json/!');
}
const heroIds = heroIdsResult;
const heroKeysByExtId = Object.fromEntries(heroIds.map(hero => [hero.extId, hero.key]));
const heroKeysByLabel = Object.fromEntries(heroIds.map(hero => [hero.label, hero.key]));
export const heroLabels = Object.fromEntries(heroIds.map(hero => [hero.key, hero.label]));
const abilityIds = abilityIdsResult;
const abilityKeysByExtId = Object.fromEntries(abilityIds.map(ability => [ability.extId, ability.key]));
const abilityKeysByLabel = Object.fromEntries(abilityIds.map(ability => [ability.label, ability.key]));
export const abilityNames = Object.fromEntries(abilityIds.map(ability => [ability.key, ability.label]));
const itemIds = itemIdsResult;
const ItemKeysByLabel = Object.fromEntries(itemIds.map(item => [item.label, item.key]));
const ItemKeysByExtId = Object.fromEntries(itemIds.map(item => [item.extId, item.key]));
const SIDE = [
    { key: 0, label: 'radiant', extId: 0 },
    { key: 1, label: 'dire', extId: 1 }
];
const SideKeysByExtId = Object.fromEntries(SIDE.map(side => [side.extId, side.key]));
// Used for rendering.
export const sideNames = Object.fromEntries(SIDE.map(side => [side.key, side.label]));
export const LANES = [
    { key: 0, label: 'safelane', extId: 1 },
    { key: 1, label: 'midlane', extId: 2 },
    { key: 2, label: 'offlane', extId: 3 },
    /** maybe not needed */
    { key: 3, label: 'radiant jungle', extId: 4 },
    /** maybe not needed */
    { key: 4, label: 'dire junle', extId: 5 }
];
export const LaneKeyByExtId = Object.fromEntries(LANES.map(lane => [lane.extId, lane.key]));
export const Lanes = Object.fromEntries(LANES.map(lane => [lane.key, lane.label]));
export const ROLE = [
    'carry', 'midlaner', 'offlaner', 'soft support', 'hard support'
];
export const STRUCTURE_FLAGS = {
    SAFE: {
        T1: 1,
        T2: 1 << 1,
        T3: 1 << 2,
        MELEE_BARRACKS: 1 << 3,
        RANGE_BARRACKS: 1 << 4
    },
    MID: {
        T1: 1 << 5,
        T2: 1 << 6,
        T3: 1 << 7,
        MELEE_BARRACKS: 1 << 8,
        RANGE_BARRACKS: 1 << 9
    },
    OFF: {
        T1: 1 << 10,
        T2: 1 << 11,
        T3: 1 << 12,
        MELEE_BARRACKS: 1 << 13,
        RANGE_BARRACKS: 1 << 14,
    },
    T4: {
        SAFE: 1 << 15,
        OFF: 1 << 16,
    },
    ANCIENT: 1 << 17
};
function setStructureBitmask(towers, barracks, side, won) {
    let standingStructures = 0;
    // These will convert absolute lanes (bot / top) to relative 
    // lanes (safe / off) by shifting left or right
    let towerBitshift = 0;
    let raxBitshift = 0;
    let t4Safe = TOWER_FLAGS.T4.BOT;
    let t4Off = TOWER_FLAGS.T4.TOP;
    if (side === 'dire') {
        towerBitshift = 6;
        raxBitshift = 4;
        t4Safe = TOWER_FLAGS.T4.TOP;
        t4Off = TOWER_FLAGS.T4.BOT;
    }
    // Check bitmask against every structure flag and update combined bitmask.
    if ((towers & (TOWER_FLAGS.BOT.T1 << towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.SAFE.T1;
    }
    if ((towers & (TOWER_FLAGS.BOT.T2 << towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.SAFE.T2;
    }
    if ((towers & (TOWER_FLAGS.BOT.T3 << towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.SAFE.T3;
    }
    if ((barracks & (BARRACK_FLAGS.BOT.MELEE << raxBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.SAFE.MELEE_BARRACKS;
    }
    if ((barracks & (BARRACK_FLAGS.BOT.RANGE << raxBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.SAFE.RANGE_BARRACKS;
    }
    if ((towers & TOWER_FLAGS.MID.T1) != 0) {
        standingStructures |= STRUCTURE_FLAGS.MID.T1;
    }
    if ((towers & TOWER_FLAGS.MID.T2) != 0) {
        standingStructures |= STRUCTURE_FLAGS.MID.T2;
    }
    if ((towers & TOWER_FLAGS.MID.T3) != 0) {
        standingStructures |= STRUCTURE_FLAGS.MID.T3;
    }
    if ((barracks & BARRACK_FLAGS.MID.MELEE) != 0) {
        standingStructures |= STRUCTURE_FLAGS.MID.MELEE_BARRACKS;
    }
    if ((barracks & BARRACK_FLAGS.MID.RANGE) != 0) {
        standingStructures |= STRUCTURE_FLAGS.MID.RANGE_BARRACKS;
    }
    if ((towers & (TOWER_FLAGS.TOP.T1 >> towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.OFF.T1;
    }
    if ((towers & (TOWER_FLAGS.TOP.T2 >> towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.OFF.T2;
    }
    if ((towers & (TOWER_FLAGS.TOP.T3 >> towerBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.OFF.T3;
    }
    if ((barracks & (BARRACK_FLAGS.TOP.MELEE >> raxBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.OFF.MELEE_BARRACKS;
    }
    if ((barracks & (BARRACK_FLAGS.TOP.RANGE >> raxBitshift)) != 0) {
        standingStructures |= STRUCTURE_FLAGS.OFF.RANGE_BARRACKS;
    }
    if ((towers & t4Safe) != 0) {
        standingStructures |= STRUCTURE_FLAGS.T4.SAFE;
    }
    if ((towers & t4Off) != 0) {
        standingStructures |= STRUCTURE_FLAGS.T4.OFF;
    }
    if (won) {
        standingStructures |= STRUCTURE_FLAGS.ANCIENT;
    }
    return standingStructures;
}
// performs bitmasking to check if structure was standing at game end
export function structureSurvived(structures, mask) {
    return (structures & mask) != 0;
}
// We discard the derived data as it is trivial to calculate and would
// double the size.
export function formatRankDistribution(distributions) {
    const ranks = distributions.ranks.rows.map(rank => {
        return { rank: rank.bin, count: rank.count };
    });
    return {
        ranks: ranks,
        timestamp: new Date().toISOString()
    };
}
export function formatMatchSummary(summary, player) {
    const matchSummary = {
        match: {
            id: summary.match_id,
            fetchTime: new Date().toISOString(),
            lengthSeconds: summary.duration,
            winningTeam: summary.radiant_win ? 0 : 1,
            gameMode: summary.game_mode,
            lobbyType: summary.lobby_type,
            parseVersion: summary.version,
        },
        player: {
            id: player,
            leaverStatus: summary.leaver_status
        },
        hero: {
            id: heroKeysByExtId[summary.hero_id],
            kda: {
                kills: summary.kills,
                deaths: summary.deaths,
                assists: summary.assists
            }
        }
    };
    if (summary.start_time) {
        const timestamp = new Date(summary.start_time).toISOString();
        matchSummary.match.startTime = timestamp;
    }
    if (summary.party_size) {
        matchSummary.player.partySize = summary.party_size;
    }
    if (summary.player_slot) {
        matchSummary.player.slot = summary.player_slot;
    }
    // TODO: check if facets are still deprecated through dotaconstants,
    // and assign hero_variant if not
    return matchSummary;
}
export function formatSparseMatch(match) {
    const formattedMatch = {
        id: match.match_id,
        fetchTime: new Date().toISOString(),
        lengthSeconds: match.duration,
        winningTeam: match.radiant_win ? 0 : 1,
        gameMode: match.game_mode,
        lobbyType: match.lobby_type,
        parseVersion: match.version,
        meta: {
            matchSeqNum: match.match_seq_num,
            series: { id: match.series_id, type: match.series_type },
            leagueId: match.leagueid,
            patch: match.patch,
            region: match.region,
            cluster: match.cluster,
            replay: { url: new URL(match.replay_url), salt: match.replay_salt },
            odota: {
                engine: match.engine,
                parseVersion: match.version,
                api: match.od_data.has_api,
                gcData: match.od_data.has_gcdata,
                archived: match.od_data.has_archived,
                flags: match.flags,
                metadata: match.metadata,
            }
        },
        radiant: {
            structuresLeft: setStructureBitmask(match.tower_status_radiant, match.barracks_status_radiant, 'radiant', 
            // TODO: We need to handle case where radiant_win is null
            match.radiant_win),
            kills: match.radiant_score
        },
        dire: {
            structuresLeft: setStructureBitmask(match.tower_status_dire, match.barracks_status_dire, 'dire', !match.radiant_win),
            kills: match.dire_score
        },
        draft: match.pick_bans.map(pb => parsePickBan(pb)),
        players: match.players.map(player => formatSparsePlayer(player)),
        firstBloodSeconds: match.first_blood_time,
        humanPlayerCount: match.human_players,
        preGameLengthSeconds: match.pre_game_duration,
    };
    return formattedMatch;
}
export function formatFullMatch(match) {
    const formattedMatch = {
        id: match.match_id,
        fetchTime: new Date().toISOString(),
        lengthSeconds: match.duration,
        winningTeam: match.radiant_win ? 0 : 1,
        gameMode: match.game_mode,
        lobbyType: match.lobby_type,
        parseVersion: match.version,
        meta: {
            matchSeqNum: match.match_seq_num,
            series: { id: match.series_id, type: match.series_type },
            leagueId: match.leagueid,
            patch: match.patch,
            region: match.region,
            cluster: match.cluster,
            replay: { url: new URL(match.replay_url), salt: match.replay_salt },
            odota: {
                engine: match.engine,
                parseVersion: match.version,
                api: match.od_data.has_api,
                gcData: match.od_data.has_gcdata,
                archived: match.od_data.has_archived,
                flags: match.flags,
                metadata: match.metadata,
            }
        },
        radiant: {
            structuresLeft: setStructureBitmask(match.tower_status_radiant, match.barracks_status_radiant, 'radiant', 
            // TODO: We need to handle case where radiant_win is null
            match.radiant_win),
            kills: match.radiant_score
        },
        dire: {
            structuresLeft: setStructureBitmask(match.tower_status_dire, match.barracks_status_dire, 'dire', !match.radiant_win),
            kills: match.dire_score
        },
        draft: match.pick_bans.map(pb => parsePickBan(pb)),
        players: match.players.map(player => {
            return formatFullInGamePlayer(player);
        }),
        firstBloodSeconds: match.first_blood_time,
        humanPlayerCount: match.human_players,
        preGameLengthSeconds: match.pre_game_duration,
        radiantAdv: { gold: match.radiant_gold_adv, xp: match.radiant_xp_adv },
    };
    if (match.pauses && match.pauses.length > 0) {
        formattedMatch.pauses = match.pauses;
    }
    // TODO: Conditionally add objectives, chat, wordCounts and cosmetics
    return formattedMatch;
}
export const OBJECTIVES = {
    FIRST_BLOOD: 'first blood',
    COURIER: 'courier',
    BUILDING: 'building',
    TORMENTOR: 'tormentor',
    ROSHAN: 'roshan',
    AEGIS: 'aegis'
};
function formatSparsePlayer(player) {
    const sparsePlayer = {
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
        cs: { lastHits: player.last_hits, denies: player.denies },
        // if total-spent != remaining, gold lost is not concidered spent by the API.
        gold: {
            total: player.total_gold,
            spent: player.gold_spent,
            remaining: player.gold
        },
        hero: {
            id: heroKeysByExtId[player.hero_id],
            lvl: player.level,
            abilityUpgrades: player.ability_upgrades_arr.map(ability => {
                return abilityKeysByExtId[ability];
            }),
            permanentBuffs: player.permanent_buffs.map(buff => {
                return {
                    id: buff.permanent_buff,
                    stackCount: buff.stack_count,
                    receivedSeconds: buff.grant_time
                };
            }),
            netWorth: player.net_worth,
            inventory: [
                ItemKeysByExtId[player.item_0], ItemKeysByExtId[player.item_1],
                ItemKeysByExtId[player.item_2], ItemKeysByExtId[player.item_3],
                ItemKeysByExtId[player.item_4], ItemKeysByExtId[player.item_5],
                ItemKeysByExtId[player.backpack_0],
                ItemKeysByExtId[player.backpack_1],
                ItemKeysByExtId[player.backpack_2],
            ],
            neutralItem: {
                artifact: ItemKeysByExtId[player.item_neutral],
                enchantment: ItemKeysByExtId[player.item_neutral2]
            }
        },
        damage: { toHeroes: player.hero_damage, toBuildings: player.tower_damage },
        healing: { amt: player.hero_healing }
    };
    if (player.personaname) {
        sparsePlayer.account.personaName = player.personaname;
    }
    if (player.name) {
        sparsePlayer.account.name = player.name;
    }
    if (player.rank_tier) {
        sparsePlayer.account.rank = player.rank_tier;
    }
    if (player.computed_mmr) {
        sparsePlayer.account.mmrGuess = player.computed_mmr;
    }
    if (player.player_slot) {
        sparsePlayer.slot = player.player_slot;
    }
    if (player.party_id) {
        sparsePlayer.partyId = player.party_id;
    }
    return sparsePlayer;
}
export function formatFullInGamePlayer(player) {
    const parsedPlayer = {
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
        cs: { lastHits: player.last_hits, denies: player.denies },
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
                    id: buff.permanent_buff,
                    stackCount: buff.stack_count,
                    receivedSeconds: buff.grant_time
                };
            }),
            netWorth: player.net_worth,
            inventory: [
                ItemKeysByExtId[player.item_0], ItemKeysByExtId[player.item_1],
                ItemKeysByExtId[player.item_2], ItemKeysByExtId[player.item_3],
                ItemKeysByExtId[player.item_4], ItemKeysByExtId[player.item_5],
                ItemKeysByExtId[player.backpack_0],
                ItemKeysByExtId[player.backpack_1],
                ItemKeysByExtId[player.backpack_2],
            ],
            neutralItem: {
                artifact: ItemKeysByExtId[player.item_neutral],
                enchantment: ItemKeysByExtId[player.item_neutral2]
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
                who: heroKeysByLabel[player.max_hero_hit.key],
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
            lane: LaneKeyByExtId[player.lane_role],
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
        xpSources: translateRecord(player.xp_reasons, XpSourceKeyByExtId),
        goldSources: translateRecord(player.gold_reasons, GoldSrcKeysByExtId),
        lifeState: translateRecord(player.life_state, LifeStateKeysByExtId),
        abilities: {
            uses: Object.fromEntries(Object.entries(player.ability_uses).map(([ability, useCount]) => {
                return [abilityKeysByLabel[ability], useCount];
            })),
            targets: player.ability_targets
        },
        items: {
            uses: player.item_usage,
            purchases: player.purchase_log.map(({ time, key }) => {
                return { whenSeconds: time, item: ItemKeysByLabel[key] };
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
            kills: player.kills_log.map(({ time, key }) => {
                return { whenSeconds: time, who: heroKeysByLabel[key] };
            }),
            buybackTimestamps: player.buyback_log.map(bb => bb.time),
            runes: player.runes_log.map(({ time, key }) => {
                return {
                    whenSeconds: time,
                    rune: RuneKeysByExtId[parseInt(key)]
                };
            }),
            neutralItems: player.neutral_item_history.map((n => {
                return {
                    artifact: ItemKeysByLabel[n.item_neutral],
                    enchantment: ItemKeysByLabel[n.item_neutral_enhancement],
                    craftedSeconds: n.time
                };
            })),
            // TODO: insert old neutral token log for old matches
            // TODO: create id bindings for connection events.
            connection: Object.entries(player.connection_log).map(([_, v]) => {
                return { whenSeconds: v.time, event: v.event };
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
    };
    if (player.personaname) {
        parsedPlayer.account.personaName = player.personaname;
    }
    if (player.name) {
        parsedPlayer.account.name = player.name;
    }
    if (player.rank_tier) {
        parsedPlayer.account.rank = player.rank_tier;
    }
    if (player.computed_mmr) {
        parsedPlayer.account.mmrGuess = player.computed_mmr;
    }
    if (player.player_slot) {
        parsedPlayer.slot = player.player_slot;
    }
    if (player.party_id) {
        parsedPlayer.partyId = player.party_id;
    }
    if (player.is_roaming) {
        parsedPlayer.laning.roamed = true;
    }
    if (player.cosmetics) {
        parsedPlayer.cosmetics = player.cosmetics;
    }
    if (player.additional_units) {
        parsedPlayer.additionalUnits;
    }
    return parsedPlayer;
}
function translateRecord(record, lookup) {
    return Object.fromEntries(Object.entries(record).map(([k, v]) => [lookup[parseInt(k)], v]));
}
function formatWardLog(enteredLog, leftLog) {
    enteredLog.sort((a, b) => a.ehandle - b.ehandle);
    leftLog.sort((a, b) => a.ehandle - b.ehandle);
    const wardLog = [];
    enteredLog.forEach((entry, i) => {
        const combinedEntry = {
            placedSeconds: entry.time,
            leftSeconds: leftLog[i]?.time ?? null,
            position: { x: entry.x, y: entry.y, z: entry.z },
        };
        if (leftLog[i]?.attackername) {
            combinedEntry.killer = leftLog[i].attackername;
        }
        wardLog.push(combinedEntry);
    });
    return wardLog;
}
export function parsePickBan(pickBan) {
    return {
        order: pickBan.order,
        action: pickBan.is_pick ? 'pick' : 'ban',
        team: SideKeysByExtId[pickBan.team],
        hero: heroKeysByExtId[pickBan.hero_id],
    };
}
export const RUNES = [
    { key: 0, label: 'bounty', extId: 5 },
    { key: 1, label: 'wisdom', extId: 8 },
    { key: 2, label: 'water', extId: 7 },
    { key: 3, label: 'invisibility', extId: 3 },
    { key: 4, label: 'regeneration', extId: 4 },
    { key: 5, label: 'amplify damage', extId: 0 },
    { key: 6, label: 'arcane', extId: 6 },
    { key: 7, label: 'haste', extId: 1 },
    { key: 8, label: 'illusion', extId: 2 },
    { key: 9, label: 'shield', extId: 9 }
];
export const RuneKeysByExtId = Object.fromEntries(RUNES.map(rune => [rune.extId, rune.key]));
export const Runes = Object.fromEntries(RUNES.map(rune => [rune.key, rune.label]));
export const GOLD_SOURCES = [
    { key: 0, label: 'other', extId: 0 },
    { key: 1, label: 'deaths', extId: 1 },
    { key: 6, label: 'unknown6', extId: 6 },
    { key: 11, label: 'buildings', extId: 11 },
    { key: 12, label: 'heroes', extId: 12 },
    { key: 13, label: 'lane creeps', extId: 13 },
    { key: 14, label: 'neutral creeps', extId: 14 },
    { key: 16, label: 'first blood', extId: 16 },
    { key: 17, label: 'bounty runes', extId: 17 },
    { key: 19, label: 'unknown19', extId: 19 },
    { key: 20, label: 'wards', extId: 20 },
    { key: 21, label: 'unknown21 (value 135)', extId: 21 }
];
export const GoldSrcKeysByExtId = Object.fromEntries(GOLD_SOURCES.map(src => [src.extId, src.key]));
export const GoldSources = Object.fromEntries(GOLD_SOURCES.map(src => [src.key, src.label]));
export const XP_SOURCES = [
    { key: 0, label: 'other', extId: 0 },
    { key: 1, label: 'heroes', extId: 1 },
    { key: 2, label: 'creeps', extId: 2 },
    { key: 4, label: 'unknown4', extId: 4 },
];
export const XpSourceKeyByExtId = Object.fromEntries(XP_SOURCES.map(src => [src.extId, src.key]));
export const XpSources = Object.fromEntries(XP_SOURCES.map(src => [src.key, src.label]));
// Single source of truth data binding
export const LIFE_STATES = [
    { key: 0, label: 'alive', extId: 0 },
    { key: 1, label: 'unknown (pseudo-death?)', extId: 1 },
    { key: 2, label: 'dead', extId: 2 }
    // Potential unknown sources: respawning, reincarnation / pseudo-death (aegis, wraith king)
];
// Lookups - (we really only need external -> internal and internal -> label as we always transform and store data by internal id).
export const LifeStateKeysByExtId = Object.fromEntries(LIFE_STATES.map(state => [state.extId, state.key]));
/* We could have defined the original data in the structure of this record, but
we get the added compile time safety by only allowing valid IDs through type. */
export const LifeStates = Object.fromEntries(LIFE_STATES.map(state => [state.key, state.label]));
// Computed values
export function getSecondsDead(lifeState) {
    return (lifeState[LIFE_STATES[1].key] || 0) + (lifeState[LIFE_STATES[2].key] || 0);
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
];
export const UnitKeysByExtId = Object.fromEntries(UNIT_IDS.map(unit => [unit.extId, unit.key]));
export const Units = Object.fromEntries(UNIT_IDS.map(unit => [unit.key, unit.label]));
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
];
export const StructureKeysByExtId = Object.fromEntries(STRUCTURE_IDS.map(structure => [structure.extId, structure.key]));
export const Structures = Object.fromEntries(STRUCTURE_IDS.map(structure => [structure.key, structure.label]));
//# sourceMappingURL=bindings.js.map