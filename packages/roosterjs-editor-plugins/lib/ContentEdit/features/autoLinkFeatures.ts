import { ChangeSource, LinkData, PluginDomEvent } from 'roosterjs-editor-types';
import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import {
    cacheGetCursorEventData,
    clearCursorEventDataCache,
    replaceTextBeforeCursorWithNode,
} from 'roosterjs-editor-api';
import { matchLink } from 'roosterjs-editor-dom';

// When user type, they may end a link with a puncatuation, i.e. www.bing.com;
// we need to trim off the trailing puncatuation before turning it to link match
const TRAILING_PUNCTUATION_REGEX = /[.+={}\[\]\s:;"',>]+$/i;
const MINIMUM_LENGTH = 5;
const KEY_ENTER = 13;
const KEY_SPACE = 32;

export const AutoLink: ContentEditFeature = {
    keys: [KEY_ENTER, KEY_SPACE],
    shouldHandleEvent: cacheGetLinkData,
    handleEvent: autoLink,
};

function cacheGetLinkData(event: PluginDomEvent, editor: Editor): LinkData {
    return cacheGetEventData(event, 'LINK_DATA', () => {
        let cursorData = cacheGetCursorEventData(event, editor);
        let word = cursorData && cursorData.wordBeforeCursor;
        if (word && word.length > MINIMUM_LENGTH) {
            // Check for trailing punctuation
            let trailingPunctuations = word.match(TRAILING_PUNCTUATION_REGEX);
            let trailingPunctuation = (trailingPunctuations || [])[0] || '';
            let candidate = word.substring(0, word.length - trailingPunctuation.length);

            // Do special handling for ')'
            if (candidate[candidate.length - 1] == ')' && candidate.indexOf('(') < 0) {
                candidate = candidate.substr(0, candidate.length - 1);
            }

            // Match and replace in editor
            return matchLink(candidate);
        }
        return null;
    });
}

function autoLink(event: PluginDomEvent, editor: Editor) {
    let cursorData = cacheGetCursorEventData(event, editor);
    let anchor = editor.getDocument().createElement('a');
    let linkData = cacheGetLinkData(event, editor);
    anchor.textContent = linkData.originalUrl;
    anchor.href = linkData.normalizedUrl;

    editor.runAsync(() => {
        editor.performAutoComplete(() => {
            replaceTextBeforeCursorWithNode(
                editor,
                linkData.originalUrl,
                anchor,
                false /* exactMatch */,
                cursorData
            );

            // The content at cursor has changed. Should also clear the cursor data cache
            clearCursorEventDataCache(event);

            // Explicitly trigger ContentChanged event here and do not trigger it from performAutoComplete,
            // because we want the anchor can be handled by other plugins (e.g. HyperLink) before undo snapshot is added
            editor.triggerContentChangedEvent(ChangeSource.AutoLink, anchor);
        });
    });
}
