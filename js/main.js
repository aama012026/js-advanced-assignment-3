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
const RESPONSE_CODES = {
    // Informational responses
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing (deprecated)',
    103: 'Early Hints',
    // Success responses
    200: 'Ok',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status (WebDAV)',
    208: 'Already Reported (WebDav)',
    226: 'IM Used (HTTP Delta encoding)',
    // Redirection messages
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy (deprecated)',
    306: 'unused, but reserved response_code',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    // Client error responses
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found', // Not billed by OpenDotaAPI. Maybe not counted?
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Confilct',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Content Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    421: 'Misdirected Request',
    422: 'Unprocessable Content (WebDAV)',
    423: 'Locked (WebDAV)',
    424: 'Failed Dependency (WebDAV)',
    425: 'Too Early (experimental)',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests', // Not billed by OpenDotaAPI. Maybe not counted?
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    // Server error responses
    500: 'Internal Server Error', // Not billed by OpenDotaAPI. Maybe not counted?
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage (WebDAV)',
    508: 'Loop Detected (WebDAV)',
    510: 'Not Extended',
    511: 'Network Authentication Required'
};
await tryGetPlayer(173072761);
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
async function tryGetJson(url) {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(getResponseMsg(url, response.status));
    }
    else {
        console.log(getResponseMsg(url, response.status));
    }
    return await response.json();
}
function getResponseMsg(request, responseCode) {
    let responseCategory;
    switch (true) {
        case responseCode < 200:
            responseCategory = 'an informational response';
            break;
        case responseCode < 300:
            responseCategory = 'a success response';
            break;
        case responseCode < 400:
            responseCategory = 'a redirect response';
            break;
        case responseCode < 500:
            responseCategory = 'a client error';
            break;
        case responseCode < 600:
            responseCategory = 'a server error';
            break;
        default:
            throw new Error(`getResponseString defaulted in switch on response code ${responseCode}`);
    }
    return `request: ${request}\nGot ${responseCategory}: ${responseCode} - ${RESPONSE_CODES[responseCode]}`;
}
function assert(object, objectName, partialErrorMsg) {
    if (!object) {
        throw new Error(`${partialErrorMsg}: ${objectName} is nullish!`);
    }
    return object;
}
export {};
//# sourceMappingURL=main.js.map