import { formatMatchSummary, formatRankDistribution, heroLabels } from './modules/bindings.js';
import { assert, setLocal, tryGetElement, tryGetJson, tryGetLocal } from './modules/flow.js';
import { leaverStatusByKey, LEAVER_STATUS } from './types/OpenDotaTypes.js';
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
const PATH = {
    DATA: {
        HERO_IDS: './build/assets/json/heroIdBindings.json',
        HEROES: './build/assets/json/heroes.json',
        ABILITY_IDS: './build/assets/json/abilityIdBindings.json',
        ITEM_IDS: './build/assets/json/itemIdBindings.json',
        ITEMS: './build/assets/json/items.json'
    },
    IMG: {
        HERO: './build/assets/img/hero',
        ITEM: './build/assets/img/items'
    }
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
const templates = {
    matchHistory: tryGetElement('#match-history-template'),
    matchSummary: tryGetElement('#match-summary-template')
};
const sections = {
    matchHistory: tryGetElement('#match-history')
};
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
        const player = playerResult.data;
        const matchesResult = await tryGetMatches(player.profile.account_id);
        if (!matchesResult.ok) {
            console.error(matchesResult.msg);
        }
        else {
            console.log(matchesResult.msg);
            console.log(JSON.stringify(matchesResult.data));
            const matchHistory = matchesResult.data.map(match => formatMatchSummary(match, player.profile.account_id));
            sections.matchHistory.replaceChildren(document.importNode(templates.matchHistory.content, true));
            const matchHistoryBody = sections.matchHistory.querySelector('tbody');
            matchHistory.forEach(match => matchHistoryBody.append(createMatchSummary(match)));
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
async function tryGetMatches(id) {
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
function createMatchSummary(playerMatch) {
    const { match, player, hero } = playerMatch;
    const startTime = match.startTime ? new Date(match.startTime).toLocaleString() : 'unknown';
    const rowFragment = {
        node: document.importNode(templates.matchSummary.content, true),
        name: 'matchSummaryFragment'
    };
    const cells = {
        matchId: tryGetElement('[data-cell="match-id"]', rowFragment),
        matchTime: tryGetElement('[data-cell="match-time"]', rowFragment),
        heroImg: tryGetElement('[data-cell="hero-img"]', rowFragment),
        result: tryGetElement('[data-cell="result"]', rowFragment),
        side: tryGetElement('[data-cell="side"]', rowFragment),
        duration: tryGetElement('[data-cell="duration"]', rowFragment),
        kills: tryGetElement('[data-cell="kills"]', rowFragment),
        deaths: tryGetElement('[data-cell="deaths"]', rowFragment),
        assists: tryGetElement('[data-cell="assists"]', rowFragment),
        gamemode: tryGetElement('[data-cell="gamemode"]', rowFragment),
        lobbyType: tryGetElement('[data-cell="lobby-type"]', rowFragment),
        leftGame: tryGetElement('[data-cell="left"]', rowFragment),
    };
    const heroImg = document.createElement('img');
    heroImg.src = `${PATH.IMG.HERO}/${heroLabels[hero.id]}.png`;
    heroImg.alt = heroLabels[hero.id];
    let result = 'Result unavailable';
    let side = 'Side unavailable';
    if (player.slot) {
        const playerTeam = player.slot < 128 ? 0 : 1;
        result = match.winningTeam === playerTeam ? 'Victory' : 'Defeat';
        cells.result.dataset.result = result;
        side = playerTeam === 0 ? 'Radiant' : 'Dire';
        cells.side.dataset.side = side;
    }
    cells.matchId.textContent = `Match: ${match.id}`;
    cells.matchTime.textContent = `Time: ${startTime}`;
    cells.heroImg.append(heroImg);
    cells.result.textContent = result;
    cells.side.textContent = side;
    cells.duration.textContent = timerStringFromSeconds(match.lengthSeconds);
    cells.kills.textContent = hero.kda.kills.toString();
    cells.deaths.textContent = hero.kda.deaths.toString();
    cells.assists.textContent = hero.kda.assists.toString();
    cells.gamemode.textContent = match.gameMode.toString();
    cells.lobbyType.textContent = match.lobbyType.toString();
    if (player.leaverStatus != LEAVER_STATUS.NONE) {
        cells.leftGame.textContent = leaverStatusByKey[player.leaverStatus];
    }
    else {
        cells.leftGame.remove();
    }
    return rowFragment.node;
}
function timerStringFromSeconds(duration) {
    const wholeSeconds = Math.round(duration);
    const seconds = wholeSeconds % 60;
    const minutes = ((wholeSeconds - seconds) % 3600) / 60;
    const hours = Math.floor((wholeSeconds - seconds - minutes) / 3600);
    const hoursString = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
    return `${hoursString}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
//# sourceMappingURL=main.js.map