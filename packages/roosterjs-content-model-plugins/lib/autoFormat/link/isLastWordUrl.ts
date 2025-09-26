import { matchLink } from 'roosterjs-content-model-api';

/**
 * @internal
 */
export const isLastWordUrl = (text: string): boolean => {
    if (!text) return false;

    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1];

    const isMailto = lastWord.toLowerCase().startsWith('mailto:');
    const isTel = lastWord.toLowerCase().startsWith('tel:');

    // Use matchLink for other URL types
    return !!matchLink(lastWord)?.normalizedUrl || isMailto || isTel;
};
