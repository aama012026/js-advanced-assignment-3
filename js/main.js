import { assert, tryGetJson } from './flow.js';
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
// enum LocalDataKey {
// 	ApiCallCount = 'apiCallCount'
// }
// INITI
// let callCount = getLocalOrSet<number>(LocalDataKey.ApiCallCount, 0);
console.log(await tryGetPlayer(173072761));
async function tryGetPlayer(idOrPersona) {
    let accountId;
    if (typeof idOrPersona === 'string') {
        const url = new URL(ENDPOINT.search, HOST);
        url.search = `?q=${idOrPersona}`;
        const result = await tryGetJson(url);
        console.log(result);
        accountId = assert(result[0], 'result[0]', 'Could not get user for persona ${idOrPersona}').account_id;
    }
    else {
        accountId = idOrPersona;
    }
    return await tryGetJson(new URL(`${ENDPOINT.players}/${accountId}`, HOST));
}
// async function tryGetMatch(matchId: number) {
// 	return await tryGetJson(new URL(`${ENDPOINT.matches}/${matchId}`, HOST)) as Match
// }
//# sourceMappingURL=main.js.map