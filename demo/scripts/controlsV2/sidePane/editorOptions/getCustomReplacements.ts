import { AutoReplace } from 'roosterjs-content-model-plugins';
import { ContentModelText } from 'roosterjs-content-model-types';

function replaceEmojis(
    previousSegment: ContentModelText,
    stringToReplace: string,
    replacement: string
) {
    const { text } = previousSegment;
    const textToReplace = text.split(' ').pop();
    if (textToReplace.trim() === stringToReplace) {
        previousSegment.text = text.replace(stringToReplace, replacement);
        return true;
    }
    return false;
}

export const emojiReplacements: AutoReplace[] = [
    {
        stringToReplace: ';)',
        replacementString: '😉',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: ';-)',
        replacementString: '😉',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: ';P',
        replacementString: '😜',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: ';-P',
        replacementString: '😜',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: '<3',
        replacementString: '❤️',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: '</3',
        replacementString: '💔',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: ';*',
        replacementString: '😘',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: ';-*',
        replacementString: '😘',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: 'B)',
        replacementString: '😎',
        replacementHandler: replaceEmojis,
    },
    {
        stringToReplace: 'B-)',
        replacementString: '😎',
        replacementHandler: replaceEmojis,
    },
];
