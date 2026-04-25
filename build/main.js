import { formatRankDistribution } from './modules/bindings.js';
import { assert, setLocal, tryGetElement, tryGetJson, tryGetLocal } from './modules/flow.js';
const HOST = 'https://api.opendota.com/';
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
const LocalDataKey = {
    RankDistribution: 'rankDistribution',
    Benchmarks: 'benchmarks',
    StoredMatches: 'storedMatches',
};
// TODO: We removed the manual call count as we can get the remaining calls from response headers.
// INIT
let benchmarks = tryGetLocal(LocalDataKey.Benchmarks);
const searchInput = tryGetElement('#search-input');
const searchBtn = tryGetElement('#search-btn');
searchBtn.addEventListener('click', searchTypedAccount);
// page flow -> search accounts -> provide sample account ids.
// show match summary for recent matches. Let user click match.
// show match details with focus on account hero. Let user request parse if match is not parsed.
async function searchTypedAccount() {
    const playerResult = await tryGetPlayer(searchInput.value);
    if (!playerResult.ok) {
        console.error(playerResult.msg);
    }
    else {
        console.log(playerResult.msg);
        console.log(JSON.stringify(playerResult.data));
        const recentMatchesResult = await tryGetRecentMatches(playerResult.data?.profile.account_id);
        if (!recentMatchesResult.ok) {
            console.error(recentMatchesResult.msg);
        }
        else {
            console.log(recentMatchesResult.msg);
            console.log(JSON.stringify(recentMatchesResult.data));
        }
    }
}
async function tryGetPlayer(idOrPersona) {
    let accountId;
    if (typeof idOrPersona === 'string') {
        const url = new URL(ENDPOINT.search);
        url.search = `?q=${idOrPersona}`;
        const result = await tryGetJson(url);
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
            };
        }
        accountId = assert(result.data[0], 'result.data![0]', `Could not get user for persona ${idOrPersona}`).account_id;
    }
    else {
        accountId = idOrPersona;
    }
    const result = await tryGetJson(new URL(`${ENDPOINT.players}/${accountId}`, HOST));
    return result;
}
async function tryGetRecentMatches(id) {
    return await tryGetJson(new URL(`${ENDPOINT.players}/${id}/recentMatches`));
}
async function tryGetMatch(matchId) {
    let match = tryGetLocal(`match:${matchId}`);
    if (match) {
        return match;
    }
    const result = await tryGetJson(new URL(`${ENDPOINT.matches}/${matchId}`));
    if (!result.ok) {
        return null;
    }
    setLocal(`match:${matchId}`, assert(result.data, 'match.data', 'Could not store match.'));
    return result.data;
}
async function requestParse(matchId) {
    const result = await tryGetJson(new URL(`${ENDPOINT.request}/${matchId}`), { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    if (!result.ok) {
        return null;
    }
    return result.data;
}
async function tryGetRankDistribution() {
    let rankDistribution = tryGetLocal(LocalDataKey.RankDistribution);
    // Try to get from localstorage first, fetch if not present or stale (here 24H shelf life).
    if (!(rankDistribution && new Date().getHours() - new Date(rankDistribution.timestamp).getHours() <= 24)) {
        const result = await tryGetJson(ENDPOINT.distributions);
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