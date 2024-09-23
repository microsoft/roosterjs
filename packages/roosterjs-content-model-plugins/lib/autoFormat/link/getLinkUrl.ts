import { matchLink } from 'roosterjs-content-model-api';
import type { AutoLinkOptions } from '../interface/AutoLinkOptions';

const COMMON_REGEX = `[\s]*[a-zA-Z0-9+][\s]*`;
const TELEPHONE_REGEX = `(T|t)el:${COMMON_REGEX}`;
const MAILTO_REGEX = `(M|m)ailto:${COMMON_REGEX}`;

/**
 * @internal
 */
export function getLinkUrl(text: string, autoLinkOptions: AutoLinkOptions): string | undefined {
    const { autoLink, autoMailto, autoTel } = autoLinkOptions;
    const linkMatch = autoLink ? matchLink(text)?.normalizedUrl : undefined;
    const telMatch = autoTel ? matchTel(text) : undefined;
    const mailtoMatch = autoMailto ? matchMailTo(text) : undefined;

    return linkMatch || telMatch || mailtoMatch;
}

function matchTel(text: string) {
    return text.match(TELEPHONE_REGEX) ? text.toLocaleLowerCase() : undefined;
}

function matchMailTo(text: string) {
    return text.match(MAILTO_REGEX) ? text.toLocaleLowerCase() : undefined;
}
