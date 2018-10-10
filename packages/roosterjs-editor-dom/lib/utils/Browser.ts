import { BrowserInfo } from 'roosterjs-editor-types';

/**
 * Get current browser information from user agent string
 * @param userAgent The userAgent string of a browser
 * @param appVersion The appVersion string of a browser
 * @returns The BrowserInfo object calculated from the given userAgent and appVersion
 */
export function getBrowserInfo(userAgent: string, appVersion: string): BrowserInfo {
    // checks whether the browser is running in IE
    // IE11 will use rv in UA instead of MSIE. Unfortunately Firefox also uses this. We should also look for "Trident" to confirm this.
    // There have been cases where companies using older version of IE and custom UserAgents have broken this logic (e.g. IE 10 and KellyServices)
    // therefore we should check that the Trident/rv combo is not just from an older IE browser
    let isIE11OrGreater = userAgent.indexOf('rv:') != -1 && userAgent.indexOf('Trident') != -1;
    let isIE = userAgent.indexOf('MSIE') != -1 || isIE11OrGreater;

    // IE11+ may also have 'Chrome', 'Firefox' and 'Safari' in user agent. But it will have 'trident' as well
    let isChrome = false;
    let isFirefox = false;
    let isSafari = false;
    let isEdge = false;
    let isWebKit = userAgent.indexOf('WebKit') != -1;

    if (!isIE) {
        isChrome = userAgent.indexOf('Chrome') != -1;
        isFirefox = userAgent.indexOf('Firefox') != -1;
        if (userAgent.indexOf('Safari') != -1) {
            // Android and Chrome have Safari in the user string
            isSafari = userAgent.indexOf('Chrome') == -1 && userAgent.indexOf('Android') == -1;
        }

        // Sample Edge UA: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10121
        isEdge = userAgent.indexOf('Edge') != -1;

        // When it is edge, it should not be chrome or firefox. and it is also not webkit
        if (isEdge) {
            isWebKit = isChrome = isFirefox = false;
        }
    }

    let isMac = appVersion.indexOf('Mac') != -1;
    let isWin = appVersion.indexOf('Win') != -1 || appVersion.indexOf('NT') != -1;

    return {
        isMac,
        isWin,
        isWebKit,
        isIE,
        isIE11OrGreater,
        isSafari,
        isChrome,
        isFirefox,
        isEdge,
        isIEOrEdge: isIE || isEdge,
    };
}

const Browser = window
    ? getBrowserInfo(window.navigator.userAgent, window.navigator.appVersion)
    : {};

export default Browser;
