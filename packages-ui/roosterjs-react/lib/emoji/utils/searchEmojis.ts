import { Emoji } from '../type/Emoji';
import { forEachEmoji } from './emojiList';
import { Strings } from '../type/Strings';

export function searchEmojis(search: string, strings: Strings): Emoji[] {
    const shortcutMatch = matchShortcut(search);
    search = search.toLowerCase();
    const fullMatch: Emoji[] = shortcutMatch ? [shortcutMatch] : [];
    const partialMatch: Emoji[] = [];
    const partialSearch = ' ' + (search[0] == ':' ? search.substr(1) : search);
    forEachEmoji(emoji => {
        const keywords = strings[emoji.keywords] || '';
        const searchableKeywords = emoji.keywords ? ' ' + keywords.toLowerCase() + ' ' : '';
        const index = searchableKeywords.indexOf(partialSearch);
        if (index >= 0) {
            (searchableKeywords[index + partialSearch.length] == ' '
                ? fullMatch
                : partialMatch
            ).push(emoji);
        }
        return true;
    });

    return fullMatch.concat(partialMatch);
}

export function matchShortcut(search: string): Emoji {
    let result: Emoji;
    search = ' ' + search + ' ';
    forEachEmoji((emoji: Emoji) => {
        if (emoji.shortcut && (' ' + emoji.shortcut + ' ').indexOf(search) >= 0) {
            result = emoji;
            return false;
        }
        return true;
    });
    return result;
}
