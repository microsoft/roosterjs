import { matchLink } from 'roosterjs-content-model-api';

const COMMON_REGEX = `[\s]*[a-zA-Z0-9+][\s]*`;
const TELEPHONE_REGEX = `(T|t)el:${COMMON_REGEX}`;
const MAILTO_REGEX = `(M|m)ailto:${COMMON_REGEX}`;

/**
 * @internal
 */
export function getLinkUrl(
    text: string,
    shouldLink: boolean,
    shouldMatchTel: boolean,
    shouldMatchMailto: boolean
): string | undefined {
    const linkMatch = shouldLink ? matchLink(text)?.normalizedUrl : undefined;
    const telMatch = shouldMatchTel ? matchTel(text) : undefined;
    const mailtoMatch = shouldMatchMailto ? matchMailTo(text) : undefined;

    return linkMatch || telMatch || mailtoMatch;
}

function matchTel(text: string) {
    return text.match(TELEPHONE_REGEX) ? text.toLocaleLowerCase() : undefined;
}

function matchMailTo(text: string) {
    return text.match(MAILTO_REGEX) ? text.toLocaleLowerCase() : undefined;
}
