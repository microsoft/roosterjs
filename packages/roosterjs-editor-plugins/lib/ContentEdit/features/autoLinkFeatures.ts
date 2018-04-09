import { ChangeSource, LinkData, PluginDomEvent } from 'roosterjs-editor-types';
import { ContentEditFeature } from '../ContentEditFeatures';
import {
    Editor,
    cacheGetEventData,
    cacheGetCursorEventData,
    clearCursorEventDataCache,
} from 'roosterjs-editor-core';
import { matchLink } from 'roosterjs-editor-dom';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const TRAILING_PUNCTUATION_REGEX = /[.()+={}\[\]\s:;"',>]+$/i;
const MINIMUM_LENGTH = 5;
const KEY_ENTER = 13;
const KEY_SPACE = 32;

export const AutoLink1: ContentEditFeature = {
    key: KEY_ENTER,
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
};

export const AutoLink2: ContentEditFeature = {
    key: KEY_SPACE,
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
};

function cacheGetLinkData(event: PluginDomEvent, editor: Editor): LinkData {
    return cacheGetEventData(event, 'LINK_DATA', () => {
        let cursorData = cacheGetCursorEventData(event, editor);
        let wordBeforeCursor = cursorData ? cursorData.getWordBeforeCursor() : null;
        if (wordBeforeCursor && wordBeforeCursor.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            let trailingPunctuations = wordBeforeCursor.match(TRAILING_PUNCTUATION_REGEX);
            let trailingPunctuation =
                trailingPunctuations && trailingPunctuations.length > 0
                    ? trailingPunctuations[0]
                    : null;

            // Compute the link candidate
            let linkCandidate = wordBeforeCursor.substring(
                0,
                trailingPunctuation
                    ? wordBeforeCursor.length - trailingPunctuation.length
                    : wordBeforeCursor.length
            );

            // Match and replace in editor
            return matchLink(linkCandidate);
        }
        return null;
    });
}

function autoLink(event: PluginDomEvent, editor: Editor) {
    let anchor = editor.getDocument().createElement('a');
    let linkData = cacheGetLinkData(event, editor);
    anchor.textContent = linkData.originalUrl;
    anchor.href = linkData.normalizedUrl;

    editor.runAsync(() => {
        editor.formatWithUndo(
            () => {
                let cursorData = cacheGetCursorEventData(event, editor);
                let range = cursorData.getRangeWithForTextBeforeCursor(
                    linkData.originalUrl,
                    false /*exactMatch*/
                );
                if (range && range.replaceWithNode(anchor)) {
                    // The content at cursor has changed. Should also clear the cursor data cache
                    clearCursorEventDataCache(event);
                }
            },
            true /*preserveSelection*/,
            ChangeSource.AutoLink,
            () => anchor
        );
    });
    return ChangeSource.AutoLink;
}
