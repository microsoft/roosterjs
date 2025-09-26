import { matchLink } from 'roosterjs-content-model-api';

/**
 * @internal
 */
export const isLastWordUrl = (text: string): boolean => {
    if (!text) return false;

    const words = text.trim().split(/\s+/);
    const lastWord = words[words.length - 1];

    return !!matchLink(lastWord)?.normalizedUrl;
};
