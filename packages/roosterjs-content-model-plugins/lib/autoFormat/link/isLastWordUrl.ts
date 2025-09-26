import { matchLink } from 'roosterjs-content-model-api';

/**
 * @internal
 */
export const isLastWordUrl = (text: string): boolean => {
    if (!text) {
        return false;
    }

    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1];

    const isMailto = lastWord.toLowerCase().startsWith('mailto:');
    const isTel = lastWord.toLowerCase().startsWith('tel:');

    if (isMailto || isTel) {
        const protocolLength = isMailto ? 7 : 4; // 'mailto:' = 7, 'tel:' = 4
        return lastWord.length > protocolLength;
    }

    // Use matchLink for other URL types
    return !!matchLink(lastWord)?.normalizedUrl;
};
