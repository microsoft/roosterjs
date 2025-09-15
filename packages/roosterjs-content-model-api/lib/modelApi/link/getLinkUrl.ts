import { matchLink } from './matchLink';
import type { AutoLinkOptions } from 'roosterjs-content-model-types';

const COMMON_REGEX = `[\s]*[a-zA-Z0-9+][\s]*`;
const TELEPHONE_REGEX = `(T|t)el:${COMMON_REGEX}`;
const MAILTO_REGEX = `(M|m)ailto:${COMMON_REGEX}`;

/**
 * @internal
 */
export function getLinkUrl(text: string, autoLinkOptions?: AutoLinkOptions): string | undefined {
    const { autoLink, autoMailto, autoTel } = autoLinkOptions ?? {};
    const linkMatch = autoLink ? matchLink(text)?.normalizedUrl : undefined;
    const telMatch = autoTel ? matchTel(text) : undefined;
    const mailtoMatch = autoMailto ? matchMailTo(text) : undefined;

    return linkMatch || telMatch || mailtoMatch;
}

function matchTel(text: string) {
    return text.match(TELEPHONE_REGEX) ? text.toLocaleLowerCase() : undefined;
}

function matchMailTo(text: string) {
    // Check if text matches MAILTO_REGEX directly
    if (text.match(MAILTO_REGEX)) {
        return text.toLocaleLowerCase();
    }

    // Only add 'mailto:' if text matches COMMON_REGEX
    if (text.match(COMMON_REGEX)) {
        const prefixed = 'mailto:' + text;
        if (prefixed.match(MAILTO_REGEX)) {
            return prefixed.toLocaleLowerCase();
        }
    }
    return undefined;
}
