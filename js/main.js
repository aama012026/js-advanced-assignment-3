import { formatRankDistribution } from './bindings.js';
import { assert, getLocalOrSet, setLocal, tryGetJson, tryGetLocal } from './flow.js';
const DEBUG = true;
const HOST = 'https:api.opendota.com/';
const ENDPOINT = {
    matches: new URL('api/matches', HOST),
    players: new URL('api/players', HOST),
    topPlayers: new URL('api/topPlayers', HOST),
    proPlayers: new URL('api/proPlayers', HOST),
    proMatches: new URL('api/ProMatches', HOST),
    publicMatches: new URL('api/publicMatches', HOST),
    parsedMatches: new URL('api/parsedMatches', HOST),
    explorer: new URL('api/explorer', HOST),
    metadata: new URL('api/metadata', HOST),
    distributions: new URL('api/distributions', HOST),
    search: new URL('api/search', HOST),
    rankings: new URL('api/rankings', HOST),
    benchmarks: new URL('api/benchmarks', HOST),
    health: new URL('api/health', HOST),
    request: new URL('api/request', HOST),
    findMatches: new URL('api/findMatches', HOST),
    heroes: new URL('api/heroes', HOST),
    heroStats: new URL('api/heroStats', HOST),
    leagues: new URL('api/rankings', HOST),
    teams: new URL('api/rankings', HOST),
    records: new URL('api/rankings', HOST),
    live: new URL('api/rankings', HOST),
    scenarios: new URL('api/rankings', HOST),
    schema: new URL('api/rankings', HOST),
    constants: new URL('api/rankings', HOST),
};
var LocalDataKey;
(function (LocalDataKey) {
    LocalDataKey["ApiCallCount"] = "apiCallCount";
    LocalDataKey["RankDistribution"] = "rankDistribution";
    LocalDataKey["Benchmarks"] = "benchmarks";
    LocalDataKey["StoredMatches"] = "storedMatches";
})(LocalDataKey || (LocalDataKey = {}));
// INIT
let callCount = getLocalOrSet(LocalDataKey.ApiCallCount, 0);
// let benchmarks = tryGetLocal<Benchmark[]>(LocalDataKey.Benchmarks)
console.log(await tryGetPlayer(173072761));
async function tryGetPlayer(idOrPersona) {
    let accountId;
    if (typeof idOrPersona === 'string') {
        const url = new URL(ENDPOINT.search);
        url.search = `?q=${idOrPersona}`;
        const result = await tryGetJson(url);
        callCount++;
        if (!result.ok) {
            return {
                data: null,
                ok: false,
                msg: `Could not get search result for ${idOrPersona}.\ntryGetJson failed with msg:\n${result.msg}`
            };
        }
        else if (!result.data) {
            return {
                data: null,
                ok: false,
                msg: ``
            };
        }
        accountId = assert(result.data[0], 'result.data![0]', 'Could not get user for persona ${idOrPersona}').account_id;
    }
    else {
        accountId = idOrPersona;
    }
    const result = await tryGetJson(new URL(`${ENDPOINT.players}/${accountId}`, HOST));
    callCount++;
    return result;
}
async function tryGetMatch(matchId) {
    let match = tryGetLocal(`match:${matchId}`);
    if (match) {
        return match;
    }
    const result = await tryGetJson(new URL(`${ENDPOINT.matches}/${matchId}`, HOST));
    callCount++;
    if (DEBUG) {
        console.log(`${result.msg}\nCall count: ${callCount}`);
    }
    if (!result.ok) {
        return null;
    }
    setLocal(`match:${matchId}`, assert(result.data, 'match.data', 'Could not store match.'));
    return result.data;
}
async function tryGetRankDistribution() {
    let rankDistribution = tryGetLocal(LocalDataKey.RankDistribution);
    // Try to get from localstorage first, fetch if not present or stale (here 24H shelf life).
    if (!(rankDistribution && new Date().getHours() - new Date(rankDistribution.timestamp).getHours() <= 24)) {
        const result = await tryGetJson(ENDPOINT.distributions);
        callCount++;
        if (result.ok) {
            rankDistribution = formatRankDistribution(assert(result.data, 'result.data', 'Could not format rank distribution'));
            setLocal(LocalDataKey.RankDistribution, rankDistribution);
        }
    }
    return rankDistribution;
}
// async function tryGetBenchmarks(hero: HeroId) {
// }
//# sourceMappingURL=main.js.map