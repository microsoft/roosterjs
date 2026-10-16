const UnsafeProtocols = ['javascript', 'vbscript', 'livescript', 'jscript', 'mocha', 'script'];
const IgnoredCharacters = /[\t\n\r]/g;
const MaxControlCharCode = 0x20;

/**
 * Check whether the given URL uses a protocol that can execute script, such as "javascript:"
 * @param url The URL to check
 * @returns True if the URL can execute script when navigated to, otherwise false
 * @remarks Browsers remove every TAB, LF and CR character from a URL and ignore any leading control
 * character or space before they resolve its protocol. Those characters must be removed before the
 * protocol is checked here, otherwise a value such as "java&#9;script:" or "javascr&#13;ipt:" would
 * be treated as safe but still executed by the browser.
 */
export function isUnsafeUrl(url: string | null | undefined): boolean {
    if (!url) {
        return false;
    }

    const normalizedUrl = trimControlCharacters(url.replace(IgnoredCharacters, '')).toLowerCase();
    const colonIndex = normalizedUrl.indexOf(':');

    return colonIndex >= 0 && UnsafeProtocols.indexOf(normalizedUrl.substring(0, colonIndex)) >= 0;
}

function trimControlCharacters(url: string): string {
    let start = 0;

    while (start < url.length && url.charCodeAt(start) <= MaxControlCharCode) {
        start++;
    }

    return url.substring(start);
}
