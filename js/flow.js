// USER LIBRARY WITH UNIQUE NAME TO AVOID STANDARD COLLISIONS
export const RESPONSE_CODES = {
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
    304: 'Not Modified', // Server usually handle, so we receive a 200 OK with the cached content.
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
export function getLocalOrSet(key, defaultValue) {
    return ((item) => item ? JSON.parse(item) : defaultValue)(localStorage.getItem(key));
}
export async function tryGetJson(url) {
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
export function getResponseMsg(request, responseCode) {
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
// ERROR HANDLING
export function assert(object, objectName, partialErrorMsg) {
    if (!object) {
        throw new Error(`${partialErrorMsg}: ${objectName} is nullish!`);
    }
    return object;
}
//# sourceMappingURL=flow.js.map