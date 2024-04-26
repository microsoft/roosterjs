import { ContentModelText } from 'roosterjs-content-model-types';
import { CustomReplace } from 'roosterjs-content-model-plugins';

function replaceEmojis(
    previousSegment: ContentModelText,
    stringToReplace: string,
    replacement: string
) {
    const { text } = previousSegment;
    const queryString = text.split(' ').pop();
    if (queryString === stringToReplace) {
        previousSegment.text = text.replace(stringToReplace, replacement);
        return true;
    }
    return false;
}

function makeEmojiReplacements(stringToReplace: string, replacement: string) {
    return {
        stringToReplace,
        replacementString: replacement,
        replacementHandler: replaceEmojis,
    };
}

export const emojiReplacements: CustomReplace[] = [
    makeEmojiReplacements(';)', '😉'),
    makeEmojiReplacements(';-)', '😉'),
    makeEmojiReplacements(';P', '😜'),
    makeEmojiReplacements(';-P', '😜'),
    makeEmojiReplacements('<3', '❤️'),
    makeEmojiReplacements('</3', '💔'),
    makeEmojiReplacements(';*', '😘'),
    makeEmojiReplacements(';-*', '😘'),
    makeEmojiReplacements('B)', '😎'),
    makeEmojiReplacements('B-)', '😎'),
];
