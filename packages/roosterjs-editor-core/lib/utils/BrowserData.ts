export interface BrowserData {
    isMac: boolean;
    isWin: boolean;
    isWebKit: boolean;
    isIE: boolean;
    isIE11OrGreater: boolean;
    isSafari: boolean;
    isChrome: boolean;
    isFirefox: boolean;
    isEdge: boolean;
}

/**
 * Get the browser related data
 * @param userAgent The userAgent
 * @param appVersion The version of the browser
 */
export function getBrowserData(userAgent?: string, appVersion?: string): BrowserData {
    // In case universal render somehow hits this code path
    if (typeof window == 'undefined') {
        return {
            isMac: false,
            isWin: false,
            isWebKit: false,
            isIE: false,
            isIE11OrGreater: false,
            isSafari: false,
            isChrome: false,
            isFirefox: false,
            isEdge: false,
        };
    }

    let rawValue = userAgent || window.navigator.userAgent;
    let appVer = appVersion || window.navigator.appVersion;

    // checks whether the browser is running in IE
    // IE11 will use rv in UA instead of MSIE. Unfortunately Firefox also uses this. We should also look for "Trident" to confirm this.
    // There have been cases where companies using older version of IE and custom UserAgents have broken this logic (e.g. IE 10 and KellyServices)
    // therefore we should check that the Trident/rv combo is not just from an older IE browser
    let isIE11OrGreater = rawValue.indexOf('rv:') != -1 && rawValue.indexOf('Trident') != -1;
    let isIE = rawValue.indexOf('MSIE') != -1 || isIE11OrGreater;

    let isWebKit = rawValue.indexOf('WebKit') != -1;

    // IE11+ may also send Chrome, Firefox and Safari. But it will send trident also
    let isChrome = false;
    let isFirefox = false;
    let isSafari = false;
    let isEdge = false;

    if (!isIE) {
        isChrome = rawValue.indexOf('Chrome') != -1;
        isFirefox = rawValue.indexOf('Firefox') != -1;
        if (rawValue.indexOf('Safari') != -1) {
            // Android and Chrome have Safari in the user string
            isSafari = rawValue.indexOf('Chrome') == -1 && rawValue.indexOf('Android') == -1;
        }

        // Sample Edge UA: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10121
        isEdge = rawValue.indexOf('Edge') != -1;

        // When it is edge, it should not be chrome or firefox. and it is also not webkit
        if (isEdge) {
            isWebKit = isChrome = isFirefox = false;
        }
    }

    let isMac = appVer.indexOf('Mac') != -1;
    let isWin = appVer.indexOf('Win') != -1 || appVer.indexOf('NT') != -1;

    return {
        isMac: isMac,
        isWin: isWin,
        isWebKit: isWebKit,
        isIE: isIE,
        isIE11OrGreater: isIE11OrGreater,
        isSafari: isSafari,
        isChrome: isChrome,
        isFirefox: isFirefox,
        isEdge: isEdge,
    };
}

const browserData = getBrowserData();
export default browserData;
